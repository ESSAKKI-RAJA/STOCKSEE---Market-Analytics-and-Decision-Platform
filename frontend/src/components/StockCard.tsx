import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Stock } from "@/data/stockData";
import AnimatedMiniChart from "./MiniChart";
import WatchlistButton from "./WatchlistButton";
import { formatCurrency } from "@/lib/currency";
import { motion } from "framer-motion";

interface StockCardProps {
  stock: Stock;
  isLive?: boolean;
  source?: string | null;
  delayLabel?: string | null;
  discrepancy?: boolean;
}

export default function StockCard({ stock, isLive, source, delayLabel, discrepancy }: StockCardProps) {
  const isUp = stock.change >= 0;
  const color = isUp ? "#10B981" : "#EF4444";
  const glowColor = isUp ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full"
    >
      <div
        className="relative h-full overflow-hidden bg-[var(--surface-1)] border border-[var(--border-1)] rounded-2xl shadow-lg transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = isUp ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
          el.style.boxShadow = `0 20px 56px rgba(0,0,0,0.5), 0 0 32px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border-1)";
          el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)";
        }}
      >
        {/* Top-right ambient glow */}
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 100, height: 100, borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(20px)", pointerEvents: "none",
          opacity: 0, transition: "opacity 0.3s ease",
        }} className="group-hover:opacity-100" />

        {/* Watchlist button */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WatchlistButton symbol={stock.symbol} exchange={stock.exchange} />
        </div>

        <Link to={`/stock/${stock.symbol}`} className="block p-5 h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.1)] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                {stock.flag}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white tracking-tight group-hover:text-[var(--blue)] transition-colors">{stock.symbol}</h3>
                  {isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_6px_2px_rgba(16,185,129,0.5)] animate-pulse inline-block" />
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[130px] mt-0.5 font-medium">{stock.name}</p>
              </div>
            </div>
            <span className="t-badge bg-[rgba(59,130,246,0.1)] text-[var(--blue)] border border-[rgba(59,130,246,0.2)]">
              {stock.exchange}
            </span>
          </div>

          {/* Mini Chart */}
          <div className="h-14 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <AnimatedMiniChart isUp={isUp} />
          </div>

          {/* Price + Change */}
          <div className="flex items-end justify-between relative z-10">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              {formatCurrency(stock.price, stock.exchange)}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono border ${isUp ? "text-[var(--green)] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]" : "text-[var(--red)] bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]"}`}>
              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
            </span>
          </div>

          {/* Sector tag */}
          {stock.sector && (
            <div className="mt-4 pt-3 border-t border-[var(--border-1)]">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                {stock.sector}
              </span>
            </div>
          )}
        </Link>
      </div>
    </motion.div>
  );
}
