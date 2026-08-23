import { useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

export interface EssaiProvenance {
  price_source: string;
  price_timestamp: string;
  price_quality: string;
  analytics_quality: string;
}

export interface EssaiAnalysis {
  view: string;
  confidence_score: number;
  confidence_level: string;
  evidence_quality: string;
  summary: string;
  supporting_evidence: string[];
  contradicting_evidence: string[];
  risks: string[];
  watch_items: string[];
  company_context: string | null;
  data_provenance: EssaiProvenance;
  disclaimer: string;
  insufficient_reason?: string | null;
  _mode?: string;
  _generated_at?: string;
}

export interface EssaiAnswer {
  answer: string;
  evidence: string[];
  confidence_score: number;
  confidence_level: string;
  limitations: string;
  disclaimer: string;
  _mode?: string;
}

export interface EssaiComparison {
  comparison_summary: string;
  symbol_a: { symbol: string; view: string; confidence_score: number; key_evidence: string[] };
  symbol_b: { symbol: string; view: string; confidence_score: number; key_evidence: string[] };
  relative_assessment: string;
  data_quality_note: string;
  disclaimer: string;
}

interface ApiResponse<T> {
  status: string;
  symbol?: string;
  essai: T;
  disclaimer?: string;
}

export function useEssai() {
  const [analysis, setAnalysis] = useState<EssaiAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: EssaiAnswer; timestamp: string }[]
  >([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const [comparison, setComparison] = useState<EssaiComparison | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  const analyseSymbol = useCallback(async (symbol: string) => {
    setLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const res = await apiClient.get<ApiResponse<EssaiAnalysis>>(
        `/api/essai/analyse/${symbol.toUpperCase()}`
      );
      setAnalysis(res.essai);
    } catch (e: any) {
      setAnalysisError(e.message || "Failed to load ESSAI analysis");
    } finally {
      setLoadingAnalysis(false);
    }
  }, []);

  const askEssai = useCallback(
    async (symbol: string, question: string) => {
      setLoadingChat(true);
      try {
        const res = await apiClient.post<ApiResponse<EssaiAnswer>>("/api/essai/ask", {
          symbol: symbol.toUpperCase(),
          question,
        });
        setChatHistory((prev) => [
          ...prev,
          {
            question,
            answer: res.essai,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (e: any) {
        setChatHistory((prev) => [
          ...prev,
          {
            question,
            answer: {
              answer: "Unable to connect to ESSAI. Please check backend connectivity.",
              evidence: [],
              confidence_score: 0,
              confidence_level: "INSUFFICIENT",
              limitations: "Backend unreachable",
              disclaimer: "Analysis only. Not financial advice.",
              _mode: "error",
            },
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoadingChat(false);
      }
    },
    []
  );

  const compareSymbols = useCallback(async (symbolA: string, symbolB: string) => {
    setLoadingComparison(true);
    try {
      const res = await apiClient.post<ApiResponse<EssaiComparison>>("/api/essai/compare", {
        symbol_a: symbolA.toUpperCase(),
        symbol_b: symbolB.toUpperCase(),
      });
      setComparison(res.essai);
    } catch (e: any) {
      console.error("Comparison failed:", e);
    } finally {
      setLoadingComparison(false);
    }
  }, []);

  const clearChat = useCallback(() => setChatHistory([]), []);

  return {
    analysis,
    loadingAnalysis,
    analysisError,
    analyseSymbol,
    chatHistory,
    loadingChat,
    askEssai,
    clearChat,
    comparison,
    loadingComparison,
    compareSymbols,
  };
}
