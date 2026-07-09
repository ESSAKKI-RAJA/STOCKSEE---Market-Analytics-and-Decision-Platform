import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, ArrowLeft, ShieldAlert, Bell, Cpu, Compass, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useStockPrices } from "@/hooks/useStockPrices";
import { formatCurrency } from "@/lib/currency";

export default function Watchlist() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, remove } = useWatchlist();
  const { stocks } = useStockPrices();
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

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-2 flex items-center gap-3">
            Watchlist Pro
            <Star className="text-blue-accent w-7 h-7" fill="currentColor" />
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

      {/* TABS */}
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

      <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-bg-secondary/50">
          <span className="font-heading font-bold text-text-primary tracking-wide flex items-center gap-2">
            {activeList}
            <span className="bg-blue-accent/10 text-blue-accent border border-blue-accent/20 px-2 py-0.5 rounded text-xs font-bold ml-2">
              {items.length}
            </span>
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-muted font-mono text-sm animate-pulse tracking-widest uppercase">
            Loading Assets...
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center">
            <Star className="w-12 h-12 text-border mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold text-text-primary mb-2">Watchlist is empty</h3>
            <p className="text-text-muted mb-8 text-sm">Add instruments from the screener or dashboard.</p>
            <Link to="/analyse" className="bg-blue-accent hover:bg-blue-accent/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all inline-flex">
              Discover Assets
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary/30 border-b border-border text-[10px] font-bold tracking-widest text-text-muted uppercase">
                  <th className="py-4 px-6">Asset</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6 text-right">Change</th>
                  <th className="py-4 px-6 text-center">AI Score</th>
                  <th className="py-4 px-6 text-center">News Mood</th>
                  <th className="py-4 px-6 text-center">Alerts</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {items.map((item) => {
                  const live = stockMap.get(item.symbol);
                  const isUp = (live?.change ?? 0) >= 0;
                  
                  // Mock AI Scores based on string length to look somewhat deterministic but varied
                  const aiScore = 60 + (item.symbol.length * 5) % 35; 
                  const mood = aiScore > 80 ? "Bullish" : aiScore > 70 ? "Neutral" : "Bearish";
                  const moodColor = mood === "Bullish" ? "text-green-gain bg-green-gain/10 border-green-gain/20" : mood === "Bearish" ? "text-red-loss bg-red-loss/10 border-red-loss/20" : "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
                  
                  return (
                    <tr key={item.id} className="hover:bg-blue-accent/5 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-bg-secondary border border-border flex items-center justify-center font-bold text-xs text-text-primary">
                            {item.symbol[0]}
                          </div>
                          <div>
                            <Link to={`/stock/${item.symbol}`} className="font-mono font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">
                              {item.symbol}
                            </Link>
                            <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">
                              {live?.name?.substring(0,20) || "Asset"} • {item.exchange}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">
                          {live ? formatCurrency(live.price, item.exchange) : "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {live ? (
                          <div className="flex flex-col items-end">
                            <span className={`inline-flex items-center gap-1 font-mono text-sm font-bold ${isUp ? "text-green-gain" : "text-red-loss"}`}>
                              {isUp ? "▲" : "▼"} {Math.abs(live.changePercent).toFixed(2)}%
                            </span>
                            <span className={`text-[10px] font-mono mt-0.5 ${isUp ? "text-green-gain/70" : "text-red-loss/70"}`}>
                              {isUp ? "+" : ""}{live.change.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-muted font-mono">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                         <div className="flex items-center justify-center gap-1.5">
                           <Cpu size={14} className="text-purple-accent" />
                           <span className="font-mono font-bold text-sm text-text-primary">{aiScore}/100</span>
                         </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${moodColor}`}>
                           {mood}
                         </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="text-text-muted hover:text-blue-accent transition-colors mx-auto flex">
                           <Bell size={16} />
                        </button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => remove(item.id)}
                          className="p-2 text-text-muted hover:text-red-loss hover:bg-red-loss/10 rounded-lg transition-colors inline-flex mx-auto"
                          title="Remove from Watchlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
