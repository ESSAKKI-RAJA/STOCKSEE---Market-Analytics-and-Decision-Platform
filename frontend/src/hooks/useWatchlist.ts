import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface WatchlistItem {
  id: string;
  symbol: string;
  exchange: string;
  added_at: string;
}

export function useWatchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data?: string[] }>("/api/watchlist");
      if (res.data) {
        // Backend currently just returns a list of symbols as fallback
        const formatted = res.data.map((sym: string, i: number) => ({
          id: String(i),
          symbol: sym,
          exchange: "US",
          added_at: new Date().toISOString()
        }));
        setItems(formatted);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (symbol: string, exchange: string) => {
    try {
      await apiClient.post("/api/watchlist", { symbol });
      toast.success(`${symbol} added to watchlist`);
      await refresh();
      return true;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error adding to watchlist");
      return false;
    }
  };

  const remove = async (id: string) => {
    // Id is currently just index, but let's find the symbol
    const item = items.find(i => i.id === id);
    if (!item) return false;
    try {
      await apiClient.get(`/api/watchlist/${item.symbol}`, { method: 'DELETE' });
      toast.success("Removed from watchlist");
      await refresh();
      return true;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error removing from watchlist");
      return false;
    }
  };

  const has = (symbol: string, exchange: string) =>
    items.some((i) => i.symbol === symbol && i.exchange === exchange);

  return { items, loading, add, remove, has, refresh };
}
