import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/apiClient";
import { allStocks, type Stock } from "@/services/mock/stockData";

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: string | null;
  market_cap: string | null;
  pe: number | null;
  high_52w: number | null;
  low_52w: number | null;
  source: string | null;
  delay_label: string | null;
  discrepancy: boolean | null;
  exchange: string | null;
  updated_at: string;
}

export interface PriceMeta {
  source: string | null;
  delay_label: string | null;
  discrepancy: boolean;
  updated_at: string;
  cache_hit: boolean;
}

interface ApiResponse {
  status: string;
  mode: string;
  source: string;
  message: string;
  data: Record<string, unknown>[];
  limitations?: string;
  generated_at?: string;
}

function mergeStocks(stocks: Stock[], prices: StockPrice[]): Stock[] {
  const priceMap = new Map(prices.map(p => [p.symbol, p]));
  return stocks.map(stock => {
    const live = priceMap.get(stock.symbol);
    if (!live || live.price <= 0) return stock;
    return {
      ...stock,
      price: Number(live.price),
      change: Number(live.change),
      changePercent: Number(live.change_percent),
      volume: live.volume || stock.volume,
      marketCap: live.market_cap || stock.marketCap,
      pe: live.pe ? Number(live.pe) : stock.pe,
      high52w: live.high_52w ? Number(live.high_52w) : stock.high52w,
      low52w: live.low_52w ? Number(live.low_52w) : stock.low52w,
    };
  });
}

function buildMeta(prices: StockPrice[], resData?: any[]): Map<string, PriceMeta> {
  const metaMap = new Map<string, PriceMeta>();
  prices.forEach((p, idx) => {
    const rawMeta = resData?.[idx]?._meta || {};
    metaMap.set(p.symbol, {
      source: p.source,
      delay_label: p.delay_label,
      discrepancy: !!p.discrepancy,
      updated_at: p.updated_at,
      cache_hit: !!rawMeta.cache_hit,
    });
  });
  return metaMap;
}

export function useStockPrices() {
  const [stocks, setStocks] = useState<Stock[]>(allStocks);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [liveSymbols, setLiveSymbols] = useState<Set<string>>(new Set());
  const [priceMeta, setPriceMeta] = useState<Map<string, PriceMeta>>(new Map());
  const [dataMode, setDataMode] = useState<string>("unknown");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshPrices = useCallback(async () => {
    try {
      const symbols = allStocks.slice(0, 10).map(s => s.symbol);
      const res = await apiClient.post<ApiResponse>("/api/market/quotes", { symbols });
      
      // Extract overall mode from response envelope
      setDataMode(res.mode || "unknown");
      
      if (res.data) {
        const prices: StockPrice[] = res.data.map((item: Record<string, unknown>) => {
          const itemMeta = (item._meta as Record<string, unknown>) || {};
          const price = Number(item.price) || 0;
          const prevClose = Number(item.previous_close) || 0;
          return {
            symbol: item.symbol as string,
            price,
            change: price - prevClose,
            change_percent: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
            volume: item.volume != null ? String(item.volume) : null,
            market_cap: item.market_cap != null ? String(item.market_cap) : null,
            pe: null,
            high_52w: null,
            low_52w: null,
            source: (item.source as string) || (itemMeta.source as string) || res.source || "unknown",
            delay_label: (item.delay_label as string) || (itemMeta.mode === "demo" ? "Demo Data" : "Unknown"),
            discrepancy: false,
            exchange: null,
            updated_at: (itemMeta.generated_at as string) || res.generated_at || new Date().toISOString(),
          };
        });

        setStocks(mergeStocks(allStocks, prices));
        setLiveSymbols(new Set(prices.map((p) => p.symbol)));
        setPriceMeta(buildMeta(prices, res.data));
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error("Failed to refresh prices:", e);
      setDataMode("disconnected");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPrices();

    // Auto-refresh every hour
    intervalRef.current = setInterval(() => {
      refreshPrices();
    }, 3600000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshPrices]);

  return { stocks, loading, lastUpdated, refreshPrices, liveSymbols, priceMeta, dataMode };
}
