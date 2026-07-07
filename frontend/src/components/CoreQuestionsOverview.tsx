import React from "react";
import { formatCurrency } from "@/lib/currency";

interface CoreQuestionsOverviewProps {
  stock: any;
  meta: any;
}

export default function CoreQuestionsOverview({ stock, meta }: CoreQuestionsOverviewProps) {
  // Mock data for the 5 core questions based on STOCKSEE V4 philosophy
  
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* 1. What happened today? */}
      <section>
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4 flex items-center gap-2">
          <span className="text-[#2563EB]">1.</span> What happened today?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stocksee-card">
            <div className="stocksee-card-header">Session Progress</div>
            <div className="h-2 bg-[#0A0A0A] rounded-full overflow-hidden mt-4">
              <div className="h-full bg-[#2563EB] w-[65%]" />
            </div>
            <div className="flex justify-between text-xs text-[#71717A] mt-2 font-mono">
              <span>Open</span>
              <span>Close (Est)</span>
            </div>
          </div>
          <div className="stocksee-card">
            <div className="stocksee-card-header">Volume vs Avg</div>
            <div className="text-2xl font-mono text-[#FAFAFA] font-medium">{stock.volume || "12.4M"}</div>
            <div className="text-sm text-[#10B981] mt-1 font-mono">+14% above 30-day avg</div>
          </div>
          <div className="stocksee-card">
            <div className="stocksee-card-header">VWAP</div>
            <div className="text-2xl font-mono text-[#FAFAFA] font-medium">
              {formatCurrency(stock.price * 0.995, stock.exchange)}
            </div>
            <div className="text-sm text-[#71717A] mt-1">Trading slightly above VWAP</div>
          </div>
        </div>
      </section>

      {/* 2. Is this business good? */}
      <section>
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4 flex items-center gap-2">
          <span className="text-[#2563EB]">2.</span> Is this business good?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="stocksee-card">
            <div className="stocksee-card-header">Business Quality</div>
            <div className="stocksee-data-row">
              <span className="stocksee-data-label">Gross Margin</span>
              <span className="stocksee-data-value">45.2%</span>
            </div>
            <div className="stocksee-data-row">
              <span className="stocksee-data-label">ROE</span>
              <span className="stocksee-data-value text-[#10B981]">24.8%</span>
            </div>
            <div className="stocksee-data-row">
              <span className="stocksee-data-label">Debt-to-Equity</span>
              <span className="stocksee-data-value">0.4x</span>
            </div>
          </div>
          <div className="stocksee-card flex flex-col justify-center bg-gradient-to-br from-[#121212] to-[#1A1A24]">
            <div className="stocksee-card-header">Moat Assessment</div>
            <div className="text-lg font-medium text-[#FAFAFA]">Wide Moat</div>
            <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">
              Strong competitive advantage driven by network effects and high switching costs. Revenue growth is highly predictable.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Is this stock attractive? */}
      <section>
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4 flex items-center gap-2">
          <span className="text-[#2563EB]">3.</span> Is this stock attractive?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stocksee-card">
            <div className="stocksee-card-header">Valuation Premium</div>
            <div className="text-2xl font-mono text-[#EF4444] font-medium">+15%</div>
            <div className="text-sm text-[#71717A] mt-1">Trading above historical avg</div>
          </div>
          <div className="stocksee-card md:col-span-2">
            <div className="stocksee-card-header">Key Metrics</div>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <div className="text-xs text-[#71717A]">P/E (TTM)</div>
                <div className="font-mono text-[#FAFAFA] mt-1">{stock.pe?.toFixed(2) || "28.4"}</div>
              </div>
              <div>
                <div className="text-xs text-[#71717A]">Forward P/E</div>
                <div className="font-mono text-[#FAFAFA] mt-1">{(stock.pe ? stock.pe * 0.9 : 24.2).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-[#71717A]">EV/EBITDA</div>
                <div className="font-mono text-[#FAFAFA] mt-1">18.5x</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What are professionals doing? */}
      <section>
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4 flex items-center gap-2">
          <span className="text-[#2563EB]">4.</span> What are professionals doing?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="stocksee-card">
            <div className="stocksee-card-header">Institutional Flow</div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-[#10B981]">Buying (68%)</span>
                  <span className="text-[#EF4444]">Selling (32%)</span>
                </div>
                <div className="h-2 bg-[#EF4444]/20 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#10B981]" style={{ width: "68%" }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-4">Smart money is heavily accumulating over the last 14 days.</p>
          </div>
          <div className="stocksee-card">
            <div className="stocksee-card-header">Analyst Consensus</div>
            <div className="text-xl font-medium text-[#10B981]">Strong Buy</div>
            <div className="text-sm text-[#A1A1AA] mt-1">Based on 32 Wall Street analysts</div>
            <div className="mt-4 text-xs font-mono text-[#FAFAFA]">
              Target: {formatCurrency(stock.price * 1.15, stock.exchange)} (+15% upside)
            </div>
          </div>
        </div>
      </section>

      {/* 5. Should I invest? */}
      <section>
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4 flex items-center gap-2">
          <span className="text-[#2563EB]">5.</span> Should I invest?
        </h2>
        <div className="stocksee-card bg-gradient-to-br from-[#121212] to-[#0A1020] border-[#2563EB]/30">
          <div className="flex justify-between items-start mb-4">
            <div className="stocksee-card-header !mb-0 text-[#2563EB]">AI Conviction Summary</div>
            <div className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded text-xs font-bold uppercase tracking-wider">
              Bullish (82/100)
            </div>
          </div>
          <p className="text-[#FAFAFA] leading-relaxed text-sm">
            {stock.symbol} presents a compelling long-term opportunity. While valuation is slightly stretched relative to historical averages (+15%), the underlying business quality is exceptional (ROE 24.8%). Strong institutional accumulation combined with upcoming catalysts in Q3 suggest upward momentum will continue.
          </p>
          <div className="mt-4 pt-4 border-t border-[#27272A]/50 flex gap-4 text-xs text-[#A1A1AA]">
            <div><strong className="text-[#EF4444]">Risk:</strong> Macro-economic slowdown affecting enterprise spending.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
