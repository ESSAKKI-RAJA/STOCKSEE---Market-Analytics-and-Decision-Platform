import { BookOpen, Newspaper, TrendingUp, AlertTriangle } from "lucide-react";

interface EvidencePanelProps {
  symbol: string;
}

export default function EvidencePanel({ symbol }: EvidencePanelProps) {
  // In a real app, this would fetch from /api/news and /api/report
  return (
    <div className="stocksee-card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800">
        <BookOpen className="w-5 h-5 text-sky-500" />
        <h2 className="font-heading font-bold text-[14px] uppercase tracking-wide text-zinc-100 m-0">
          Supporting Evidence
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col gap-4">
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-50 mb-1 leading-snug">
                Moving Average Crossover
              </div>
              <div className="text-[12px] text-zinc-400 leading-snug">
                The 50-day SMA crossed above the 200-day SMA, indicating a long-term bullish trend reversal confirmed by volume.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Newspaper className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-50 mb-1 leading-snug">
                Positive Sentiment Shift
              </div>
              <div className="text-[12px] text-zinc-400 leading-snug">
                Recent institutional filings indicate increased accumulation. News sentiment over the past 7 days is 68% positive.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-50 mb-1 leading-snug">
                Macro Headwinds
              </div>
              <div className="text-[12px] text-zinc-400 leading-snug">
                Interest rate uncertainty remains a drag on sector valuations. Potential resistance at the $185.00 psychological level.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
