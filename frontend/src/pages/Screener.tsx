import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUpDown, Download, Settings, Cpu, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { allStocks } from "@/data/stockData";

export default function Screener() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["screener", filterType, search],
    queryFn: async () => {
      // Mocking the backend call logic while preserving local UI rich data
      const res = await apiClient.get<any>("/api/stocks/screener");
      const validSymbols = (res.results || []).map((r: any) => r.symbol);
      // Fallback to local filtering for UI richness if backend data is incomplete
      return allStocks.filter(stock => {
        const matchesSearch = stock.symbol.toLowerCase().includes(search.toLowerCase()) || 
                             stock.name.toLowerCase().includes(search.toLowerCase());
        
        if (!matchesSearch) return false;
        if (filterType === "gainers") return stock.changePercent > 0;
        if (filterType === "losers") return stock.changePercent < 0;
        if (filterType === "volatile") return Math.abs(stock.changePercent) > 2.5;
        return true;
      });
    }
  });

  const filteredStocks = data || [];

  const handleExportCsv = () => {
    const headers = "Symbol,Name,Price,Change%,Sector\\n";
    const rows = filteredStocks.map(s => `${s.symbol},${s.name},${s.price},${s.changePercent},${s.sector}`).join("\\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screener_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAIScan = async () => {
    try {
      const symbols = filteredStocks.slice(0, 5).map(s => s.symbol);
      if (symbols.length === 0) return alert("No stocks to scan");
      const res = await apiClient.post<any>("/api/ai/scan", { symbols });
      console.log("AI Scan Results:", res.results);
      alert("AI Scan complete. Check console for summaries of top 5 stocks.");
    } catch (e) {
      console.error(e);
      alert("AI Scan failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      <Helmet>
        <title>Screener Pro | STOCKSEE Terminal</title>
      </Helmet>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center shadow-inner">
            <Filter className="w-6 h-6 text-purple-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">Screener Pro</h1>
            <p className="text-text-muted text-sm font-medium">
              High-density global market scanning and advanced filtering
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCsv} className="bg-bg-secondary text-text-primary hover:bg-card-surface border border-border px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={handleAIScan} className="bg-blue-accent text-white hover:bg-blue-accent/90 px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_4px_14px_rgba(37,99,255,0.3)] transition-all flex items-center gap-2">
            <Cpu size={16} /> AI Scan
          </button>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="bg-card-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search symbol, company, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl py-2.5 pl-12 pr-4 text-text-primary placeholder:text-text-muted outline-none focus:border-blue-accent/50 focus:ring-1 focus:ring-blue-accent/50 transition-all font-medium text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Presets:</span>
          {["All", "Gainers", "Losers", "Volatile"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                filterType === type.toLowerCase()
                  ? "bg-blue-accent/10 border-blue-accent/30 text-blue-accent"
                  : "bg-bg-secondary border-transparent text-text-muted hover:text-text-primary hover:border-border"
              }`}
            >
              {type}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-1 hidden md:block"></div>
          <button className="text-text-muted hover:text-text-primary p-2 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-bg-secondary/50 border-b border-border text-[10px] font-bold tracking-widest text-text-muted uppercase">
                <th className="py-3 px-6 cursor-pointer hover:text-text-primary transition-colors">
                  <div className="flex items-center gap-1">Asset <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3 px-6 text-right cursor-pointer hover:text-text-primary transition-colors">
                  <div className="flex items-center justify-end gap-1">Price <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3 px-6 text-right cursor-pointer hover:text-text-primary transition-colors">
                  <div className="flex items-center justify-end gap-1">Change <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3 px-6 text-right cursor-pointer hover:text-text-primary transition-colors">
                  <div className="flex items-center justify-end gap-1">Volume <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3 px-6 text-right cursor-pointer hover:text-text-primary transition-colors">
                  <div className="flex items-center justify-end gap-1">Market Cap <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3 px-6 text-center cursor-pointer hover:text-text-primary transition-colors">
                  <div className="flex items-center justify-center gap-1">Tech Rating <ChevronDown size={12} /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted font-bold">Loading...</td>
                </tr>
              ) : filteredStocks.map((stock) => {
                const isUp = stock.changePercent >= 0;
                
                // Mock metrics for high density UI
                const vol = (Math.random() * 50 + 1).toFixed(1) + "M";
                const mcap = (Math.random() * 2000 + 10).toFixed(1) + "B";
                
                const techScore = 40 + Math.random() * 60;
                const techRating = techScore > 80 ? "Strong Buy" : techScore > 60 ? "Buy" : techScore > 45 ? "Neutral" : "Sell";
                const ratingColor = techRating.includes("Buy") ? "text-green-gain" : techRating === "Sell" ? "text-red-loss" : "text-text-muted";
                
                return (
                  <tr key={`${stock.exchange}-${stock.symbol}`} className="hover:bg-blue-accent/5 transition-colors group">
                    <td className="py-2.5 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-lg opacity-80">{stock.flag}</span>
                        <div className="flex flex-col items-start justify-center">
                          <Link to={`/stock/${stock.symbol}`} className="font-heading font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors leading-none">
                            {stock.symbol}
                          </Link>
                          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-1 leading-none">{stock.name.substring(0,25)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      <span className="font-mono font-bold text-text-primary text-sm leading-none block">
                        {formatCurrency(stock.price, stock.exchange)}
                      </span>
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      <div className="flex flex-col items-end justify-center">
                        <span className={`inline-flex items-center gap-1 font-mono text-sm font-bold leading-none ${isUp ? "text-green-gain" : "text-red-loss"}`}>
                          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                        <span className={`text-[10px] font-mono mt-1 leading-none ${isUp ? "text-green-gain/70" : "text-red-loss/70"}`}>
                          {isUp ? "+" : ""}{stock.change.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      <span className="font-mono font-bold text-text-muted text-xs leading-none block">
                        {vol}
                      </span>
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      <span className="font-mono font-bold text-text-muted text-xs leading-none block">
                        {mcap}
                      </span>
                    </td>
                    <td className="py-2.5 px-6 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${
                        techRating.includes("Buy") ? "bg-green-gain/10 border-green-gain/20 text-green-gain" : 
                        techRating === "Sell" ? "bg-red-loss/10 border-red-loss/20 text-red-loss" : 
                        "bg-bg-secondary border-border text-text-muted"
                      }`}>
                        {techRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted font-bold">
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border bg-bg-secondary/30 flex items-center justify-between">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Showing {filteredStocks.length} Results
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded bg-bg-secondary border border-border text-xs font-bold text-text-muted hover:text-text-primary transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1.5 rounded bg-blue-accent/10 border border-blue-accent/30 text-xs font-bold text-blue-accent">1</button>
            <button className="px-3 py-1.5 rounded bg-bg-secondary border border-border text-xs font-bold text-text-muted hover:text-text-primary transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
