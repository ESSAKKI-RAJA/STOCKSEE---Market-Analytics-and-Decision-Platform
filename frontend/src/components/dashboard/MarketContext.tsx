import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface IndexData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Dummy data for Market Context. In a real app, this would fetch from /api/market/context
const mockIndices: IndexData[] = [
  { symbol: "^GSPC", name: "S&P 500", value: 5204.34, change: 64.21, changePercent: 1.24 },
  { symbol: "^IXIC", name: "NASDAQ", value: 16340.87, change: 251.32, changePercent: 1.56 },
  { symbol: "^DJI", name: "DOW JONES", value: 39512.13, change: 110.15, changePercent: 0.28 },
  { symbol: "^RUT", name: "RUSSELL 2000", value: 2104.55, change: -12.4, changePercent: -0.58 },
];

export default function MarketContext() {
  const [indices, setIndices] = useState<IndexData[]>([]);

  useEffect(() => {
    // Simulate API fetch
    setIndices(mockIndices);
  }, []);

  return (
    <div className="stocksee-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="stocksee-card-header mb-0 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-500" />
          Market Context
        </h2>
        <span className="text-[10px] text-muted-foreground font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800">REAL-TIME</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((idx) => {
          const isUp = idx.change >= 0;
          return (
            <div key={idx.symbol} className="bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col gap-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{idx.name}</span>
              <span className="text-[16px] font-mono font-bold text-zinc-50 mt-1">
                {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {isUp ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
                <span className={`text-[12px] font-mono font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {isUp ? "+" : ""}{idx.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
