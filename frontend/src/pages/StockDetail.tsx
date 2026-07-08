import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { allStocks, generateChartData } from "@/services/mock/stockData";
import { ArrowLeft, Bot, Loader2, BarChart2, TrendingUp, Cpu, Info, Target, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ReactMarkdown from "react-markdown";
import AIInsightCard from "@/components/AIInsightCard";
import CompanyProfileSection from "@/components/CompanyProfileSection";
import WatchlistButton from "@/components/WatchlistButton";
import { useStockPrices } from "@/hooks/useStockPrices";
import { formatCurrency } from "@/lib/currency";
import { apiClient } from "@/lib/apiClient";
import CoreQuestionsOverview from "@/components/CoreQuestionsOverview";

const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y", "MAX"] as const;
const tfDays: Record<string, number> = { "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "5Y": 1825, "MAX": 3650 };
const tabs = ["Overview", "Chart", "Financials", "News", "Analyst", "Quant", "Peers"];

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const { stocks, priceMeta } = useStockPrices();
  const stock = stocks.find((s) => s.symbol === symbol) || allStocks.find((s) => s.symbol === symbol) || allStocks[0];
  const meta = priceMeta.get(stock.symbol);
  
  const [tf, setTf] = useState<string>("1M");
  const [activeTab, setActiveTab] = useState("Overview");
  
  const [showAI, setShowAI] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const chartData = useMemo(() => generateChartData(tfDays[tf]), [tf]);
  const isUp = stock.change >= 0;

  const fetchAI = async () => {
    if (aiContent && !aiError) { setShowAI(!showAI); return; }
    setShowAI(true);
    setAiError(null);
    setAiLoading(true);
    setAiContent("");
    try {
      const res = await apiClient.post<any>("/api/ai/report", { symbol: stock.symbol });
      const data = res.data || res; // depending on FallbackResponse structure
      const markdown = `
### ${data.company_summary || "Analysis Report"}

**Final Analysis**: ${data.final_analysis_summary || ""}

**Technical**: ${data.technical_analysis || ""}
**Sentiment**: ${data.sentiment_analysis || ""}
**Prediction**: ${data.prediction_insight || ""}

**Risks**:
${(data.risk_factors || []).map((r: string) => `- ${r}`).join('\\n')}

**Limitations**:
${(data.limitations || []).map((l: string) => `- ${l}`).join('\\n')}

*${data.disclaimer || ""}*
`;
      setAiContent(markdown);
    } catch (e: unknown) {
      console.error("AI advisor error", e);
      setAiError(e instanceof Error ? e.message : "Could not load AI analysis.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCompare = async () => {
    try {
      const res = await apiClient.post<any>("/api/stocks/compare", { symbols: [stock.symbol, "AAPL"] });
      console.log(res);
      alert(`Comparison data retrieved for ${stock.symbol} and AAPL. Check console for details.`);
    } catch (e: unknown) {
      console.error(e);
      alert("Failed to compare");
    }
  };

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
              <button onClick={fetchAI} className="bg-blue-accent hover:bg-blue-accent/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,255,0.3)] transition-all flex items-center gap-2 justify-center whitespace-nowrap">
                <Bot size={16} /> Generate AI Report
              </button>
              <div className="flex gap-2">
                <WatchlistButton symbol={stock.symbol} exchange={stock.exchange} size="md" />
                <button onClick={handleCompare} className="bg-bg-secondary text-text-primary border border-border hover:bg-blue-accent/10 hover:border-blue-accent/30 hover:text-blue-accent px-4 py-2 rounded-xl font-bold text-sm transition-all flex-1">
                  Compare
                </button>
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
        <CoreQuestionsOverview stock={stock} meta={meta} />
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ── LEFT COLUMN (Main Content) ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* AI REPORT COMPONENT */}
          {showAI && (
            <div className="bg-card-surface border border-purple-accent/30 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(124,58,237,0.1)] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-accent to-purple-accent" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center text-purple-accent">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-text-primary text-lg">Institutional AI Report</h2>
                      <div className="text-xs text-text-muted font-mono mt-0.5">GENERATED FOR {stock.symbol}</div>
                    </div>
                  </div>
                  <button onClick={() => setShowAI(false)} className="text-text-muted hover:text-text-primary text-sm font-bold bg-bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Close
                  </button>
                </div>

                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="animate-spin w-8 h-8 text-purple-accent" /> 
                    <span className="font-mono text-sm font-bold tracking-widest text-text-muted animate-pulse uppercase">Compiling Institutional Analysis...</span>
                  </div>
                ) : aiError ? (
                  <div className="p-4 bg-red-loss/10 border border-red-loss/20 rounded-xl text-red-loss flex items-center justify-between">
                    <div className="font-bold text-sm">{aiError}</div>
                    <button onClick={fetchAI} className="text-xs font-bold uppercase tracking-wider bg-red-loss text-white px-3 py-1.5 rounded-lg hover:bg-red-loss/90 transition-colors">
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none text-text-primary
                                  [&_p]:mb-4 last:[&_p]:mb-0 leading-relaxed
                                  [&_h2]:text-text-primary [&_h2]:text-xl [&_h2]:font-heading [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border
                                  [&_h3]:text-blue-accent [&_h3]:text-sm [&_h3]:uppercase [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:tracking-wider
                                  [&_strong]:text-text-primary [&_strong]:font-bold
                                  [&_li]:mb-2 [&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-blue-accent
                                  [&_code]:bg-bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-purple-accent [&_code]:font-mono [&_code]:text-xs">
                    <ReactMarkdown>{aiContent}</ReactMarkdown>
                  </div>
                )}
                
                {!aiLoading && !aiError && (
                  <div className="mt-8 pt-4 border-t border-border flex justify-end">
                     <button className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary flex items-center gap-2 transition-colors">
                       Export PDF
                     </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CHART */}
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

          {/* COMPANY PROFILE */}
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

        {/* ── RIGHT COLUMN ── */}
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

          {/* QUANT ENGINE PRO */}
          <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-bg-secondary/50 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-accent" />
              <span className="font-heading font-bold text-text-primary tracking-wide">Quant Engine Pro</span>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-sm font-bold text-text-muted uppercase tracking-wider">AI Quant Signal</span>
                <span className="px-3 py-1 rounded bg-green-gain/10 text-green-gain font-bold text-sm uppercase tracking-widest border border-green-gain/20">Bullish</span>
              </div>
              
              {[
                { label: "Momentum Score", val: 85, color: "bg-green-gain" },
                { label: "Quality Score", val: 92, color: "bg-blue-accent" },
                { label: "Value Score", val: 45, color: "bg-orange-500" },
                { label: "Risk Score", val: 30, color: "bg-purple-accent" },
              ].map((q) => (
                <div key={q.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-text-muted">{q.label}</span>
                    <span className="text-text-primary font-mono">{q.val}/100</span>
                  </div>
                  <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${q.color} rounded-full`} style={{ width: `${q.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INDICATORS (AI Insight Card - Legacy adaptation) */}
          <AIInsightCard symbol={stock.symbol} exchange={stock.exchange} />

        </div>
      </div>
      )}
    </div>
  );
}
