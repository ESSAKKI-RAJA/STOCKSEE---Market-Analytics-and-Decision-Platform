import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const REFRESH_MS = 5 * 60 * 1000;

type Signal = "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";

function signalFromScore(score: number): Signal {
  if (score > 0.4) return "STRONG BUY";
  if (score > 0.15) return "BUY";
  if (score >= -0.15) return "HOLD";
  if (score >= -0.4) return "SELL";
  return "STRONG SELL";
}

interface SentimentItem {
  headline: string;
  source: string;
  url: string;
  image?: string;
  datetime: number;
  sentiment: string;
  score: number;
  signal: Signal;
}

const SIGNAL_CONFIG: Record<
  Signal,
  { cls: string; icon: React.ReactNode; label: string }
> = {
  "STRONG BUY": {
    cls: "signal-strong-buy",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    label: "STRONG BUY",
  },
  BUY: {
    cls: "signal-buy",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    label: "BUY",
  },
  HOLD: {
    cls: "signal-hold",
    icon: <Minus className="w-3.5 h-3.5" />,
    label: "HOLD",
  },
  SELL: {
    cls: "signal-sell",
    icon: <TrendingDown className="w-3.5 h-3.5" />,
    label: "SELL",
  },
  "STRONG SELL": {
    cls: "signal-strong-sell",
    icon: <TrendingDown className="w-3.5 h-3.5" />,
    label: "STRONG SELL",
  },
};

function timeAgo(unixTs: number): string {
  const diff = Math.floor(Date.now() / 1000 - unixTs);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SignalBadge({ signal }: { signal: Signal }) {
  const cfg = SIGNAL_CONFIG[signal] || SIGNAL_CONFIG["HOLD"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function SentimentCard({
  item,
  index,
}: {
  item: SentimentItem;
  index: number;
}) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="card-pro group flex flex-col gap-3 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-sm font-semibold text-[hsl(var(--text-primary))] leading-snug
                      group-hover:text-[hsl(var(--accent))] transition-colors line-clamp-3 flex-1"
        >
          {item.headline}
        </p>
        <SignalBadge signal={item.signal as Signal} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded
                         bg-[hsl(var(--surface-1))] text-[hsl(var(--text-muted))]"
        >
          {item.source || "Source"}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-[9px] font-bold uppercase ${
              item.score > 0.15
                ? "text-[#4CAF50]"
                : item.score < -0.15
                  ? "text-[#FF4560]"
                  : "text-[#FFC107]"
            }`}
          >
            {item.score > 0.15
              ? "POSITIVE"
              : item.score < -0.15
                ? "NEGATIVE"
                : "NEUTRAL"}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-[hsl(var(--text-muted))]">
            <Clock className="w-3 h-3" />
            {timeAgo(item.datetime)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[10px] font-medium text-[hsl(var(--accent))] mt-1">
        <ExternalLink className="w-3 h-3" />
        Read full story
      </div>
    </motion.a>
  );
}

interface ApiResponse {
  symbol: string;
  overall_signal: Signal;
  confidence: number;
  articles: SentimentItem[];
}

interface Props {
  symbol: string;
}

export default function AISentiment({ symbol }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(false);
    try {
      const json = await apiClient.get<ApiResponse | SentimentItem[]>(
        `/api/news/${encodeURIComponent(symbol)}`
      );
      if (Array.isArray(json)) {
        const avg = json.reduce((s, i) => s + i.score, 0) / (json.length || 1);
        setData({
          symbol,
          overall_signal: signalFromScore(avg),
          confidence: Math.min(Math.round(Math.abs(avg) * 100), 95),
          articles: json,
        });
      } else if ((json as ApiResponse).articles !== undefined) {
        setData(json as ApiResponse);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(timer);
  }, [fetchData]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[hsl(var(--accent))]" />
          <h2 className="text-lg font-bold text-[hsl(var(--text-primary))]">
            AI News Signals —{" "}
            <span className="text-[hsl(var(--accent))]">{symbol}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {data?.overall_signal && !loading && !error && (
            <SignalBadge signal={data.overall_signal} />
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-[hsl(var(--surface-1))] border border-[hsl(var(--border))]
                       text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]
                       transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-pro animate-pulse space-y-3">
              <div className="h-4 bg-[hsl(var(--surface-3))] rounded w-full" />
              <div className="h-4 bg-[hsl(var(--surface-3))] rounded w-2/3" />
              <div className="h-6 bg-[hsl(var(--surface-3))] rounded w-24" />
            </div>
          ))}
        </div>
      )}

      {error && !data && (
        <div className="card-pro text-center py-10 text-[hsl(var(--text-muted))]">
          <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">AI Signals unavailable.</p>
          <p className="text-xs mt-1">
            Configure FINNHUB_API_KEY in your backend .env file.
          </p>
        </div>
      )}

      {data && data.articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.articles.map((item, i) => (
            <SentimentCard
              key={`${item.datetime}-${i}`}
              item={item}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
