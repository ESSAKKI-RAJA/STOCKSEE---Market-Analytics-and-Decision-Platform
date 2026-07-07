/**
 * StatusBadge — displays backend connection, data mode, source, and disclaimer.
 *
 * Placed in the Layout footer area so it's always visible.
 */

import { useBackendHealth } from "@/hooks/useBackendHealth";
import { Wifi, WifiOff, Database, Clock, Shield, AlertTriangle } from "lucide-react";

const modeColors: Record<string, string> = {
  real: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  mixed: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  demo: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  fallback: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  stale_cache: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  unavailable: "bg-red-500/15 text-red-400 border-red-500/30",
};

const modeLabels: Record<string, string> = {
  real: "Real Data",
  mixed: "Mixed (Real + Demo)",
  demo: "Demo Mode",
  fallback: "Fallback Mode",
  stale_cache: "Stale Cache",
  unavailable: "Unavailable",
};

interface StatusBadgeProps {
  /** Override mode from an API response */
  responseMode?: string;
  /** Override source from an API response */
  responseSource?: string;
  /** Generated-at timestamp from API response */
  generatedAt?: string;
  /** Confidence label from API response */
  /** Confidence label from API response */
  confidence?: string;
  /** Whether this data was served from cache */
  cacheHit?: boolean;
  /** Whether to show the full bar or just inline badges */
  variant?: "bar" | "inline";
}

export default function StatusBadge({
  responseMode,
  responseSource,
  generatedAt,
  confidence,
  cacheHit,
  variant = "bar",
}: StatusBadgeProps) {
  const { health } = useBackendHealth();

  const displayMode = responseMode || (health.connected ? "connected" : "disconnected");
  const modeClass = modeColors[displayMode] || "bg-slate-500/15 text-slate-400 border-slate-500/30";
  const modeLabel = modeLabels[displayMode] || displayMode;

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {/* Connection */}
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${
            health.connected
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/15 text-red-400 border-red-500/30"
          }`}
        >
          {health.connected ? <Wifi size={10} /> : <WifiOff size={10} />}
          {health.connected ? "CONNECTED" : "OFFLINE"}
        </span>

        {/* Mode */}
        {responseMode && (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${modeClass}`}
          >
            <Database size={10} />
            {modeLabel.toUpperCase()}
          </span>
        )}

        {/* Confidence */}
        {confidence && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border bg-blue-500/15 text-blue-400 border-blue-500/30">
            <Shield size={10} />
            {confidence.toUpperCase()}
          </span>
        )}

        {/* Cache Hit */}
        {cacheHit && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border bg-purple-500/15 text-purple-400 border-purple-500/30">
            CACHE HIT
          </span>
        )}
      </div>
    );
  }

  // Full bar variant
  return (
    <div
      id="stocksee-status-bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-2,#0b0f19)] border-t border-[var(--border-1,#1e293b)] px-4 py-1.5 flex items-center justify-between gap-4 text-[10px] font-mono lg:ml-[240px]"
    >
      <div className="flex items-center gap-3 flex-wrap">
        {/* Backend connection */}
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold tracking-wider border ${
            health.connected
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/15 text-red-400 border-red-500/30 animate-pulse"
          }`}
        >
          {health.connected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
              BACKEND CONNECTED
            </>
          ) : (
            <>
              <WifiOff size={10} />
              BACKEND OFFLINE
            </>
          )}
        </span>

        {/* Data mode */}
        {responseMode && (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold tracking-wider border ${modeClass}`}
          >
            <Database size={10} />
            {modeLabel.toUpperCase()}
          </span>
        )}

        {/* Source */}
        {responseSource && (
          <span className="text-slate-500">
            SRC: <span className="text-slate-400">{responseSource}</span>
          </span>
        )}

        {/* Generated time */}
        {generatedAt && (
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Clock size={9} />
            {new Date(generatedAt).toLocaleTimeString()}
          </span>
        )}

        {/* Confidence */}
        {confidence && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold tracking-wider border bg-blue-500/15 text-blue-400 border-blue-500/30">
            <Shield size={9} />
            CONF: {confidence.toUpperCase()}
          </span>
        )}

        {/* Cache Hit */}
        {cacheHit && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold tracking-wider border bg-purple-500/15 text-purple-400 border-purple-500/30">
            CACHE HIT
          </span>
        )}
      </div>

      {/* Disclaimer */}
      <span className="inline-flex items-center gap-1 text-slate-600 shrink-0">
        <AlertTriangle size={9} />
        Analysis only — Not financial advice
      </span>
    </div>
  );
}
