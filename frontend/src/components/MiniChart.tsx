import { useMemo, useRef, useEffect } from "react";

export default function AnimatedMiniChart({ isUp }: { isUp: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const progressRef = useRef(0);

  const points = useMemo(() => {
    const pts: number[] = [];
    let y = 50;
    for (let i = 0; i < 24; i++) {
      y += (Math.random() - (isUp ? 0.42 : 0.58)) * 10;
      y = Math.max(8, Math.min(92, y));
      pts.push(y);
    }
    return pts;
  }, [isUp]);

  const color = isUp ? "#10B981" : "#EF4444";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const prog = Math.min(progressRef.current, 1);
      const visibleCount = Math.max(2, Math.floor(prog * points.length));

      // Build path
      const step = W / (points.length - 1);
      ctx.beginPath();
      points.slice(0, visibleCount).forEach((y, i) => {
        const px = i * step;
        const py = (y / 100) * H;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });

      // Stroke
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Fill gradient
      const lastX = (visibleCount - 1) * step;
      const lastY = (points[visibleCount - 1] / 100) * H;
      ctx.lineTo(lastX, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `${color}35`);
      grad.addColorStop(1, `${color}00`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Glowing dot at tip
      if (prog >= 1) {
        const tipX = (points.length - 1) * step;
        const tipY = (points[points.length - 1] / 100) * H;
        const dotGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 5);
        dotGrad.addColorStop(0, color);
        dotGrad.addColorStop(0.4, `${color}80`);
        dotGrad.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
        ctx.fillStyle = dotGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      if (prog < 1) {
        progressRef.current += 0.04;
        animRef.current = requestAnimationFrame(draw);
      }
    };

    progressRef.current = 0;
    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [points, color]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={56}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
