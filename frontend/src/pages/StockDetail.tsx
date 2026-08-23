import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { allStocks, generateChartData } from "@/data/stockData";
import { ArrowLeft, BarChart2, TrendingUp, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CompanyProfileSection from "@/components/CompanyProfileSection";
import WatchlistButton from "@/components/WatchlistButton";
import { useStockPrices } from "@/hooks/useStockPrices";
import { formatCurrency } from "@/lib/currency";
import DecisionIntelligence from "@/components/analysis/DecisionIntelligence";
import EvidencePanel from "@/components/analysis/EvidencePanel";
import DataQualityBadge from "@/components/analysis/DataQualityBadge";

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
      <div className="bg-zinc-900 border border-zinc-800 rounded p-6 relative overflow-hidden group shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="text-4xl w-14 h-14 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center">
              {stock.flag}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-heading text-3xl font-bold text-zinc-50 m-0 tracking-tight">
                  {stock.symbol}
                </h1>
                <span className="text-[10px] font-bold tracking-widest text-sky-500 uppercase font-mono">
                  {stock.exchange}
                </span>
                <DataQualityBadge source={meta?.source} delay_label={meta?.delay_label} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">{stock.name}</div>
            </div>
          </div>

          <div className="flex items-end gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-left lg:text-right">
              <div className="font-mono text-4xl font-bold text-zinc-50 leading-none mb-2">
                {formatCurrency(stock.price, stock.exchange)}
              </div>
              <div className="flex flex-col lg:items-end">
                <div className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-1.5 uppercase tracking-wider">
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
      <div className="flex items-center gap-4 overflow-x-auto border-b border-zinc-800 hide-scrollbar mt-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[13px] font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab ? "text-zinc-50" : "text-muted-foreground hover:text-zinc-100"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-sky-500" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-full">
            <DecisionIntelligence symbol={stock.symbol} />
          </div>
          <div className="lg:col-span-4 h-full">
            <EvidencePanel symbol={stock.symbol} />
          </div>
          <div className="lg:col-span-4">
            <div className="stocksee-card h-full">
              <div className="px-1 py-1 bg-zinc-950 flex items-center gap-2 mb-4">
                <span className="font-heading font-bold text-zinc-50 tracking-wide uppercase text-[12px]">Company Profile</span>
              </div>
              <div>
                <CompanyProfileSection
                  symbol={stock.symbol}
                  name={stock.name}
                  exchange={stock.exchange}
                  sector={stock.sector}
                />
              </div>

              <div className="px-1 py-1 bg-zinc-950 flex items-center gap-2 mb-4 mt-6">
                <span className="font-heading font-bold text-zinc-50 tracking-wide uppercase text-[12px]">Key Statistics</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Market Cap", value: stock.marketCap },
                  { label: "P/E Ratio", value: stock.pe?.toFixed(2) || "—" },
                  { label: "52W High", value: stock.high52w ? formatCurrency(stock.high52w, stock.exchange) : "—" },
                  { label: "52W Low", value: stock.low52w ? formatCurrency(stock.low52w, stock.exchange) : "—" },
                  { label: "Avg Volume", value: stock.volume },
                  { label: "Sector", value: stock.sector },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
                    <span className="text-[13px] text-zinc-50 font-mono font-bold">{s.value}</span>
                  </div>
                ))}
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
                    stroke="var(--blue-accent, #0ea5e9)"
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
