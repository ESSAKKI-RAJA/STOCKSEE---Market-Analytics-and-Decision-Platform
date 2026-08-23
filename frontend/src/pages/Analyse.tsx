import { useState } from "react";
import { useStockPrices } from "@/hooks/useStockPrices";
import StockCard from "@/components/StockCard";
import { Search, Globe, RefreshCw, BarChart2, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";


const assetClasses = ["Stocks", "Crypto"];
const exchanges = ["All", "NSE", "BSE", "NASDAQ", "NYSE", "LSE", "TSE", "HKEX", "XETRA"];
const sectors   = ["All", "Technology", "Financial", "Energy", "Healthcare", "Consumer", "Automotive", "Industrial", "Materials", "Utilities", "Telecom", "Defence"];

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
        active 
          ? "bg-[rgba(59,130,246,0.15)] border-[var(--blue)] text-[var(--blue)] shadow-[0_4px_14px_rgba(59,130,246,0.25)]" 
          : "bg-[var(--surface-1)] border-[var(--border-1)] text-[var(--text-muted)] hover:border-[var(--blue)] hover:text-[var(--text-1)]"
      }`}
    >
      {label}
    </button>
  );
}


export default function Analyse() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab");
  
  const [assetClass, setAssetClass] = useState(
    initialTab && assetClasses.map(a => a.toLowerCase()).includes(initialTab.toLowerCase()) 
      ? assetClasses.find(a => a.toLowerCase() === initialTab.toLowerCase()) || "Stocks"
      : "Stocks"
  );
  const { stocks, lastUpdated, refreshPrices, liveSymbols } = useStockPrices();
  const [search, setSearch] = useState("");
  const [exchange, setExchange] = useState("All");
  const [sector, setSector] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPrices();
    setRefreshing(false);
  };

  const filteredStocks = stocks.filter((s) => {
    if (search && !s.symbol.toLowerCase().includes(search.toLowerCase()) && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (exchange !== "All" && s.exchange !== exchange) return false;
    if (sector !== "All" && s.sector !== sector) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">

      {/* Header & Main Asset Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center shadow-inner">
              <Activity className="w-5 h-5 text-[var(--blue)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-1)] tracking-tight">Market Scanner</h1>
              <p className="text-[var(--text-muted)] text-sm mt-1 font-medium">
                Unified analytics across global asset classes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[var(--surface-2)] p-1.5 rounded-xl border border-[var(--border-1)] overflow-x-auto scrollbar-hide max-w-full">
            {assetClasses.map((ac) => (
              <button
                key={ac}
                onClick={() => setAssetClass(ac)}
                className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 text-center ${
                  assetClass === ac 
                    ? "bg-[rgba(59,130,246,0.15)] text-[var(--blue)] shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.3)]" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-1)] hover:bg-[var(--surface-1)]/50 border border-transparent"
                }`}
              >
                {ac}
              </button>
            ))}
          </div>
        </div>

        {/* Live indicator + refresh */}
        <div className="flex items-center gap-4 mt-2">
          {lastUpdated && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--green)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_6px_2px_rgba(16,185,129,0.4)] animate-pulse" />
                Live Data
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="t-btn bg-[var(--surface-2)] hover:bg-[var(--surface-1)]"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-[var(--blue)]" : ""} />
            {refreshing ? "Updating…" : "Refresh Prices"}
          </button>
        </div>
        <div className="h-px w-full bg-[var(--border-1)] mt-6" />
      </motion.div>

      {/* ========================================= */}
      {/* STOCKS VIEW */}
      {/* ========================================= */}
      {assetClass === "Stocks" && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="glass-panel p-6 space-y-6 bg-[var(--panel-1)]"
          >
            {/* Search */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by symbol, company or sector..."
                className="w-full bg-[var(--surface-2)] border border-[var(--border-1)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-1)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all font-mono"
              />
            </div>

            <div className="space-y-4">
              {/* Exchange filters */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--text-muted)] mb-3">
                  Exchanges
                </div>
                <div className="flex gap-2 flex-wrap">
                  {exchanges.map((e) => (
                    <FilterPill key={e} label={e} active={exchange === e} onClick={() => setExchange(e)} />
                  ))}
                </div>
              </div>

              {/* Sector filters */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--text-muted)] mb-3">
                  Sectors
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sectors.map((s) => (
                    <FilterPill key={s} label={s} active={sector === s} onClick={() => setSector(s)} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--text-muted)] mb-4">
              {filteredStocks.length} instruments found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredStocks.map((s, idx) => (
                <motion.div
                  key={s.symbol}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.025, 0.4), duration: 0.35 }}
                >
                  <StockCard stock={s} isLive={liveSymbols.has(s.symbol)} />
                </motion.div>
              ))}
            </div>

            {filteredStocks.length === 0 && (
              <div className="py-20 text-center glass-panel bg-[var(--panel-1)]">
                <Search className="mx-auto h-12 w-12 text-[var(--border-2)] mb-4" />
                <div className="text-lg font-medium text-[var(--text-1)] mb-2">No instruments matching your criteria.</div>
                <div className="text-sm text-[var(--text-muted)]">Try adjusting your filters or search query.</div>
                <button 
                  onClick={() => { setSearch(""); setExchange("All"); setSector("All"); }}
                  className="mt-6 t-btn"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================= */}
      {/* CRYPTO VIEW */}
      {/* ========================================= */}      {assetClass === "Crypto" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="glass-panel p-8 bg-[var(--panel-1)] text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] flex items-center justify-center">
              <BarChart2 className="w-7 h-7 text-[var(--blue)] opacity-60" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-1)] mb-2">Crypto Data Not Yet Connected</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-md">
                STOCKSEE does not currently have a live crypto market data provider configured.
                Displaying demo or fabricated crypto data would violate our data-trust principles.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-3 opacity-70">
                Real-time stock analysis is available on the Stocks tab.
              </p>
            </div>
            <button
              onClick={() => setAssetClass("Stocks")}
              className="t-btn bg-[var(--surface-2)] hover:bg-[var(--surface-1)]"
            >
              View Stocks
            </button>
          </div>
        </motion.div>
      )}






    </div>
  );
}
