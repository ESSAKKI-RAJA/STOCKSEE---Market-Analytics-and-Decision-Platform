import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function WatchlistButton({
  symbol,
  exchange,
  size = "sm",
}: { symbol: string; exchange: string; size?: "sm" | "md" }) {
  const { user } = useAuth();
  const { has, add, remove, items } = useWatchlist();
  const navigate = useNavigate();
  const inList = has(symbol, exchange);
  const item = items.find((i) => i.symbol === symbol && i.exchange === exchange);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    if (inList && item) {
      await remove(item.id);
      toast.info(`Removed ${symbol}`);
    } else {
      await add(symbol, exchange);
      toast.success(`Added ${symbol}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 transition-all font-mono text-[10px] font-bold uppercase rounded-md backdrop-blur-sm ${
        inList 
          ? "bg-[rgba(59,130,246,0.15)] text-[var(--blue)] border border-[rgba(59,130,246,0.4)] shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
          : "bg-[rgba(17,24,39,0.5)] text-[var(--text-muted)] border border-[var(--border-1)] hover:border-[var(--border-2)] hover:text-white"
      } ${size === "md" ? "px-3 py-1.5" : "p-1.5"}`}
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star size={14} className={inList ? "fill-current" : ""} />
      {size === "md" && (
        <span>{inList ? "WATCHING" : "ADD WATCHLIST"}</span>
      )}
    </button>
  );
}
