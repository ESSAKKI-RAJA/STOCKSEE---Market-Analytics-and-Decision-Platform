import { Link } from "react-router-dom";
import { Activity, TrendingUp, TrendingDown, ShieldAlert, Info } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface WatchlistIntelligenceCardProps {
  symbol: string;
  price?: number;
  changePercent?: number;
  exchange?: string;
  signalLabel: string;
  confidence: number;
  riskLevel: string;
  changeExplanation?: string;
  status: "NEEDS_ATTENTION" | "CHANGED" | "STABLE" | "NEW";
}

export default function WatchlistIntelligenceCard({
  symbol,
  price,
  changePercent,
  exchange,
  signalLabel,
  confidence,
  riskLevel,
  changeExplanation,
  status,
}: WatchlistIntelligenceCardProps) {
  const isBullish = signalLabel.toLowerCase().includes("bullish");
  const isBearish = signalLabel.toLowerCase().includes("bearish");
  const isUp = (changePercent ?? 0) >= 0;

  let SignalIcon = Activity;
  if (isBullish) SignalIcon = TrendingUp;
  if (isBearish) SignalIcon = TrendingDown;

  const getStatusColor = () => {
    if (status === "NEEDS_ATTENTION") return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    if (status === "CHANGED") return "text-sky-500 bg-sky-500/10 border-sky-500/30";
    return "text-zinc-50 bg-zinc-900 border-zinc-800";
  };

  const StatusIcon = status === "NEEDS_ATTENTION" ? ShieldAlert : Info;

  return (
    <Link to={`/stock/${symbol}`} className="block bg-zinc-900 border border-zinc-800 rounded p-5 hover:border-sky-500/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center font-bold text-zinc-50 group-hover:text-sky-500 transition-colors">
            {symbol[0]}
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-zinc-50 group-hover:text-sky-500 transition-colors leading-none">{symbol}</h3>
            {price !== undefined && (
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[13px] text-zinc-50 font-bold">{formatCurrency(price, exchange || "USD")}</span>
                <span className={`font-mono text-xs font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {isUp ? "▲" : "▼"}{Math.abs(changePercent || 0).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border font-mono ${
          isBullish ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : 
          isBearish ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : 
          "text-amber-500 bg-amber-500/10 border-amber-500/20"
        }`}>
          <SignalIcon size={12} />
          {signalLabel}
        </div>
      </div>

      {changeExplanation && (
        <div className={`mt-3 p-3 rounded border flex items-start gap-2 ${getStatusColor()}`}>
          <StatusIcon size={16} className="mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Material Change Detected</div>
            <div className="text-[12px] font-medium leading-snug">{changeExplanation}</div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex gap-4 text-[11px] font-mono font-bold uppercase tracking-wider">
        <div className="text-muted-foreground">
          Conf: <span className="text-zinc-50">{confidence}%</span>
        </div>
        <div className="text-muted-foreground">
          Risk: <span className={riskLevel !== "LOW" ? "text-amber-500" : "text-zinc-50"}>{riskLevel}</span>
        </div>
      </div>
    </Link>
  );
}
