import { useState, useEffect } from "react";
import { useStockPrices } from "@/hooks/useStockPrices";
import StockCard from "@/components/StockCard";
import { Search, Globe, RefreshCw, BarChart2, Activity, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Zap, Target, BarChart3, MessageSquare, Database } from "lucide-react";
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

const MOCK_CRYPTO = [
  { symbol: "BTC", name: "Bitcoin", price: 68430.50, change: 2.4, vol: "42.5B", cap: "1.3T", rsi: 65, trend: "Bullish" },
  { symbol: "ETH", name: "Ethereum", price: 3450.20, change: 1.8, vol: "18.2B", cap: "410B", rsi: 58, trend: "Bullish" },
  { symbol: "SOL", name: "Solana", price: 145.80, change: -3.2, vol: "5.1B", cap: "65B", rsi: 42, trend: "Neutral" },
  { symbol: "BNB", name: "Binance Coin", price: 590.40, change: 0.5, vol: "1.2B", cap: "89B", rsi: 55, trend: "Bullish" },
  { symbol: "XRP", name: "Ripple", price: 0.62, change: -1.1, vol: "2.3B", cap: "34B", rsi: 48, trend: "Neutral" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.15, change: 5.6, vol: "3.5B", cap: "22B", rsi: 72, trend: "Strong Bullish" },
  { symbol: "ADA", name: "Cardano", price: 0.58, change: -0.4, vol: "450M", cap: "20B", rsi: 45, trend: "Neutral" },
  { symbol: "AVAX", name: "Avalanche", price: 45.20, change: 4.1, vol: "850M", cap: "17B", rsi: 61, trend: "Bullish" },
  { symbol: "DOT", name: "Polkadot", price: 8.40, change: -2.5, vol: "320M", cap: "12B", rsi: 38, trend: "Bearish" },
  { symbol: "LINK", name: "Chainlink", price: 18.50, change: 1.2, vol: "410M", cap: "11B", rsi: 52, trend: "Neutral" },
  { symbol: "MATIC", name: "Polygon", price: 0.95, change: -1.8, vol: "280M", cap: "9B", rsi: 41, trend: "Bearish" },
];

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
    await new Promise(r => setTimeout(r, 800)); // fake delay for crypto
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
      {/* ========================================= */}
      {assetClass === "Crypto" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          {/* Advanced Analytics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 flex items-center gap-4 bg-[var(--panel-1)]">
              <div className="w-10 h-10 rounded-full bg-[rgba(245,158,11,0.1)] text-[var(--yellow)] flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Fear & Greed</div>
                <div className="text-xl font-bold text-[var(--text-1)]">72 <span className="text-sm text-[var(--green)]">Greed</span></div>
              </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-4 bg-[var(--panel-1)]">
              <div className="w-10 h-10 rounded-full bg-[rgba(59,130,246,0.1)] text-[var(--blue)] flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">BTC Dominance</div>
                <div className="text-xl font-bold text-[var(--text-1)]">52.4%</div>
              </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-4 bg-[var(--panel-1)]">
              <div className="w-10 h-10 rounded-full bg-[rgba(16,185,129,0.1)] text-[var(--green)] flex items-center justify-center">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">ETH Gas Trend</div>
                <div className="text-xl font-bold text-[var(--text-1)]">12 Gwei</div>
              </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-4 bg-[var(--panel-1)]">
              <div className="w-10 h-10 rounded-full bg-[rgba(239,68,68,0.1)] text-[var(--red)] flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Social Sentiment</div>
                <div className="text-xl font-bold text-[var(--text-1)]">Bullish</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Top Coins Table */}
            <div className="lg:col-span-3 glass-panel overflow-hidden bg-[var(--panel-1)]">
              <div className="t-header border-b border-[var(--border-1)] bg-[var(--surface-2)] px-6 py-4">
                <h3 className="font-bold text-[var(--text-1)] flex items-center gap-2">
                  <Database size={18} className="text-[var(--blue)]" />
                  Top Cryptocurrencies
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="t-table w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-6 py-3">Asset</th>
                      <th className="text-right px-6 py-3">Price</th>
                      <th className="text-right px-6 py-3">24h %</th>
                      <th className="text-right px-6 py-3">Volume</th>
                      <th className="text-right px-6 py-3">Market Cap</th>
                      <th className="text-right px-6 py-3">RSI</th>
                      <th className="text-right px-6 py-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_CRYPTO.map((coin) => (
                      <tr key={coin.symbol} className="border-b border-[var(--border-1)] hover:bg-[var(--surface-2)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border-1)] flex items-center justify-center font-bold text-xs text-[var(--text-1)]">
                              {coin.symbol[0]}
                            </div>
                            <div>
                              <div className="font-bold text-[var(--text-1)]">{coin.symbol}</div>
                              <div className="text-xs text-[var(--text-muted)]">{coin.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-[var(--text-1)] text-right">
                          ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-6 py-4 font-mono font-bold text-right ${coin.change >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                          {coin.change > 0 ? "+" : ""}{coin.change}%
                        </td>
                        <td className="px-6 py-4 font-mono text-[var(--text-2)] text-right">{coin.vol}</td>
                        <td className="px-6 py-4 font-mono text-[var(--text-2)] text-right">{coin.cap}</td>
                        <td className="px-6 py-4 font-mono text-[var(--text-2)] text-right">{coin.rsi}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
                            coin.change > 0 ? "bg-[rgba(16,185,129,0.1)] text-[var(--green)]" : coin.change < 0 ? "bg-[rgba(239,68,68,0.1)] text-[var(--red)]" : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                          }`}>
                            {coin.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {coin.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Analytics */}
            <div className="space-y-6">
              <div className="glass-panel p-5 bg-[var(--panel-1)]">
                <h4 className="font-bold text-[var(--text-1)] mb-4 flex items-center justify-between">
                  Top Gainers
                  <ArrowUpRight size={16} className="text-[var(--green)]" />
                </h4>
                <div className="space-y-4">
                  {MOCK_CRYPTO.filter(c => c.change > 0).sort((a,b) => b.change - a.change).slice(0,3).map(c => (
                    <div key={c.symbol} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[var(--text-1)]">{c.symbol}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[var(--green)]">+{c.change}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 bg-[var(--panel-1)]">
                <h4 className="font-bold text-[var(--text-1)] mb-4 flex items-center justify-between">
                  Top Losers
                  <ArrowDownRight size={16} className="text-[var(--red)]" />
                </h4>
                <div className="space-y-4">
                  {MOCK_CRYPTO.filter(c => c.change < 0).sort((a,b) => a.change - b.change).slice(0,3).map(c => (
                    <div key={c.symbol} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[var(--text-1)]">{c.symbol}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[var(--red)]">{c.change}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 bg-[var(--panel-1)]">
                <h4 className="font-bold text-[var(--text-1)] mb-4">Whale Activity</h4>
                <div className="space-y-3">
                  <div className="text-xs flex justify-between p-2 bg-[var(--surface-2)] rounded">
                    <span className="text-[var(--text-muted)]">12,500 BTC</span>
                    <span className="text-[var(--blue)] font-bold">Transfer</span>
                  </div>
                  <div className="text-xs flex justify-between p-2 bg-[var(--surface-2)] rounded">
                    <span className="text-[var(--text-muted)]">150M USDT</span>
                    <span className="text-[var(--green)] font-bold">Minted</span>
                  </div>
                  <div className="text-xs flex justify-between p-2 bg-[var(--surface-2)] rounded">
                    <span className="text-[var(--text-muted)]">50,000 ETH</span>
                    <span className="text-[var(--red)] font-bold">To Exchange</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}



    </div>
  );
}
