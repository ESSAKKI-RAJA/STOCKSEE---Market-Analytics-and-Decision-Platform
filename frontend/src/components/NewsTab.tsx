import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface NewsArticle {
  headline: string;
  summary?: string;
  source?: string;
  datetime?: number | string;
  url?: string;
}

interface NewsApiResponse {
  status?: string;
  mode?: string;
  data?: { articles?: NewsArticle[] } | NewsArticle[];
}

export default function NewsTab({ symbol }: { symbol: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<string>("unknown");

  useEffect(() => {
    apiClient.get<NewsApiResponse>(`/api/news/${symbol}`)
      .then((res) => {
        const rawData = res.data;
        const arts = Array.isArray(rawData) ? rawData : (rawData?.articles || []);
        setArticles(arts);
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
