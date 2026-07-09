import { useState, useEffect } from "react";
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw, AlertCircle, BarChart3 } from "lucide-react";
import { newsData as NEWS_DATA } from "@/data/newsData";

export default function NewsCenter() {
  const [activeTab, setActiveTab] = useState<string>("Markets");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const TABS = ["Markets", "Stocks", "Crypto", "Macro", "India", "US", "World"];

  useEffect(() => {
    const lastSyncStr = localStorage.getItem("newsLastSync");
    const now = new Date();
    
    if (lastSyncStr) {
      const lastSyncDate = new Date(lastSyncStr);
      setLastRefreshed(lastSyncDate);
      
      // If more than 24h passed, auto refresh feed
      const diffHours = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);
      if (diffHours > 24) {
        handleRefresh();
      }
    } else {
      localStorage.setItem("newsLastSync", now.toISOString());
    }

    const interval = setInterval(() => {
      handleRefresh();
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    const now = new Date();
    setLastRefreshed(now);
    localStorage.setItem("newsLastSync", now.toISOString());
    setRefreshing(false);
  };

  // Map our original tabs to the new ones for demo purposes
  const getFilteredNews = () => {
    if (activeTab === "India") return NEWS_DATA.filter(n => n.category === "Indian");
    if (activeTab === "US") return NEWS_DATA.filter(n => n.category === "US");
    if (activeTab === "World") return NEWS_DATA.filter(n => n.category === "Global");
    // Return all for Markets, just Crypto for Crypto, etc. Mocking for demo.
    return NEWS_DATA; 
  };

  const filteredNews = getFilteredNews();

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "bullish":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest text-green-gain bg-green-gain/10 border border-green-gain/20 uppercase shadow-sm"><TrendingUp size={14} /> Bullish</span>;
      case "bearish":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest text-red-loss bg-red-loss/10 border border-red-loss/20 uppercase shadow-sm"><TrendingDown size={14} /> Bearish</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest text-text-muted bg-bg-secondary border border-border uppercase shadow-sm"><Minus size={14} /> Neutral</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-accent/10 border border-blue-accent/20 flex items-center justify-center shadow-inner">
            <Newspaper className="w-6 h-6 text-blue-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">News Center V2</h1>
            <p className="text-text-muted text-sm font-medium">
              Real-time institutional news with AI impact analysis
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] text-text-muted font-mono font-bold tracking-widest uppercase">
            Last Sync: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="bg-bg-secondary text-text-primary hover:bg-card-surface border border-border px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-accent" : "text-text-muted"} />
            {refreshing ? "Syncing..." : "Force Sync"}
          </button>
        </div>
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
                  ? "bg-card-surface text-blue-accent border border-blue-accent/20 shadow-sm"
                  : "bg-transparent text-text-muted hover:text-text-primary hover:bg-card-surface/50 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news, idx) => {
              // Mock impact score for UI based on headline length
              const impactScore = 50 + (news.headline.length % 50);
              
              return (
                <a 
                  key={news.id + idx}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-bg-secondary hover:bg-card-surface hover:border-blue-accent/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,255,0.08)] transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle top border gradient indicating sentiment */}
                  <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${news.impact === 'bullish' ? 'bg-green-gain' : news.impact === 'bearish' ? 'bg-red-loss' : 'bg-border'}`} />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-accent tracking-widest uppercase bg-blue-accent/10 px-2 py-1 rounded border border-blue-accent/20">
                      {news.tag}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono font-bold tracking-wider">{news.time}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-3 group-hover:text-blue-accent transition-colors leading-snug">
                      {news.headline}
                    </h3>
                    
                    <div className="bg-bg-secondary/50 p-3 rounded-xl border border-border/50 mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-purple-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Why it matters</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-3 font-medium">
                        {news.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-card-surface border border-border flex items-center justify-center font-bold text-[10px] text-text-primary shadow-sm">
                        {news.source[0]}
                      </div>
                      <span className="text-[11px] font-bold text-text-muted tracking-wider uppercase">
                        {news.source}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5" title={`Impact Score: ${impactScore}`}>
                        <BarChart3 className="w-3.5 h-3.5 text-text-muted" />
                        <span className="font-mono text-xs font-bold text-text-primary">{impactScore}</span>
                      </div>
                      {getImpactBadge(news.impact)}
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-blue-accent" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
