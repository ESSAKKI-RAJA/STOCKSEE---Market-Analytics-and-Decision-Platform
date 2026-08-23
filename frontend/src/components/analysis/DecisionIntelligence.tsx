import { Brain, TrendingUp, TrendingDown, Activity, ShieldAlert, Loader2, AlertTriangle, Shield } from "lucide-react";
import { useStockAnalysis } from "@/hooks/useStockAnalysis";

interface DecisionIntelligenceProps {
  symbol: string;
}

const SIGNAL_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  "Bullish Setup": { color: "text-emerald-500", icon: <TrendingUp className="w-4 h-4" /> },
  "Bearish Setup": { color: "text-rose-500", icon: <TrendingDown className="w-4 h-4" /> },
  "Neutral / Wait": { color: "text-amber-500", icon: <Activity className="w-4 h-4" /> },
  "High Uncertainty": { color: "text-amber-400", icon: <AlertTriangle className="w-4 h-4" /> },
  "Risk Elevated": { color: "text-orange-400", icon: <ShieldAlert className="w-4 h-4" /> },
};

const CONFIDENCE_COLOR: Record<string, string> = {
  "High": "text-emerald-500",
  "Medium": "text-amber-500",
  "Low-Medium": "text-orange-400",
  "Low": "text-orange-500",
  "None": "text-zinc-500",
};

const RISK_COLOR: Record<string, string> = {
  "LOW": "text-emerald-500",
  "MODERATE": "text-amber-500",
  "ELEVATED": "text-orange-400",
  "HIGH": "text-rose-500",
  "UNKNOWN": "text-zinc-500",
};

export default function DecisionIntelligence({ symbol }: DecisionIntelligenceProps) {
  const { data, loading, error } = useStockAnalysis(symbol, !!symbol);

  return (
    <div className="stocksee-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800">
        <Brain className="w-5 h-5 text-sky-500" />
        <h2 className="font-heading font-bold text-[14px] uppercase tracking-wide text-zinc-100 m-0">
          Decision Intelligence
        </h2>
        {data && (
          <span className={`ml-auto text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border ${
            data.mode === "real" ? "border-emerald-500/30 text-emerald-500" :
            data.mode === "demo" ? "border-amber-500/30 text-amber-500" :
            "border-zinc-700 text-zinc-500"
          }`}>
            {data.mode?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
          <span className="text-xs text-zinc-500 font-mono">Loading signal…</span>
        </div>
      )}

      {/* Error state */}
      {!loading && (error || !data) && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span className="text-xs text-zinc-500 text-center">
            {error || "Signal unavailable. Backend may be warming up."}
          </span>
        </div>
      )}

      {/* Signal data */}
      {!loading && data && (
        <div className="flex-1 flex flex-col gap-5">
          {/* Primary signal + risk */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">
                Primary Signal
              </div>
              <div className={`text-2xl font-heading font-black tracking-tight flex items-center gap-2 ${
                SIGNAL_CONFIG[data.signalLabel]?.color || "text-zinc-400"
              }`}>
                {SIGNAL_CONFIG[data.signalLabel]?.icon}
                {data.signalLabel}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">
                Confidence
              </div>
              <div className={`text-xl font-mono font-bold ${CONFIDENCE_COLOR[data.confidence] || "text-zinc-400"}`}>
                {data.confidence}
              </div>
            </div>
          </div>

          {/* Technical summary grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                <ShieldAlert className="w-3 h-3 text-sky-500" /> Risk Level
              </div>
              <div className={`font-mono text-[13px] font-bold ${RISK_COLOR[data.riskLevel] || "text-zinc-400"}`}>
                {data.riskLevel}
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                <Activity className="w-3 h-3 text-sky-500" /> Conflicts
              </div>
              <div className={`font-mono text-[13px] font-bold ${
                data.conflicts.length === 0 ? "text-emerald-500" :
                data.conflicts.length === 1 ? "text-amber-500" : "text-rose-500"
              }`}>
                {data.conflicts.length} detected
              </div>
            </div>
          </div>

          {/* Bullish evidence */}
          {data.bullishEvidence.length > 0 && (
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Supporting
              </div>
              <ul className="space-y-1.5">
                {data.bullishEvidence.map((ev, i) => (
                  <li key={i} className="text-[11px] text-zinc-300 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bearish evidence */}
          {data.bearishEvidence.length > 0 && (
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-rose-500" /> Counter
              </div>
              <ul className="space-y-1.5">
                {data.bearishEvidence.map((ev, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5 flex-shrink-0">⚠</span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conflicts */}
          {data.conflicts.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              <div className="text-[10px] font-bold tracking-widest uppercase text-amber-500 mb-2">
                Conflicts Detected
              </div>
              <ul className="space-y-1">
                {data.conflicts.map((c, i) => (
                  <li key={i} className="text-[11px] text-amber-300/80">! {c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Limitations */}
          {data.limitations.length > 0 && (
            <div className="mt-auto flex items-start gap-1.5 text-[10px] text-zinc-600">
              <Shield className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>{data.limitations.join(". ")}</span>
            </div>
          )}

          <div className="text-[9px] text-zinc-700 mt-auto italic">
            Analysis only · Not financial advice
          </div>
        </div>
      )}
    </div>
  );
}
