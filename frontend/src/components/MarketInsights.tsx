import { useState, useEffect } from "react";
import { Zap, TrendingUp, AlertTriangle, Globe, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  title: string;
  desc: string;
  category: string;
  url: string;
}

const iconMap: Record<string, React.ElementType> = {
  india: TrendingUp,
  usa: Zap,
  global: Globe,
};

const fallbackNews: NewsItem[] = [
  { title: "NIFTY 50 hits new highs on banking strength", desc: "Indian markets rally as banking sector leads gains. NIFTY crosses key resistance levels.", category: "india", url: "https://economictimes.indiatimes.com/markets" },
  { title: "Global markets mixed on central bank signals", desc: "European markets dip while Asian indices show mixed performance on rate outlook uncertainty.", category: "global", url: "https://www.reuters.com/markets/" },
  { title: "Oil prices surge on OPEC+ supply cuts", desc: "Brent crude rallies 2.5% as OPEC+ extends production cuts, boosting energy stocks globally.", category: "global", url: "https://www.bloomberg.com/markets" },
  { title: "S&P 500 rallies on strong tech earnings", desc: "US markets surge as Big Tech reports better-than-expected quarterly results, led by AI demand.", category: "usa", url: "https://www.cnbc.com/markets/" },
];

export default function MarketInsights() {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<string>("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-news");
      if (error) throw error;
      if (Array.isArray(data) && data.length >= 4) {
        setNews(data.slice(0, 4));
        setLastFetched(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Failed to fetch news:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-pro">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-[hsl(var(--text-primary))]">Quick Insights</h2>
        <div className="flex items-center gap-3">
          {lastFetched && <span className="text-[10px] text-[hsl(var(--text-muted))] uppercase tracking-widest">Updated {lastFetched}</span>}
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-1 rounded-md hover:bg-[hsl(var(--surface-1))] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 text-[hsl(var(--text-secondary))] animate-spin" /> : <RefreshCw className="w-4 h-4 text-[hsl(var(--text-secondary))]" />}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {news.map((item, i) => {
          const Icon = iconMap[item.category] || AlertTriangle;
          return (
            <button
              key={i}
              onClick={() => {
                const w = window.open(item.url, "_blank", "noopener,noreferrer");
                if (w) w.opener = null;
              }}
              className="flex gap-4 p-4 rounded-lg bg-[hsl(var(--surface-1))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] transition-colors cursor-pointer w-full text-left"
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5 text-[hsl(var(--accent))]" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[hsl(var(--text-primary))]">{item.title}</p>
                <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">{item.desc}</p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[hsl(var(--surface-2))] text-[hsl(var(--text-muted))] border border-[hsl(var(--border))]">{item.category}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
