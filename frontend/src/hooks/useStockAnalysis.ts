import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export interface StockDecisionData {
  symbol: string;
  signalLabel: string;
  confidence: string;
  riskLevel: string;
  bullishEvidence: string[];
  bearishEvidence: string[];
  conflicts: string[];
  scenarioProjection: string;
  mode: string;
  limitations: string[];
  cached: boolean;
  generatedAt: string;
}

export function useStockAnalysis(symbol: string | undefined, enabled = true) {
  const [data, setData] = useState<StockDecisionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol || !enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    apiClient.get<any>(`/api/report/${symbol}`)
      .then((res) => {
        if (cancelled) return;
        const reportData = res.data;
        
        // Parse final_analysis_summary
        const summary = (reportData.final_analysis_summary || "") as string;
        const parts = summary.split(" | ");
        
        let signalLabel = "Neutral / Wait";
        let confidence = "Low";
        let bullishEvidence: string[] = [];
        let bearishEvidence: string[] = [];
        let conflicts: string[] = [];
        
        const firstPart = parts[0] || "";
        const labelMatch = firstPart.match(/showing a (.*?) setup/);
        if (labelMatch) signalLabel = labelMatch[1];
        
        const confMatch = firstPart.match(/with (.*?) confidence/i);
        if (confMatch) confidence = confMatch[1];
        
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          if (part.startsWith("Bullish Evidence: ")) {
            bullishEvidence = part.replace("Bullish Evidence: ", "").split("; ").filter(Boolean);
          } else if (part.startsWith("Bearish Evidence: ")) {
            bearishEvidence = part.replace("Bearish Evidence: ", "").split("; ").filter(Boolean);
          } else if (part.startsWith("Key Conflicts Detected: ")) {
            conflicts = part.replace("Key Conflicts Detected: ", "").split("; ").filter(Boolean);
          }
        }
        
        // Parse risk factors
        const riskFactors = (reportData.risk_factors || []) as string[];
        let riskLevel = "UNKNOWN";
        const riskFlags = [];
        if (riskFactors.length > 0) {
            if (riskFactors[0].startsWith("Risk Level: ")) {
                riskLevel = riskFactors[0].replace("Risk Level: ", "").trim();
            }
        }

        const metaObj = reportData._meta || {};
        
        let limitationsArray: string[] = [];
        if (Array.isArray(reportData.limitations)) {
            limitationsArray = reportData.limitations;
        } else if (typeof reportData.limitations === "string") {
            limitationsArray = [reportData.limitations];
        }
        
        setData({
          symbol,
          signalLabel,
          confidence,
          riskLevel,
          bullishEvidence,
          bearishEvidence,
          conflicts,
          scenarioProjection: reportData.prediction_insight || "No scenario established.",
          mode: metaObj.mode || res.mode || "fallback",
          limitations: limitationsArray,
          cached: metaObj.cache_hit === true,
          generatedAt: metaObj.generated_at || res.generated_at || "",
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => !cancelled && setLoading(false));
      
    return () => {
      cancelled = true;
    };
  }, [symbol, enabled]);

  return { data, loading, error };
}
