import React from "react";
import { useStockAnalysis } from "@/hooks/useStockAnalysis";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Info, ShieldAlert } from "lucide-react";

export default function DecisionSnapshot({ symbol }: { symbol: string }) {
  const { data, loading, error } = useStockAnalysis(symbol);

  if (loading) {
    return (
      <div className="bg-card-surface border border-border rounded-2xl p-6 animate-pulse mb-6">
        <div className="h-20 bg-bg-secondary rounded-xl mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-bg-secondary rounded-xl"></div>
          <div className="h-32 bg-bg-secondary rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-loss/10 border border-red-loss/20 text-red-loss rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 mb-6">
        <AlertTriangle size={24} />
        <div className="font-bold">Failed to load analysis for {symbol}</div>
        <div className="text-sm opacity-80">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  // Derive semantic colors based on signal label
  const isBullish = data.signalLabel.toLowerCase().includes("bullish");
  const isBearish = data.signalLabel.toLowerCase().includes("bearish");
  
  let headerColor = "text-text-primary";
  let headerBg = "bg-bg-secondary";
  let headerBorder = "border-border";
  let Icon = Activity;

  if (isBullish) {
    headerColor = "text-green-gain";
    headerBg = "bg-green-gain/10";
    headerBorder = "border-green-gain/30";
    Icon = TrendingUp;
  } else if (isBearish) {
    headerColor = "text-red-loss";
    headerBg = "bg-red-loss/10";
    headerBorder = "border-red-loss/30";
    Icon = TrendingDown;
  }

  return (
    <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-lg animate-fade-in-up mb-6">
      {/* 1. DECISION SNAPSHOT (Top Level) */}
      <div className={`p-6 border-b ${headerBorder} ${headerBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl border ${headerBorder} flex items-center justify-center bg-card-surface`}>
            <Icon size={24} className={headerColor} />
          </div>
          <div>
            <div className={`text-2xl font-bold font-heading uppercase tracking-wide ${headerColor}`}>
              {data.signalLabel}
            </div>
            <div className="flex gap-4 mt-1 text-xs font-bold uppercase tracking-wider font-mono">
              <span className="text-text-muted">CONFIDENCE: <span className="text-text-primary">{data.confidence}</span></span>
              <span className="text-text-muted">RISK: <span className={data.riskLevel === "ELEVATED" || data.riskLevel === "HIGH" ? "text-orange-500" : "text-text-primary"}>{data.riskLevel}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHY & WHAT CONFLICTS? */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border">
        
        {/* WHY (Evidence) */}
        <div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-gain" />
            Why?
          </h3>
          <ul className="space-y-3">
            {data.bullishEvidence.map((ev, i) => (
              <li key={`bull-${i}`} className="text-sm text-text-primary flex items-start gap-2 leading-relaxed">
                <span className="text-green-gain font-bold mt-0.5">✓</span>
                <span>{ev}</span>
              </li>
            ))}
            {data.bearishEvidence.map((ev, i) => (
              <li key={`bear-${i}`} className="text-sm text-text-primary flex items-start gap-2 leading-relaxed">
                <span className="text-red-loss font-bold mt-0.5">✓</span>
                <span>{ev}</span>
              </li>
            ))}
            {data.bullishEvidence.length === 0 && data.bearishEvidence.length === 0 && (
              <li className="text-sm text-text-muted italic">No explicit evidence identified.</li>
            )}
          </ul>
        </div>

        {/* CONFLICTS */}
        <div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldAlert size={16} className="text-orange-500" />
            What Conflicts?
          </h3>
          {data.conflicts.length > 0 ? (
            <ul className="space-y-3">
              {data.conflicts.map((conf, i) => (
                <li key={i} className="text-sm text-text-primary flex items-start gap-2 leading-relaxed">
                  <span className="text-orange-500 font-bold mt-0.5">⚠</span>
                  <span>{conf}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-text-muted italic bg-bg-secondary p-3 rounded-lg border border-border">
              No major analytical conflicts detected.
            </div>
          )}
        </div>
      </div>

      {/* 3. SCENARIO PROJECTION */}
      <div className="p-6 border-b border-border bg-bg-secondary/30">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
           <Activity size={14} className="text-blue-accent" />
           Scenario Projection
        </h3>
        <p className="text-sm text-text-primary leading-relaxed border-l-2 border-blue-accent pl-3 italic">
          {data.scenarioProjection}
        </p>
      </div>

      {/* 4. DATA QUALITY / TRANSPARENCY */}
      <div className="px-6 py-3 bg-bg-secondary flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
           <Info size={14} className={data.mode === "demo" ? "text-red-loss" : "text-text-muted"} />
           <span className="text-text-muted uppercase tracking-wider">
             Data Quality: 
             <strong className={`ml-1 ${data.mode === "demo" ? "text-red-loss" : data.mode === "real" || data.mode === "mixed" ? "text-green-gain" : "text-orange-500"}`}>
               {data.mode === "demo" ? "DEMO - Highly Limited" : data.mode === "stale_cache" ? "STALE CACHE" : "FRESH"}
             </strong>
           </span>
        </div>
        
        {data.limitations.length > 0 && (
          <div className="text-text-muted max-w-md truncate" title={data.limitations.join(" | ")}>
            Limitations: {data.limitations[0]} {data.limitations.length > 1 ? "(+more)" : ""}
          </div>
        )}
      </div>

    </div>
  );
}
