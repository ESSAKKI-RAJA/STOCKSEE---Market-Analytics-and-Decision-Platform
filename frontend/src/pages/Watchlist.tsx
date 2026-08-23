import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowLeft, ShieldAlert, AlertTriangle, Info, TrendingUp, TrendingDown, Activity, ChevronRight, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useStockPrices } from "@/hooks/useStockPrices";
import { useWatchlistMonitoring } from "@/hooks/useWatchlistMonitoring";
import WatchlistIntelligenceCard from "@/components/watchlist/WatchlistIntelligenceCard";

export default function Watchlist() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading: wlLoading } = useWatchlist();
  const { stocks } = useStockPrices();
  
  const symbolList = items.map(i => i.symbol);
  const { monitoredStocks, loading: monLoading, error } = useWatchlistMonitoring(symbolList);
  
  const [activeList, setActiveList] = useState("Main Watchlist");
  const lists = ["Main Watchlist", "Tech Giants", "Dividend Yielders", "Crypto Core"];

  if (authLoading) return (
    <div className="flex justify-center p-12">
      <div className="flex items-center gap-3 bg-card-surface border border-border rounded-2xl px-6 py-4 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        <span className="ml-2 font-mono text-text-muted text-sm">Authenticating...</span>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-card-surface border border-border rounded-2xl max-w-md w-full p-8 text-center relative overflow-hidden group shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-accent/10 border border-blue-accent/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,255,0.15)]">
              <ShieldAlert className="w-8 h-8 text-blue-accent" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Authentication Required</h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed">
              Sign in to access your personalized watchlist, AI scores, and global market intelligence tools.
            </p>
            <Link to="/auth" className="bg-blue-accent text-white flex items-center justify-center w-full py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,255,0.39)] hover:bg-blue-accent/90 transition-all">
              Access Terminal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

  const needsAttention = monitoredStocks.filter(s => s.status === "NEEDS_ATTENTION");
  const changed = monitoredStocks.filter(s => s.status === "CHANGED");
  const stable = monitoredStocks.filter(s => s.status === "STABLE" || s.status === "NEW");

  const renderStockCard = (item: any, _ignored: string, _ignoredIcon: any) => {
    const live = stockMap.get(item.symbol);
    return (
      <WatchlistIntelligenceCard
        key={item.symbol}
        symbol={item.symbol}
        price={live?.price}
        changePercent={live?.changePercent}
        exchange={live?.exchange}
        signalLabel={item.currentState.signalLabel}
        confidence={item.currentState.confidence}
        riskLevel={item.currentState.riskLevel}
        changeExplanation={item.changeExplanation}
        status={item.status as any}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-50 tracking-tight mb-2 flex items-center gap-3">
            Decision Monitoring
            <Activity className="text-sky-500 w-6 h-6" />
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider text-[11px] font-bold">
            <Link to="/" className="hover:text-sky-500 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Command Center
            </Link>
            <span>/</span>
            <span className="text-zinc-50">Intelligence Feed</span>
          </div>
        </div>
        <button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded font-bold transition-all flex items-center gap-2 text-[13px]">
          <Plus size={16} /> New List
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar bg-zinc-950 p-1.5 rounded border border-zinc-800">
          {lists.map((list) => (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-1.5 text-[12px] font-bold transition-all rounded whitespace-nowrap ${
                activeList === list ? "bg-zinc-900 text-zinc-50 border border-zinc-800" : "text-muted-foreground hover:text-zinc-50 border border-transparent"
              }`}
            >
              {list}
            </button>
          ))}
        </div>
        <button className="text-muted-foreground hover:text-zinc-50 p-2 bg-zinc-950 rounded border border-zinc-800 transition-colors">
          <Settings size={16} />
        </button>
      </div>

      {(wlLoading || monLoading) ? (
        <div className="p-12 text-center text-text-muted font-mono text-sm animate-pulse tracking-widest uppercase bg-card-surface border border-border rounded-2xl">
          Loading Intelligence...
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center bg-card-surface border border-border rounded-2xl">
          <Star className="w-12 h-12 text-border mx-auto mb-4" />
          <h3 className="text-lg font-heading font-bold text-text-primary mb-2">Watchlist is empty</h3>
          <p className="text-text-muted mb-8 text-sm">Add instruments from the screener or dashboard.</p>
          <Link to="/analyse" className="bg-blue-accent text-white px-5 py-2.5 rounded-xl font-bold inline-flex">
            Discover Assets
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {needsAttention.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-border pb-2">
                <AlertTriangle size={16} className="text-orange-500" />
                Needs Attention
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {needsAttention.map(stock => renderStockCard(stock, "bg-orange-500/10 border-orange-500/30 text-orange-500", ShieldAlert))}
              </div>
            </section>
          )}

          {changed.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-border pb-2">
                <Info size={16} className="text-blue-accent" />
                Changed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {changed.map(stock => renderStockCard(stock, "bg-blue-accent/10 border-blue-accent/30 text-blue-accent", Info))}
              </div>
            </section>
          )}

          {stable.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
                Stable
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-80 hover:opacity-100 transition-opacity">
                {stable.map(stock => (
                  <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="bg-zinc-900 border border-zinc-800 rounded p-4 flex items-center justify-between hover:border-sky-500/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-50">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-heading font-bold text-zinc-50 text-[13px] group-hover:text-sky-500 transition-colors leading-none">{stock.symbol}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{stock.currentState.signalLabel}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-sky-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
