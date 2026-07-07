import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export interface StockAnalysis {
  symbol: string;
  trend: "bullish" | "bearish" | "sideways" | "Neutral" | "Bullish" | "Bearish";
  momentum: "strong" | "moderate" | "weak";
  risk: "low" | "medium" | "high";
  insight: string;
  confidence: number | string;
  sma_20: number | null;
  sma_50: number | null;
  sma_200: number | null;
  rsi_14: number | null;
  cached?: boolean;
  // New transparency fields
  mode?: string;
  source?: string;
  generatedAt?: string;
  limitations?: string;
}

interface ApiResponse {
  status: string;
  mode: string;
  source: string;
  message: string;
  data: Record<string, unknown>;
  limitations?: string;
  generated_at?: string;
}

export function useStockAnalysis(symbol: string | undefined, exchange?: string, enabled = true) {
  const [data, setData] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol || !enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    apiClient.get<ApiResponse>(`/api/report/${symbol}`)
      .then((res) => {
        if (cancelled) return;
        const reportData = res.data;
        const techAnalysis = reportData.technical_analysis as string | undefined;
        const metaObj = reportData._meta as Record<string, unknown> | undefined;
        // Map backend report to expected frontend format
        setData({
          symbol,
          trend: techAnalysis?.includes("Bullish") ? "bullish" : techAnalysis?.includes("Bearish") ? "bearish" : "sideways",
          momentum: "moderate",
          risk: "medium",
          insight: (reportData.final_analysis_summary as string) || (reportData.company_summary as string) || "",
          confidence: metaObj?.mode === "real" ? 75 : 40,
          sma_20: null,
          sma_50: null,
          sma_200: null,
          rsi_14: null,
          // Propagate transparency metadata
          mode: res.mode,
          source: res.source,
          generatedAt: res.generated_at,
          limitations: res.limitations ?? undefined,
          cached: metaObj?.cache_hit === true,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => !cancelled && setLoading(false));
      
    return () => {
      cancelled = true;
    };
  }, [symbol, exchange, enabled]);

  return { data, loading, error };
}
