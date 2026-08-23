import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { allStocks } from "@/data/stockData";
import { ArrowLeft, BarChart2, Globe, Newspaper, BookOpen, Loader2 } from "lucide-react";
import CompanyProfileSection from "@/components/CompanyProfileSection";
import WatchlistButton from "@/components/WatchlistButton";
import { useStockPrices } from "@/hooks/useStockPrices";
import { formatCurrency } from "@/lib/currency";
import DecisionIntelligence from "@/components/analysis/DecisionIntelligence";
import EvidencePanel from "@/components/analysis/EvidencePanel";
import DataQualityBadge from "@/components/analysis/DataQualityBadge";
import EssaiPanel from "@/components/EssaiPanel";
import EssaiChat from "@/components/EssaiChat";
import StockChart from "@/components/StockChart";
import { apiClient } from "@/lib/apiClient";

const tabs = ["Overview", "Chart", "News"] as const;
type Tab = typeof tabs[number];

interface NewsArticle {
  headline: string;
  summary?: string;
  source?: string;
  datetime?: string;
  url?: string;
}

function NewsTab({ symbol }: { symbol: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<string>("unknown");

  useEffect(() => {
    apiClient.get<any>(`/api/news/${symbol}`)
      .then((res) => {
        const arts = res.data?.articles || res.data || [];
        setArticles(Array.isArray(arts) ? arts : []);
        setMode(res.mode || "unknown");
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2">
        <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
        <span className="text-xs text-zinc-500">Loading news…</span>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="py-16 text-center text-zinc-500 text-sm">
        No news available for {symbol}.
        {mode === "demo" && <div className="text-xs text-amber-500 mt-2">Demo mode — set FINNHUB_API_KEY for real news</div>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mode === "demo" && (
        <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">DEMO NEWS</span>
          <span className="text-[10px] text-zinc-500">Set FINNHUB_API_KEY for real news</span>
        </div>
      )}
      {articles.map((a, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-sky-500/30 transition-colors cursor-pointer"
          onClick={() => a.url && window.open(a.url, "_blank")}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-zinc-500 font-mono">{a.source}</span>
            {a.datetime && (
              <span className="text-[10px] text-zinc-600 font-mono">·</span>
            )}
            {a.datetime && (
              <span className="text-[10px] text-zinc-600 font-mono">
                {new Date(typeof a.datetime === "number" ? a.datetime * 1000 : a.datetime).toLocaleDateString()}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 leading-snug mb-1">{a.headline}</h3>
          {a.summary && <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{a.summary}</p>}
          {a.url && <div className="text-[10px] text-sky-500 mt-2 font-mono">Read more →</div>}
        </div>
      ))}
    </div>
  );
}

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const { stocks, priceMeta } = useStockPrices();
  const stock = stocks.find((s) => s.symbol === symbol) || allStocks.find((s) => s.symbol === symbol) || allStocks[0];
  const meta = priceMeta.get(stock.symbol);

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showEssaiChat, setShowEssaiChat] = useState(false);

  const isUp = stock.change >= 0;

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">

      {/* ── TOP NAV ── */}
      <div className="flex items-center gap-2 text-zinc-500 text-sm pb-2">
        <Link to="/" className="hover:text-sky-400 transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider text-[11px]">
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-zinc-200 font-bold uppercase tracking-wider text-[11px]">
          {stock.symbol} Terminal
        </span>
      </div>

      {/* HEADER */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Left: identity */}
          <div className="flex items-center gap-5">
            <div className="text-4xl w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
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
              <div className="text-zinc-400 text-sm font-medium">{stock.name}</div>
            </div>
          </div>

          {/* Right: price */}
          <div className="flex items-end gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-left lg:text-right">
              <div className="font-mono text-4xl font-bold text-zinc-50 leading-none mb-2">
                {formatCurrency(stock.price, stock.exchange)}
              </div>
              <div className="flex flex-col lg:items-end gap-1">
                <div className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                </div>
                <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                  {meta?.source ? `Source: ${meta.source}` : "Price source: loading"}
                </div>
              </div>
            </div>
            <div>
              <WatchlistButton symbol={stock.symbol} exchange={stock.exchange} size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-4 overflow-x-auto border-b border-zinc-800 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[13px] font-bold transition-all relative whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab === "Overview" && <BookOpen className="w-3.5 h-3.5" />}
            {tab === "Chart" && <BarChart2 className="w-3.5 h-3.5" />}
            {tab === "News" && <Newspaper className="w-3.5 h-3.5" />}
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-sky-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Col 1: Decision Intelligence (real signal) */}
          <div className="lg:col-span-4 h-full">
            <DecisionIntelligence symbol={stock.symbol} />
          </div>

          {/* Col 2: Evidence Panel */}
          <div className="lg:col-span-4 h-full">
            <EvidencePanel symbol={stock.symbol} />
          </div>

          {/* Col 3: Company Profile + Key Stats */}
          <div className="lg:col-span-4">
            <div className="stocksee-card h-full">
              <div className="px-1 py-1 bg-zinc-950 flex items-center gap-2 mb-4">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span className="font-heading font-bold text-zinc-50 tracking-wide uppercase text-[12px]">Company Profile</span>
              </div>
              <CompanyProfileSection
                symbol={stock.symbol}
                name={stock.name}
                exchange={stock.exchange}
                sector={stock.sector}
              />

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
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{s.label}</span>
                    <span className="text-[13px] text-zinc-50 font-mono font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ESSAI Panel — full width below */}
          <div className="lg:col-span-12">
            <div className="bg-zinc-900 border border-sky-500/20 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 bg-gradient-to-r from-sky-500/5 to-transparent">
                <span className="text-[11px] font-bold tracking-widest uppercase text-sky-400">ESSAI — STOCKSEE Intelligence</span>
                <span className="ml-3 text-[10px] text-zinc-600">Evidence-backed · Confidence-aware · Not financial advice</span>
              </div>
              <EssaiPanel
                symbol={stock.symbol}
                onOpenChat={() => setShowEssaiChat(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── CHART TAB ── */}
      {activeTab === "Chart" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-[450px]">
          <StockChart symbol={stock.symbol} exchange={stock.exchange} />
        </div>
      )}

      {/* ── NEWS TAB ── */}
      {activeTab === "News" && (
        <NewsTab symbol={stock.symbol} />
      )}

      {/* ESSAI Chat Modal */}
      {showEssaiChat && (
        <EssaiChat
          symbol={stock.symbol}
          companyName={stock.name}
          onClose={() => setShowEssaiChat(false)}
        />
      )}
    </div>
  );
}
