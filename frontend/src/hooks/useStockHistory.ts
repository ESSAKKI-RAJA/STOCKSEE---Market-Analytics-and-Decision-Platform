import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/apiClient";

export interface OHLCVRow {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close?: number;
}

export interface HistoryData {
  rows: OHLCVRow[];
  period: string;
  data_points: number;
  source: string;
  mode: string;
}

interface ApiResponse {
  status: string;
  mode: string;
  source: string;
  data: HistoryData;
  limitations?: string;
}

type CacheKey = string; // `${symbol}__${period}`

export function useStockHistory() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Map<CacheKey, HistoryData>>(new Map());

  const fetchHistory = useCallback(async (symbol: string, period: string = "1mo") => {
    const key: CacheKey = `${symbol.toUpperCase()}__${period}`;

    // Return cache hit immediately
    const cached = cache.current.get(key);
    if (cached) {
      setData(cached);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<ApiResponse>(
        `/api/market/history/${symbol.toUpperCase()}?period=${period}`
      );
      const histData: HistoryData = {
        rows: (res.data?.rows || []) as OHLCVRow[],
        period: res.data?.period || period,
        data_points: res.data?.data_points || 0,
        source: res.data?.source || res.source || "unknown",
        mode: res.data?.mode || res.mode || "unknown",
      };
      cache.current.set(key, histData);
      setData(histData);
    } catch (e: any) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchHistory };
}
