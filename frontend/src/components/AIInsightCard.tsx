import { Activity, Cpu } from "lucide-react";
import { useStockAnalysis } from "@/hooks/useStockAnalysis";
import StatusBadge from "./StatusBadge";

interface Props {
  symbol: string;
  exchange?: string;
}

const trendIcon: Record<string, string> = {
  bullish: "▲",
  bearish: "▼",
  sideways: "■",
};

const trendCls: Record<string, string> = {
  bullish: "text-[var(--green)]",
  bearish: "text-[var(--red)]",
  sideways: "text-[var(--text-muted)]",
};

const riskCls: Record<string, string> = {
  low: "text-[var(--green)]",
  medium: "text-[var(--blue)]",
  high: "text-[var(--red)]",
};

export default function AIInsightCard({ symbol, exchange }: Props) {
  const { data, loading, error } = useStockAnalysis(symbol, exchange);

  return (
    <div className="t-panel p-0 overflow-hidden shadow-lg border-[rgba(59,130,246,0.2)] relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(59,130,246,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="px-5 py-4 border-b border-[var(--border-1)] bg-[var(--surface-1)] flex justify-between items-center relative z-10">
        <span className="font-semibold text-white tracking-wide flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-[var(--blue)]" />
          </div>
          Quant Engine
        </span>
        {data && (
          <span className="text-[10px] text-[var(--blue)] font-mono tracking-wider bg-[rgba(59,130,246,0.1)] px-2 py-1 rounded border border-[rgba(59,130,246,0.2)]">
            [{data.mode === "real" ? "LIVE" : data.mode === "mixed" ? "MIXED" : "DEMO"} · {data.confidence}% CONF]
          </span>
        )}
      </div>

      <div className="p-5 relative z-10">
        {loading && (
          <div className="flex items-center gap-2 text-[var(--blue)] font-mono text-xs font-semibold tracking-wider animate-pulse py-4">
            <Activity className="w-4 h-4 animate-spin" />
            PROCESSING ALGORITHMS...
          </div>
        )}

        {error && !loading && (
          <div className="p-3 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] rounded-lg text-[var(--blue)] font-mono text-xs font-semibold text-center">
            Live Quant Analysis Ready
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-5">
            {/* Mode/Source badge */}
            <StatusBadge
              responseMode={data.mode}
              responseSource={data.source}
              generatedAt={data.generatedAt}
              confidence={String(data.confidence)}
              cacheHit={data.cached}
              variant="inline"
            />

            <p className="text-sm text-[var(--text-1)] leading-relaxed italic border-l-2 border-[var(--blue)] pl-3">
              "{data.insight}"
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[rgba(59,130,246,0.02)] border-y border-[var(--border-1)] text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                    <th className="py-2 px-3 font-medium">Factor</th>
                    <th className="py-2 px-3 font-medium text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-1)]">
                  <tr className="hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                    <td className="py-2.5 px-3 text-xs text-[var(--text-muted)]">Trend</td>
                    <td className={`py-2.5 px-3 text-xs font-bold text-right ${trendCls[data.trend] || "text-[var(--text-muted)]"}`}>
                      {trendIcon[data.trend] || "■"} {data.trend.toUpperCase()}
                    </td>
                  </tr>
                  <tr className="hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                    <td className="py-2.5 px-3 text-xs text-[var(--text-muted)]">Momentum</td>
                    <td className="py-2.5 px-3 text-xs font-bold text-right text-white">
                      {data.momentum.toUpperCase()}
                    </td>
                  </tr>
                  <tr className="hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                    <td className="py-2.5 px-3 text-xs text-[var(--text-muted)]">Risk</td>
                    <td className={`py-2.5 px-3 text-xs font-bold text-right ${riskCls[data.risk] || "text-[var(--text-muted)]"}`}>
                      {data.risk.toUpperCase()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[rgba(59,130,246,0.02)] border-y border-[var(--border-1)] text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                    <th className="py-2 px-2 font-medium">SMA 20</th>
                    <th className="py-2 px-2 font-medium">SMA 50</th>
                    <th className="py-2 px-2 font-medium">SMA 200</th>
                    <th className="py-2 px-2 font-medium">RSI 14</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-1)]">
                  <tr className="hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                    <td className="py-2.5 px-2 text-xs font-mono font-medium text-white">{data.sma_20 != null ? data.sma_20.toFixed(2) : "—"}</td>
                    <td className="py-2.5 px-2 text-xs font-mono font-medium text-white">{data.sma_50 != null ? data.sma_50.toFixed(2) : "—"}</td>
                    <td className="py-2.5 px-2 text-xs font-mono font-medium text-white">{data.sma_200 != null ? data.sma_200.toFixed(2) : "—"}</td>
                    <td className={`py-2.5 px-2 text-xs font-mono font-bold ${
                      (data.rsi_14 || 50) > 70 ? "text-[var(--red)]" : (data.rsi_14 || 50) < 30 ? "text-[var(--green)]" : "text-white"
                    }`}>
                      {data.rsi_14 != null ? data.rsi_14.toFixed(2) : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Limitations notice */}
            {data.limitations && (
              <div className="text-[10px] text-[var(--text-muted)] font-mono border-t border-[var(--border-1)] pt-2 mt-1">
                ⚠ {data.limitations}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
