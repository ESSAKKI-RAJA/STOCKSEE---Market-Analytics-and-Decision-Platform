import { Brain, TrendingUp, TrendingDown, Activity, ShieldAlert } from "lucide-react";

interface DecisionIntelligenceProps {
  symbol: string;
}

export default function DecisionIntelligence({ symbol }: DecisionIntelligenceProps) {
  // In a real app, this would fetch from /api/signal
  // Mocking response based on symbol for demonstration
  const signal = symbol === "TSLA" ? "BEARISH" : symbol === "AAPL" ? "VOLATILE" : "BULLISH";
  const confidence = 84;

  return (
    <div className="stocksee-card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800">
        <Brain className="w-5 h-5 text-sky-500" />
        <h2 className="font-heading font-bold text-[14px] uppercase tracking-wide text-zinc-100 m-0">
          Decision Intelligence
        </h2>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
              Primary Signal
            </div>
            <div className={`text-3xl font-heading font-black tracking-tight ${
              signal === "BULLISH" ? "text-emerald-500" :
              signal === "BEARISH" ? "text-rose-500" :
              "text-amber-500"
            }`}>
              {signal}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
              Confidence
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-50">
              {confidence}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
              <TrendingUp className="w-3 h-3 text-sky-500" /> Momentum
            </div>
            <div className="font-mono text-[13px] font-bold text-emerald-500">
              ACCELERATING
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
              <Activity className="w-3 h-3 text-sky-500" /> Volatility
            </div>
            <div className="font-mono text-[13px] font-bold text-amber-500">
              ELEVATED
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded col-span-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
              <ShieldAlert className="w-3 h-3 text-sky-500" /> Risk Exposure
            </div>
            <div className="text-[12px] text-zinc-300 leading-snug">
              High correlation with broad market beta. Sector rotation presents near-term headwind.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
