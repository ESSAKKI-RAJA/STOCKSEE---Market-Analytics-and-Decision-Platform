import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { allStocks, generateChartData } from "@/data/stockData";
import { ArrowLeft, BarChart2, TrendingUp, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CompanyProfileSection from "@/components/CompanyProfileSection";
import WatchlistButton from "@/components/WatchlistButton";
import { useStockPrices } from "@/hooks/useStockPrices";
import { formatCurrency } from "@/lib/currency";
import DecisionSnapshot from "@/components/DecisionSnapshot";

const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y", "MAX"] as const;
const tfDays: Record<string, number> = { "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "5Y": 1825, "MAX": 3650 };
const tabs = ["Overview", "Chart", "Financials", "News", "Analyst", "Peers"];

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const { stocks, priceMeta } = useStockPrices();
  const stock = stocks.find((s) => s.symbol === symbol) || allStocks.find((s) => s.symbol === symbol) || allStocks[0];
  const meta = priceMeta.get(stock.symbol);
  
  const [tf, setTf] = useState<string>("1M");
  const [activeTab, setActiveTab] = useState("Overview");

  const chartData = useMemo(() => generateChartData(tfDays[tf]), [tf]);
  const isUp = stock.change >= 0;

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      
      {/* ── TOP NAV ── */}
      <div className="flex items-center gap-2 text-text-muted text-sm pb-2">
        <Link to="/" className="hover:text-blue-accent transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider text-[11px]">
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-text-primary font-bold uppercase tracking-wider text-[11px]">
          {stock.symbol} Terminal
        </span>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-card-surface border border-border rounded-2xl p-6 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="text-4xl drop-shadow-md w-14 h-14 bg-bg-secondary border border-border rounded-xl flex items-center justify-center shadow-inner">
              {stock.flag}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-heading text-3xl font-bold text-text-primary m-0 tracking-tight">
                  {stock.symbol}
                </h1>
                <span className="text-[10px] font-bold tracking-widest text-blue-accent uppercase bg-blue-accent/10 border border-blue-accent/20 px-2 py-0.5 rounded">
                  {stock.exchange}
                </span>
                {meta?.delay_label && (
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                    meta.delay_label.includes("LIVE") 
                      ? "text-green-gain bg-green-gain/10 border-green-gain/20" 
                      : "text-orange-500 bg-orange-500/10 border-orange-500/20"
                  }`}>
                    {meta.delay_label} {meta.source && `(${meta.source})`}
                  </span>
                )}
              </div>
              <div className="text-text-muted text-sm font-medium">{stock.name}</div>
            </div>
          </div>

          <div className="flex items-end gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-left lg:text-right">
              <div className="font-mono text-4xl font-bold text-text-primary leading-none mb-2">
                {formatCurrency(stock.price, stock.exchange)}
              </div>
              <div className="flex flex-col lg:items-end">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-sm font-bold border ${isUp ? "text-green-gain bg-green-gain/10 border-green-gain/20" : "text-red-loss bg-red-loss/10 border-red-loss/20"}`}>
                  {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                </div>
                <div className="text-[10px] text-text-muted font-mono mt-1.5 uppercase tracking-wider">
                  Post-Market: {formatCurrency(stock.price * (1 + (Math.random() * 0.01 - 0.005)), stock.exchange)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <WatchlistButton symbol={stock.symbol} exchange={stock.exchange} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab ? "text-blue-accent" : "text-text-muted hover:text-text-primary hover:bg-bg-secondary/50 rounded-t-lg"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-accent shadow-[0_0_8px_rgba(37,99,255,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Overview" ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DecisionSnapshot symbol={stock.symbol} />
            
            <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-accent" />
                <span className="font-heading font-bold text-text-primary tracking-wide">Company Profile</span>
              </div>
              <div className="p-6">
                <CompanyProfileSection
                  symbol={stock.symbol}
                  name={stock.name}
                  exchange={stock.exchange}
                  sector={stock.sector}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* STATS */}
            <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <span className="font-heading font-bold text-text-primary tracking-wide">Key Statistics</span>
              </div>
              <div className="p-2">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-border/50">
                    {[
                      { label: "Market Cap", value: stock.marketCap },
                      { label: "P/E Ratio", value: stock.pe?.toFixed(2) || "—" },
                      { label: "52W High", value: stock.high52w ? formatCurrency(stock.high52w, stock.exchange) : "—" },
                      { label: "52W Low", value: stock.low52w ? formatCurrency(stock.low52w, stock.exchange) : "—" },
                      { label: "Avg Volume", value: stock.volume },
                      { label: "Sector", value: stock.sector },
                    ].map((s) => (
                      <tr key={s.label} className="hover:bg-blue-accent/5 transition-colors group">
                        <td className="py-3.5 px-4 text-xs text-text-muted font-bold uppercase tracking-wider">{s.label}</td>
                        <td className="py-3.5 px-4 text-sm text-text-primary font-mono font-bold text-right group-hover:text-blue-accent transition-colors">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "Chart" ? (
        <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-secondary/50">
              <span className="font-heading font-bold text-text-primary flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-accent" />
                Advanced Charting
              </span>
              <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg border border-border">
                {timeframes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTf(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all ${
                      tf === t 
                        ? "bg-blue-accent text-white shadow-sm" 
                        : "bg-transparent text-text-muted hover:text-text-primary hover:bg-card-surface"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-3 border-b border-border bg-bg-secondary flex gap-4 text-xs font-bold text-text-muted">
               <button className="hover:text-blue-accent transition-colors flex items-center gap-1"><TrendingUp size={14}/> Indicators</button>
               <button className="hover:text-blue-accent transition-colors flex items-center gap-1">RSI</button>
               <button className="hover:text-blue-accent transition-colors flex items-center gap-1">MACD</button>
               <button className="hover:text-blue-accent transition-colors flex items-center gap-1">EMA</button>
               <button className="hover:text-blue-accent transition-colors flex items-center gap-1">Volume</button>
            </div>

            <div className="h-[450px] p-4 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-accent/5 to-transparent pointer-events-none" />
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--blue-accent, #2563ff)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--blue-accent, #2563ff)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis 
                    domain={["auto", "auto"]} 
                    tick={{ fill: 'var(--text-muted, #94a3b8)', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card-surface, #101826)",
                      border: "1px solid var(--border-color, #1e293b)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace"
                    }}
                    itemStyle={{ color: "var(--blue-accent, #2563ff)", fontWeight: "bold" }}
                    labelStyle={{ color: "var(--text-muted, #94a3b8)", marginBottom: "4px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="var(--blue-accent, #2563ff)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClose)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
      ) : (
        <div className="py-20 text-center text-text-muted">
          Section under development.
        </div>
      )}
    </div>
  );
}
