import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, Activity, TrendingUp, Cpu, Compass, Map, Calendar, Gauge, Bitcoin, Star, Briefcase
} from "lucide-react";

const MODULES = [
  { name: "Market Overview", path: "/analyse", icon: Activity, desc: "Global indices & macro tracking", color: "text-blue-accent" },
  { name: "Trending Stocks", path: "/screener", icon: TrendingUp, desc: "Highest volume & volatility today", color: "text-green-gain" },
  { name: "AI Top Picks Today", path: "/advisor", icon: Cpu, desc: "Quant engine generated signals", color: "text-purple-accent" },
  { name: "News Sentiment Radar", path: "/news", icon: Compass, desc: "Real-time media mood analysis", color: "text-blue-accent" },
  { name: "Sector Heatmap", path: "/heatmaps", icon: Map, desc: "Industry performance blocks", color: "text-red-loss" },
  { name: "Earnings Calendar", path: "/analyse", icon: Calendar, desc: "Upcoming corporate reports", color: "text-gold-premium" },
  { name: "Fear & Greed Meter", path: "/analyse", icon: Gauge, desc: "Market psychology index", color: "text-orange-500" },
  { name: "Crypto Movers", path: "/screener", icon: Bitcoin, desc: "Top digital asset swings", color: "text-yellow-500" },
  { name: "Watchlist Snapshot", path: "/watchlist", icon: Star, desc: "Your tracked assets performance", color: "text-blue-accent" },
  { name: "Portfolio Insights", path: "/portfolio", icon: Briefcase, desc: "AI analysis of your holdings", color: "text-green-gain" },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-10 pb-12 w-full animate-fade-in-up">
      {/* ── TOP HERO SECTION ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card-surface/50 p-8 md:p-12 mt-4">
        {/* Abstract background elements */}
        <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-blue-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-accent/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary tracking-tight mb-4 leading-tight">
              Global Markets Intelligence Platform
            </h1>
            <p className="text-text-muted text-lg md:text-xl tracking-wide max-w-2xl mb-8 font-medium">
              AI-powered research, screening, alerts & institutional analytics.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/analyse" className="inline-flex items-center justify-center px-6 py-3 bg-blue-accent hover:bg-blue-accent/90 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(37,99,255,0.4)]">
                Start Analysing
              </Link>
              <Link to="/pricing" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-border hover:border-gold-premium/50 text-text-primary hover:text-gold-premium font-bold rounded-xl transition-all hover:bg-gold-premium/5">
                Upgrade Pro
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col gap-4 min-w-[280px]">
            <div className="p-4 rounded-xl bg-bg-secondary/80 border border-border backdrop-blur flex items-center justify-between shadow-lg">
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">S&P 500</div>
                <div className="text-xl font-mono font-bold">5,204.34</div>
              </div>
              <div className="text-green-gain font-mono font-semibold bg-green-gain/10 px-2 py-1 rounded">+1.24%</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-secondary/80 border border-border backdrop-blur flex items-center justify-between shadow-lg">
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">NASDAQ</div>
                <div className="text-xl font-mono font-bold">16,340.87</div>
              </div>
              <div className="text-green-gain font-mono font-semibold bg-green-gain/10 px-2 py-1 rounded">+1.56%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID MODULES ── */}
      <div>
        <h2 className="text-xl font-heading font-bold text-text-primary mb-6 px-2 tracking-wide">
          Intelligence Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MODULES.map((mod) => (
            <div 
              key={mod.name}
              onClick={() => navigate(mod.path)}
              className="bg-card-surface border border-border p-6 rounded-2xl cursor-pointer group hover:border-blue-accent/50 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(37,99,255,0.1)] hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300 text-blue-accent">
                <ArrowRight size={20} />
              </div>
              
              <div className="flex flex-col gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center ${mod.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <mod.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base mb-1.5 group-hover:text-blue-accent transition-colors font-heading">
                    {mod.name}
                  </h3>
                  <p className="text-[13px] text-text-muted leading-relaxed font-medium">
                    {mod.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
