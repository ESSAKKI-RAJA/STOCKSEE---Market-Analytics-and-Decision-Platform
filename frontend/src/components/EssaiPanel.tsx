import { useEffect, useState } from "react";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Eye, CheckCircle2, XCircle, Loader2, Info, ChevronDown, ChevronUp, Zap, Shield } from "lucide-react";
import { useEssai, type EssaiAnalysis } from "@/hooks/useEssai";

interface EssaiPanelProps {
  symbol: string;
  onOpenChat?: () => void;
}

const VIEW_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  "BULLISH": { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: <TrendingUp className="w-5 h-5" /> },
  "MODERATELY BULLISH": { color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/25", icon: <TrendingUp className="w-5 h-5" /> },
  "NEUTRAL": { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: <Zap className="w-5 h-5" /> },
  "MODERATELY BEARISH": { color: "text-rose-400", bg: "bg-rose-500/8", border: "border-rose-500/25", icon: <TrendingDown className="w-5 h-5" /> },
  "BEARISH": { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", icon: <TrendingDown className="w-5 h-5" /> },
  "HIGH UNCERTAINTY": { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: <AlertTriangle className="w-5 h-5" /> },
  "INSUFFICIENT EVIDENCE": { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30", icon: <Info className="w-5 h-5" /> },
};

function ConfidenceBar({ score, level }: { score: number; level: string }) {
  const barColor =
    level === "HIGH" ? "bg-emerald-500" :
    level === "MEDIUM" ? "bg-amber-500" :
    level === "LOW" ? "bg-orange-500" : "bg-zinc-600";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-mono font-bold ${
        level === "HIGH" ? "text-emerald-400" :
        level === "MEDIUM" ? "text-amber-400" :
        level === "LOW" ? "text-orange-400" : "text-zinc-500"
      }`}>{score}%</span>
    </div>
  );
}

function QualityBadge({ quality }: { quality: string }) {
  const cfg =
    quality === "HIGH" ? { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", label: "HIGH QUALITY" } :
    quality === "MEDIUM" ? { cls: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "MEDIUM QUALITY" } :
    quality === "LOW" ? { cls: "bg-orange-500/15 text-orange-400 border-orange-500/30", label: "LOW QUALITY" } :
    { cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30", label: "UNAVAILABLE" };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold tracking-widest ${cfg.cls}`}>
      <Shield className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

export default function EssaiPanel({ symbol, onOpenChat }: EssaiPanelProps) {
  const { analysis, loadingAnalysis, analysisError, analyseSymbol } = useEssai();
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (symbol) analyseSymbol(symbol);
  }, [symbol, analyseSymbol]);

  if (loadingAnalysis) {
    return (
      <div className="flex flex-col gap-3 p-5 h-full">
        <div className="flex items-center gap-2 text-sky-400">
          <Brain className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">ESSAI Intelligence</span>
          <span className="ml-auto text-[10px] text-zinc-500 font-mono">STOCKSEE AI</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
          <span className="text-xs text-zinc-500 font-mono animate-pulse">Gathering market evidence…</span>
        </div>
      </div>
    );
  }

  if (analysisError || !analysis) {
    return (
      <div className="flex flex-col gap-3 p-5 h-full">
        <div className="flex items-center gap-2 text-sky-400">
          <Brain className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">ESSAI Intelligence</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span className="text-xs text-zinc-500 text-center">
            {analysisError || "Unable to load ESSAI analysis. Backend may be starting up."}
          </span>
          <button
            onClick={() => analyseSymbol(symbol)}
            className="mt-2 text-xs text-sky-400 hover:text-sky-300 border border-sky-500/30 px-3 py-1 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const viewCfg = VIEW_CONFIG[analysis.view] || VIEW_CONFIG["NEUTRAL"];

  return (
    <div className="flex flex-col gap-4 p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-300">ESSAI Intelligence</span>
        <span className="ml-auto text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
          {analysis._mode === "llm" ? "AI" : "Deterministic"}
        </span>
      </div>

      {/* View + Confidence */}
      <div className={`rounded-xl border p-4 ${viewCfg.bg} ${viewCfg.border}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">
              Market View
            </div>
            <div className={`text-2xl font-black tracking-tight flex items-center gap-2 ${viewCfg.color}`}>
              {viewCfg.icon}
              {analysis.view}
            </div>
          </div>
          <QualityBadge quality={analysis.evidence_quality} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Confidence</span>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-[10px] text-zinc-500 hover:text-sky-400 flex items-center gap-0.5 transition-colors"
            >
              Why? {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <ConfidenceBar score={analysis.confidence_score} level={analysis.confidence_level} />
        </div>

        {showExplanation && (
          <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-1">
            {/* Confidence explanation will come from the signal data — shown as text for now */}
            <div className="text-[10px] text-zinc-400 leading-relaxed">
              Confidence reflects data quality ({analysis.evidence_quality}), signal consensus, and detected conflicts.
              {analysis.insufficient_reason && (
                <span className="block mt-1 text-amber-400">{analysis.insufficient_reason}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-[12px] text-zinc-300 leading-relaxed border-l-2 border-sky-500/40 pl-3">
        {analysis.summary}
      </div>

      {/* Supporting Evidence */}
      {analysis.supporting_evidence.length > 0 && (
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Supporting Evidence
          </div>
          <ul className="space-y-1.5">
            {analysis.supporting_evidence.map((ev, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-300">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Counter Evidence */}
      {analysis.contradicting_evidence.length > 0 && (
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-rose-500" />
            Counter-Evidence
          </div>
          <ul className="space-y-1.5">
            {analysis.contradicting_evidence.map((ev, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-400">
                <span className="text-rose-500 mt-0.5 flex-shrink-0">⚠</span>
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Watch Items */}
      {analysis.watch_items.length > 0 && (
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-sky-400" />
            Watch
          </div>
          <ul className="space-y-1">
            {analysis.watch_items.map((item, i) => (
              <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-2">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Provenance */}
      <div className="mt-auto pt-3 border-t border-zinc-800 space-y-1">
        <div className="text-[9px] font-bold tracking-widest uppercase text-zinc-600 mb-1">Data</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <span className="text-[10px] text-zinc-600">Source</span>
          <span className="text-[10px] text-zinc-400 font-mono">{analysis.data_provenance.price_source}</span>
          <span className="text-[10px] text-zinc-600">Quality</span>
          <span className="text-[10px] text-zinc-400 font-mono">{analysis.data_provenance.price_quality}</span>
        </div>
        <div className="text-[9px] text-zinc-700 mt-1 italic">{analysis.disclaimer}</div>
      </div>

      {/* Ask ESSAI button */}
      <button
        onClick={onOpenChat}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-sky-500/30 bg-sky-500/8 text-sky-400 text-xs font-bold tracking-wider hover:bg-sky-500/15 hover:border-sky-500/50 transition-all"
      >
        <Brain className="w-3.5 h-3.5" />
        ASK ESSAI
      </button>
    </div>
  );
}
