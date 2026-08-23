import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Signal {
  symbol: string;
  name: string;
  signal: "BULLISH" | "BEARISH" | "VOLATILE";
  reason: string;
  price: number;
}

const emergingSignals: Signal[] = [
  { symbol: "NVDA", name: "NVIDIA Corp", signal: "BULLISH", reason: "Momentum strengthening across all timeframes. High volume breakout.", price: 924.15 },
  { symbol: "TSLA", name: "Tesla Inc", signal: "BEARISH", reason: "Support level weakening. RSI oversold but trend remains negative.", price: 172.82 },
  { symbol: "AAPL", name: "Apple Inc", signal: "VOLATILE", reason: "High uncertainty. Conflicting momentum and sentiment indicators.", price: 169.30 },
  { symbol: "AMD", name: "Advanced Micro", signal: "BULLISH", reason: "MACD crossover positive. Sector sympathy run.", price: 164.92 },
];

export default function EmergingSignals() {
  return (
    <div className="stocksee-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="stocksee-card-header mb-0 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Emerging Signals
        </h2>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {emergingSignals.map((sig) => (
          <Link
            to={`/stock/${sig.symbol}`}
            key={sig.symbol}
            className="flex flex-col gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-700 transition-colors group"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[14px] font-bold text-zinc-50 group-hover:text-sky-500 transition-colors">{sig.symbol}</span>
                  <span className="text-[11px] text-muted-foreground">{sig.name}</span>
                </div>
                <div className="font-mono text-[12px] text-zinc-300 mt-0.5">${sig.price.toFixed(2)}</div>
              </div>
              
              <div className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
                sig.signal === "BULLISH" ? "bg-emerald-500/10 text-emerald-500" :
                sig.signal === "BEARISH" ? "bg-rose-500/10 text-rose-500" :
                "bg-amber-500/10 text-amber-500"
              }`}>
                {sig.signal}
              </div>
            </div>
            <div className="text-[12px] text-zinc-400 mt-1 leading-snug">
              <span className="text-zinc-500 font-semibold">EVIDENCE:</span> {sig.reason}
            </div>
          </Link>
        ))}
      </div>
      
      <Link to="/screener" className="mt-4 flex items-center justify-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-zinc-50 transition-colors py-2 border border-zinc-800 rounded bg-zinc-900 hover:bg-zinc-800">
        View All Signals <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
