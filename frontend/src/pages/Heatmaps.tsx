import { useState } from "react";
import { Map, TrendingUp, TrendingDown, X, BarChart3, Activity, Users, Info, Zap, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { HEATMAP_DATA, HeatmapBlock } from "@/data/heatmaps";

const TABS = ["US Market", "India Market", "Crypto Market", "Sector Heatmap"];

// Map new tab names back to the data keys
const TAB_MAP: Record<string, string> = {
  "US Market": "US Markets",
  "India Market": "Indian Markets",
  "Crypto Market": "Crypto Market",
  "Sector Heatmap": "Global Markets" // using global as a proxy for Sector Heatmap
};

function getBlockColor(change: number) {
  if (change > 3) return "bg-green-gain border-green-gain/50";
  if (change > 0) return "bg-green-gain/80 border-green-gain/40 hover:bg-green-gain/90";
  if (change < -3) return "bg-red-loss border-red-loss/50";
  if (change < 0) return "bg-red-loss/80 border-red-loss/40 hover:bg-red-loss/90";
  return "bg-bg-secondary border-border hover:bg-bg-secondary/80 text-text-primary";
}

function getTextColor(change: number) {
  if (change > 0 || change < 0) return "text-white";
  return "text-text-primary";
}

export default function Heatmaps() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const dataKey = TAB_MAP[activeTab];
  const blockDetails = selectedBlock ? HEATMAP_DATA[dataKey].find(b => b.name === selectedBlock) : null;

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-accent/10 border border-blue-accent/20 flex items-center justify-center shadow-inner">
            <Map className="w-6 h-6 text-blue-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">Interactive Heatmaps</h1>
            <p className="text-text-muted text-sm font-medium">
              TradingView-style block visualization for asset performance
            </p>
          </div>
        </div>
        <button className="text-text-muted hover:text-text-primary p-2 bg-bg-secondary rounded-lg border border-border transition-colors">
          <Settings size={18} />
        </button>
      </div>

      <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-border p-2 bg-bg-secondary/50">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-card-surface text-text-primary border border-border shadow-sm"
                  : "bg-transparent text-text-muted hover:text-text-primary hover:bg-card-surface/50 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 bg-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {HEATMAP_DATA[dataKey].map((block, i) => (
              <motion.div
                key={block.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedBlock(block.name)}
                className={`relative overflow-hidden rounded cursor-pointer flex flex-col justify-between transition-all duration-300 border ${getBlockColor(block.change)}`}
                style={{ 
                  minHeight: block.size, 
                  gridRowEnd: `span ${Math.max(1, Math.ceil(parseInt(block.size) / 80))}`,
                  gridColumnEnd: `span ${Math.max(1, Math.ceil(parseInt(block.size) / 100))}`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <div className="relative z-10 p-3 h-full flex flex-col items-center justify-center text-center gap-1">
                  <span className={`font-heading font-bold tracking-wider drop-shadow-sm ${getTextColor(block.change)} ${parseInt(block.size) > 150 ? 'text-xl' : 'text-sm'}`}>
                    {block.name}
                  </span>
                  <span className={`font-mono font-bold ${getTextColor(block.change)} ${parseInt(block.size) > 150 ? 'text-lg' : 'text-xs'}`}>
                    {block.change > 0 ? "+" : ""}{block.change}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Modal */}
      {selectedBlock && blockDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBlock(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className={`p-6 border-b border-white/10 flex justify-between items-center ${getBlockColor(blockDetails.change)} ${getTextColor(blockDetails.change)}`}>
              <div>
                <h2 className="text-2xl font-heading font-bold tracking-tight">{blockDetails.name} Sector</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-sm backdrop-blur-sm font-bold">
                    {blockDetails.change > 0 ? "+" : ""}{blockDetails.change}% Today
                  </span>
                  <span className="text-xs opacity-80 uppercase tracking-widest font-bold">{activeTab}</span>
                </div>
              </div>
              <button onClick={() => setSelectedBlock(null)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm">
                <X size={20} />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-bg-secondary p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Avg P/E Ratio</div>
                  <div className="text-lg font-mono font-bold text-text-primary">{blockDetails.metrics.pe}</div>
                </div>
                <div className="bg-bg-secondary p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">{activeTab === "Crypto Market" ? "24H Volume" : "Market Cap"}</div>
                  <div className="text-lg font-mono font-bold text-text-primary">{blockDetails.metrics.marketCap}</div>
                </div>
                <div className="bg-bg-secondary p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">{activeTab === "Crypto Market" ? "Funding/Flow" : "Inst. Flow"}</div>
                  <div className={`text-lg font-mono font-bold ${blockDetails.metrics.flow.includes("-") ? "text-red-loss" : "text-green-gain"}`}>{blockDetails.metrics.flow}</div>
                </div>
                <div className="bg-bg-secondary p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">1M Trend</div>
                  <div className={`text-lg font-mono font-bold ${blockDetails.metrics.trend1M.includes("-") ? "text-red-loss" : "text-green-gain"}`}>{blockDetails.metrics.trend1M}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card-surface border border-border rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-gain" /> Top Winners
                  </h3>
                  <div className="space-y-3">
                    {blockDetails.winners.map((c, i) => (
                      <div key={c} className="flex justify-between items-center group">
                        <span className="font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">{c}</span>
                        <span className="text-green-gain font-mono text-sm font-bold bg-green-gain/10 px-2 py-0.5 rounded border border-green-gain/20">+{Math.max(0.5, blockDetails.change + 1.5 - i * 0.4).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card-surface border border-border rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingDown size={16} className="text-red-loss" /> Top Losers
                  </h3>
                  <div className="space-y-3">
                    {blockDetails.losers.map((c, i) => (
                      <div key={c} className="flex justify-between items-center group">
                        <span className="font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">{c}</span>
                        <span className="text-red-loss font-mono text-sm font-bold bg-red-loss/10 px-2 py-0.5 rounded border border-red-loss/20">-{Math.max(0.5, 1.2 + i * 0.3).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card-surface border border-border rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={16} className="text-blue-accent" /> Recent Sector News
                </h3>
                <div className="space-y-0 divide-y divide-border/50">
                  {blockDetails.news.map((n, i) => (
                    <div key={i} className="py-3 hover:bg-bg-secondary transition-colors cursor-pointer -mx-5 px-5">
                      <div className="text-[10px] font-bold text-blue-accent uppercase tracking-widest mb-1">{i * 2 + 1}H AGO</div>
                      <div className="text-sm font-bold text-text-primary leading-snug">{n}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-purple-accent/5 border border-purple-accent/20 flex gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-accent" />
                <div className="flex-shrink-0 mt-0.5">
                  <Zap size={18} className="text-purple-accent" fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-accent uppercase tracking-widest mb-2">Quant Insight</h4>
                  <p className="text-sm text-text-primary leading-relaxed font-medium">
                    "{blockDetails.insight}"
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
