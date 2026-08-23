import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Activity, TrendingUp, History, Bell, Navigation } from "lucide-react";

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Input */}
        <div className="flex items-center px-4 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <Search className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-0 text-lg font-body"
            placeholder="Search symbols, actions, concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded font-mono font-medium tracking-wider">
              ESC
            </span>
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] p-4 space-y-6 custom-scrollbar">
          
          {query.trim() === "" ? (
            <>
              {/* Quick Actions */}
              <section>
                <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button onClick={() => handleNavigate("/screener")} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded hover:border-sky-500/50 hover:bg-zinc-900 transition-all text-left group">
                    <div className="w-8 h-8 rounded bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-zinc-950 transition-colors shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm text-zinc-50 truncate">Market Signals</div>
                      <div className="text-[11px] text-zinc-500 truncate">View global technicals</div>
                    </div>
                  </button>
                  <button onClick={() => handleNavigate("/analyse")} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded hover:border-sky-500/50 hover:bg-zinc-900 transition-all text-left group">
                    <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm text-zinc-50 truncate">Trending Assets</div>
                      <div className="text-[11px] text-zinc-500 truncate">Highest volatility today</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded hover:border-sky-500/50 hover:bg-zinc-900 transition-all text-left group sm:col-span-2">
                    <div className="w-8 h-8 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center group-hover:bg-zinc-700 transition-colors shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1 flex justify-between items-center">
                      <div>
                        <div className="font-heading font-bold text-sm text-zinc-50 truncate">Open Alerts Console</div>
                        <div className="text-[11px] text-zinc-500 truncate">Manage active triggers</div>
                      </div>
                      <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">Coming Soon</span>
                    </div>
                  </button>
                </div>
              </section>

              {/* Recent Searches */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Recent</h2>
                  <button className="text-[10px] text-sky-500 hover:text-sky-400 font-bold uppercase tracking-wider">Clear</button>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleNavigate("/stock/NVDA")} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded transition-colors group">
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 text-zinc-500" />
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-sm text-zinc-50 font-bold">NVDA</span>
                        <span className="text-[11px] text-zinc-500">NVIDIA Corp</span>
                      </div>
                    </div>
                    <Navigation className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button onClick={() => handleNavigate("/stock/AAPL")} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded transition-colors group">
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 text-zinc-500" />
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-sm text-zinc-50 font-bold">AAPL</span>
                        <span className="text-[11px] text-zinc-500">Apple Inc</span>
                      </div>
                    </div>
                    <Navigation className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </section>
            </>
          ) : (
            <section>
              <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Results</h2>
              <div className="flex flex-col gap-1">
                <button onClick={() => handleNavigate(`/stock/${query.toUpperCase()}`)} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded hover:border-sky-500/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-50">
                      {query.toUpperCase().slice(0, 4)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-sm text-zinc-50 font-bold">{query.toUpperCase()}</span>
                      <span className="text-[11px] text-zinc-500">Go to Analysis Terminal</span>
                    </div>
                  </div>
                  <Navigation className="w-4 h-4 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
