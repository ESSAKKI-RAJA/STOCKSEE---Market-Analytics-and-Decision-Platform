import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowLeft, ShieldAlert, AlertTriangle, Info, TrendingUp, TrendingDown, Activity, ChevronRight, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useStockPrices } from "@/hooks/useStockPrices";
import { useWatchlistMonitoring, MonitoredStock } from "@/hooks/useWatchlistMonitoring";
import { formatCurrency } from "@/lib/currency";

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

  const renderStockCard = (item: MonitoredStock, alertColor: string, AlertIcon: any) => {
    const live = stockMap.get(item.symbol);
    const isBullish = item.currentState.signalLabel.toLowerCase().includes("bullish");
    const isBearish = item.currentState.signalLabel.toLowerCase().includes("bearish");
    const isUp = (live?.change ?? 0) >= 0;

    let SignalIcon = Activity;
    if (isBullish) SignalIcon = TrendingUp;
    if (isBearish) SignalIcon = TrendingDown;

    return (
      <Link key={item.symbol} to={`/stock/${item.symbol}`} className="block bg-bg-secondary/50 border border-border rounded-xl p-5 hover:bg-card-surface hover:border-blue-accent/50 transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-card-surface border border-border flex items-center justify-center font-bold text-text-primary group-hover:text-blue-accent transition-colors shadow-sm">
                {item.symbol[0]}
             </div>
             <div>
               <h3 className="font-heading font-bold text-lg text-text-primary group-hover:text-blue-accent transition-colors leading-none">{item.symbol}</h3>
               {live && (
                 <div className="flex items-center gap-2 mt-1.5">
                   <span className="font-mono text-sm text-text-primary font-bold">{formatCurrency(live.price, live.exchange)}</span>
                   <span className={`font-mono text-xs font-bold ${isUp ? "text-green-gain" : "text-red-loss"}`}>
                     {isUp ? "▲" : "▼"}{Math.abs(live.changePercent).toFixed(2)}%
                   </span>
                 </div>
               )}
             </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
             isBullish ? "text-green-gain bg-green-gain/10 border-green-gain/20" : 
             isBearish ? "text-red-loss bg-red-loss/10 border-red-loss/20" : 
             "text-text-primary bg-bg-secondary border-border"
          }`}>
             <SignalIcon size={12} />
             {item.currentState.signalLabel}
          </div>
        </div>

        {item.changeExplanation && (
          <div className={`mt-3 p-3 rounded-lg border flex items-start gap-2 ${alertColor}`}>
            <AlertIcon size={16} className="mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-0.5">Material Change Detected</div>
              <div className="text-sm font-medium">{item.changeExplanation}</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex gap-4 text-xs font-mono font-bold uppercase tracking-wider">
           <div className="text-text-muted">
              Conf: <span className="text-text-primary">{item.currentState.confidence}</span>
           </div>
           <div className="text-text-muted">
              Risk: <span className={item.currentState.riskLevel !== "LOW" ? "text-orange-500" : "text-text-primary"}>{item.currentState.riskLevel}</span>
           </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-2 flex items-center gap-3">
            Decision Monitoring
            <Activity className="text-blue-accent w-7 h-7" />
          </h1>
          <div className="flex items-center gap-2 text-text-muted text-sm uppercase tracking-wider text-[11px] font-bold">
            <Link to="/" className="hover:text-blue-accent transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-text-primary">Watchlists</span>
          </div>
        </div>
        <button className="bg-blue-accent hover:bg-blue-accent/90 text-white px-4 py-2.5 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,255,0.3)] transition-all flex items-center gap-2">
          <Plus size={18} /> New List
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar bg-bg-secondary p-1.5 rounded-xl border border-border">
          {lists.map((list) => (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-lg whitespace-nowrap ${
                activeList === list ? "bg-card-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {list}
            </button>
          ))}
        </div>
        <button className="text-text-muted hover:text-text-primary p-2 bg-bg-secondary rounded-lg border border-border transition-colors">
          <Settings size={18} />
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
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-border pb-2">
                Stable
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-80 hover:opacity-100 transition-opacity">
                {stable.map(stock => (
                  <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="bg-card-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-blue-accent/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-bg-secondary border border-border flex items-center justify-center font-bold text-xs text-text-primary">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-heading font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors leading-none">{stock.symbol}</div>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{stock.currentState.signalLabel}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-text-muted group-hover:text-blue-accent transition-colors" />
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
