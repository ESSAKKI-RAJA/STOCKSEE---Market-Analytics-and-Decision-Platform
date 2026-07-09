import { useEffect, useRef, useMemo } from "react";

/* ─── Floating Stock Card ─── */
function FloatingCard({ symbol, price, change, delay, x, y }: {
  symbol: string; price: string; change: string; positive: boolean;
  delay: number; x: number; y: number;
}) {
  const isPos = !change.startsWith("-");
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `float-slow ${5 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        zIndex: 1,
      }}
    >
      <div
        style={{
          background: "rgba(13, 21, 38, 0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "10px 14px",
          minWidth: "120px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <span style={{ fontWeight: 700, fontSize: "12px", color: "#fff", fontFamily: "monospace" }}>{symbol}</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: isPos ? "#00E676" : "#FF4560",
              background: isPos ? "rgba(0,230,118,0.1)" : "rgba(255,69,96,0.1)",
              padding: "2px 6px",
              borderRadius: "6px",
            }}
          >
            {isPos ? "+" : ""}{change}
          </span>
        </div>
        <div style={{ marginTop: "4px", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "monospace" }}>
          {price}
        </div>
        {/* Mini sparkline */}
        <svg width="100%" height="22" viewBox="0 0 100 22" style={{ marginTop: "6px" }}>
          <polyline
            fill="none"
            stroke={isPos ? "#00E676" : "#FF4560"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={isPos
              ? "0,18 12,14 25,16 38,10 50,12 62,8 75,5 88,3 100,2"
              : "0,4 12,8 25,6 38,12 50,10 62,14 75,17 88,15 100,20"}
          />
        </svg>
      </div>
    </div>
  );
}

/* ─── Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.3,
    }));

    // Glowing network nodes
    const nodes = Array.from({ length: 16 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 3 + 1.5,
    }));

    let raf: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      // Draw connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const alpha = (1 - dist / 200) * 0.12;
            ctx.strokeStyle = `rgba(232,184,75,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grd.addColorStop(0, "rgba(232,184,75,0.45)");
        grd.addColorStop(1, "rgba(232,184,75,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232,184,75,0.7)";
        ctx.fill();
      });

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        p.pulse += 0.02;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(232,184,75,${a})`
          : `rgba(255,255,255,${a * 0.4})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}

/* ─── Animated Chart Lines ─── */
function BackgroundCharts() {
  const lines = useMemo(() => [
    {
      id: "cl1",
      d: "M0,120 C80,90 160,140 240,100 C320,60 400,110 480,80 C560,50 640,90 720,60 C800,30 880,70 960,45",
      color: "rgba(232,184,75,0.12)",
      dashLen: 600,
      dur: 8,
      x: 0, y: 0,
    },
    {
      id: "cl2",
      d: "M0,80 C100,110 200,60 300,90 C400,120 500,70 600,95 C700,120 800,80 900,60",
      color: "rgba(0,230,118,0.07)",
      dashLen: 550,
      dur: 12,
      x: 0, y: 120,
    },
    {
      id: "cl3",
      d: "M0,50 C120,80 240,30 360,60 C480,90 600,40 720,70 C840,100 960,55 1080,75",
      color: "rgba(232,184,75,0.07)",
      dashLen: 700,
      dur: 15,
      x: 200, y: 300,
    },
  ], []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {lines.map((l) => (
        <svg
          key={l.id}
          style={{
            position: "absolute",
            left: l.x,
            top: l.y,
            width: "100%",
            height: "200px",
            overflow: "visible",
          }}
          viewBox="0 0 960 160"
          preserveAspectRatio="none"
        >
          <path
            d={l.d}
            fill="none"
            stroke={l.color}
            strokeWidth="1.5"
            strokeDasharray={l.dashLen}
            strokeDashoffset={l.dashLen}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={l.dashLen}
              to={-l.dashLen}
              dur={`${l.dur}s`}
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </svg>
      ))}

      {/* Faint grid lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─── Ambient Gradient Blobs ─── */
function AmbientBlobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Top-left gold blob */}
      <div style={{
        position: "absolute", top: "-15%", left: "-10%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "drift-x 18s ease-in-out infinite",
      }} />
      {/* Top-right blue blob */}
      <div style={{
        position: "absolute", top: "-20%", right: "-15%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "drift-x 22s ease-in-out infinite reverse",
      }} />
      {/* Bottom emerald blob */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "30%",
        width: "45vw", height: "45vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,230,118,0.04) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "drift-x 25s ease-in-out infinite 5s",
      }} />
    </div>
  );
}

/* ─── Floating Stock Cards ─── */
const FLOAT_CARDS = [
  { symbol: "NVDA", price: "$875.40", change: "+3.2%", positive: true,  delay: 0,   x: 78, y: 12 },
  { symbol: "TSLA", price: "$248.60", change: "-1.4%", positive: false, delay: 1.5, x: 82, y: 52 },
  { symbol: "AAPL", price: "$189.75", change: "+0.8%", positive: true,  delay: 0.8, x: 70, y: 76 },
];

/* ─── Main Export ─── */
export default function AnimatedBackground({ showCards = true }: { showCards?: boolean }) {
  return (
    <>
      <AmbientBlobs />
      <BackgroundCharts />
      <ParticleCanvas />
      {showCards && FLOAT_CARDS.map((c) => (
        <FloatingCard key={c.symbol} {...c} />
      ))}
    </>
  );
}
