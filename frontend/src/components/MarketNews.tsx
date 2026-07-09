import { useEffect, useState, useCallback } from "react";
import { Newspaper, RefreshCw, ExternalLink } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const REFRESH_MS = 5 * 60 * 1000;

interface NewsItem {
  headline: string;
  source: string;
  url: string;
  datetime: number;
}

const FALLBACK: NewsItem[] = [
  {
    headline:
      "Global markets rally as central banks signal pause in rate hikes",
    source: "Reuters",
    url: "https://www.reuters.com/markets/",
    datetime: Date.now() / 1000,
  },
  {
    headline: "NIFTY 50 crosses 22,000 milestone on FII buying surge",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/markets",
    datetime: Date.now() / 1000 - 3600,
  },
  {
    headline:
      "Tech stocks lead S&P 500 higher; Nvidia hits fresh all-time high",
    source: "CNBC",
    url: "https://www.cnbc.com/markets/",
    datetime: Date.now() / 1000 - 7200,
  },
  {
    headline: "Oil prices edge higher on OPEC+ supply discipline signals",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/markets",
    datetime: Date.now() / 1000 - 10800,
  },
];

function formatTime(unixTs: number): string {
  const d = new Date(unixTs * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<NewsItem[]>("/api/market-news");
      if (Array.isArray(data) && data.length > 0) {
        setNews(data);
        setLastFetch(new Date());
      }
    } catch {
      // keep fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const timer = setInterval(fetchNews, REFRESH_MS);
    return () => clearInterval(timer);
  }, [fetchNews]);

  return (
    <div className="t-panel p-0 overflow-hidden shadow-lg border-[rgba(59,130,246,0.2)]">
      <div className="px-5 py-4 border-b border-[var(--border-1)] bg-[var(--surface-1)] flex justify-between items-center">
        <span className="font-semibold text-white tracking-wide flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
            <Newspaper className="w-3.5 h-3.5 text-[var(--blue)]" />
          </div>
          Live Market News
        </span>
        <div className="flex items-center gap-4">
          {lastFetch && (
            <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">
              UPDATED: {lastFetch.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchNews}
            disabled={loading}
            className="text-[var(--text-muted)] hover:text-[var(--blue)] transition-colors"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-[var(--blue)]" : ""}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border-1)]">
        {news.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 hover:bg-[rgba(59,130,246,0.02)] transition-colors flex items-center gap-4 group"
          >
            <span className="font-mono text-xs text-[var(--text-muted)] w-14 flex-shrink-0">
              {formatTime(item.datetime)}
            </span>
            <span className="text-[10px] font-bold text-[var(--blue)] uppercase w-24 flex-shrink-0 tracking-wider">
              {item.source}
            </span>
            <span className="text-sm font-medium text-[var(--text-1)] group-hover:text-white transition-colors truncate flex-1">
              {item.headline}
            </span>
            <ExternalLink
              size={12}
              className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
