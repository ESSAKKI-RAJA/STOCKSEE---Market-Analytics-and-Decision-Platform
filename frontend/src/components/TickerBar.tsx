import { useState, useEffect } from "react";
import { marketIndices as initialIndices } from "@/data/stockData";

export default function TickerBar() {
  const [items, setItems] = useState([...initialIndices, ...initialIndices]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setItems((prevItems) => {
        const newIndices = prevItems.slice(0, prevItems.length / 2).map((item) => {
          // Simulate slight market movement
          const volatility = item.value * 0.0005;
          const change = (Math.random() - 0.48) * volatility;
          const newValue = item.value + change;
          const newChangePercent = item.change + (change / item.value) * 100;
          return {
            ...item,
            value: newValue,
            change: newChangePercent,
          };
        });
        return [...newIndices, ...newIndices];
      });
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: 36,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-1)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* LEFT LABEL */}
      <div
        style={{
          padding: "0 16px",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--blue)",
          borderRight: "1px solid var(--border-1)",
          flexShrink: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "rgba(59,130,246,0.05)",
          boxShadow: "inset -1px 0 0 rgba(59,130,246,0.2)",
        }}
      >
        <span className="t-live" style={{ marginRight: "8px" }} />
        LIVE
      </div>

      {/* SCROLLING ITEMS */}
      <div
        style={{ overflow: "hidden", flex: 1, position: "relative" }}
      >
        <div
          className="animate-ticker-scroll"
          style={{ display: "flex", width: "max-content" }}
        >
          {items.map((idx, i) => {
            const isUp = idx.change >= 0;
            return (
              <div key={i} className="t-ticker-item" style={{ padding: "0 24px", borderRight: "1px solid var(--border-1)" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{idx.flag}</span>
                  {idx.name}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-1)",
                    fontFeatureSettings: '"tnum"',
                    marginLeft: "12px",
                  }}
                >
                  {idx.value.toLocaleString()}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    color: isUp ? "var(--green)" : "var(--red)",
                    fontFeatureSettings: '"tnum"',
                    marginLeft: "8px",
                    background: isUp ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{idx.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT TIMESTAMP */}
      <div
        style={{
          padding: "0 16px",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          color: "var(--text-muted)",
          borderLeft: "1px solid var(--border-1)",
          flexShrink: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "var(--bg)",
          letterSpacing: "0.05em",
        }}
      >
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
