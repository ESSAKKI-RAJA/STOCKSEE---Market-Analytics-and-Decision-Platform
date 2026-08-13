import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { StockDecisionData } from "./useStockAnalysis";

export interface DecisionState {
  symbol: string;
  signalLabel: string;
  confidence: string;
  riskLevel: string;
  mode: string;
  bullishEvidence: string[];
  bearishEvidence: string[];
  conflicts: string[];
  scenarioProjection: string;
}

export interface MonitoredStock {
  symbol: string;
  currentState: DecisionState;
  previousState: DecisionState | null;
  status: "NEEDS_ATTENTION" | "CHANGED" | "STABLE" | "NEW";
  changeExplanation: string | null;
}

const STORAGE_KEY = "stocksee_watchlist_state";

export function useWatchlistMonitoring(symbols: string[]) {
  const [monitoredStocks, setMonitoredStocks] = useState<MonitoredStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbols || symbols.length === 0) {
      setMonitoredStocks([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient.post<any>("/api/report/batch", { symbols })
      .then((res) => {
        if (cancelled) return;
        const batchData = res.data || {};
        
        // Load previous state
        let previousStateMap: Record<string, DecisionState> = {};
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            previousStateMap = JSON.parse(stored);
          }
        } catch (e) {
          console.error("Failed to parse local watchlist state", e);
        }

        const newStateMap: Record<string, DecisionState> = {};
        const parsedStocks: MonitoredStock[] = [];

        for (const sym of symbols) {
          const reportData = batchData[sym];
          if (!reportData) continue;

          // Parse new state using the same logic as DecisionSnapshot
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
          
          const riskFactors = (reportData.risk_factors || []) as string[];
          let riskLevel = "UNKNOWN";
          if (riskFactors.length > 0 && riskFactors[0].startsWith("Risk Level: ")) {
              riskLevel = riskFactors[0].replace("Risk Level: ", "").trim();
          }

          const metaObj = reportData._meta || {};
          const currentState: DecisionState = {
            symbol: sym,
            signalLabel,
            confidence,
            riskLevel,
            mode: metaObj.mode || "fallback",
            bullishEvidence,
            bearishEvidence,
            conflicts,
            scenarioProjection: reportData.prediction_insight || "No scenario established."
          };

          newStateMap[sym] = currentState;

          const prevState = previousStateMap[sym];
          let status: MonitoredStock["status"] = "STABLE";
          let changeExplanation: string | null = null;

          if (!prevState) {
            status = "NEW";
            changeExplanation = "Newly added to monitoring.";
          } else {
            // Material Change Detection Rules
            
            const signalChanged = currentState.signalLabel !== prevState.signalLabel;
            const riskChanged = currentState.riskLevel !== prevState.riskLevel;
            const confidenceChanged = currentState.confidence !== prevState.confidence;

            const isNegativeSignalShift = 
                (prevState.signalLabel.toLowerCase().includes("bullish") && !currentState.signalLabel.toLowerCase().includes("bullish")) ||
                (!prevState.signalLabel.toLowerCase().includes("bearish") && currentState.signalLabel.toLowerCase().includes("bearish"));
            
            const isRiskEscalation = 
                (prevState.riskLevel === "LOW" && currentState.riskLevel !== "LOW") ||
                (prevState.riskLevel === "ELEVATED" && currentState.riskLevel === "HIGH");

            const isConfidenceDrop = 
                (prevState.confidence === "High" && currentState.confidence !== "High") ||
                (prevState.confidence === "Moderate" && currentState.confidence === "Low");
            
            const newConflict = currentState.conflicts.length > prevState.conflicts.length;
            
            if (isNegativeSignalShift || isRiskEscalation || isConfidenceDrop || newConflict) {
                status = "NEEDS_ATTENTION";
                const reasons = [];
                if (isNegativeSignalShift) reasons.push(`Signal shifted from ${prevState.signalLabel} to ${currentState.signalLabel}`);
                if (isRiskEscalation) reasons.push(`Risk escalated from ${prevState.riskLevel} to ${currentState.riskLevel}`);
                if (isConfidenceDrop) reasons.push(`Confidence dropped from ${prevState.confidence} to ${currentState.confidence}`);
                if (newConflict) reasons.push(`New analytical conflicts detected`);
                changeExplanation = reasons.join(". ");
            } else if (signalChanged || riskChanged || confidenceChanged) {
                status = "CHANGED";
                const reasons = [];
                if (signalChanged) reasons.push(`Signal shifted to ${currentState.signalLabel}`);
                if (riskChanged) reasons.push(`Risk changed to ${currentState.riskLevel}`);
                if (confidenceChanged) reasons.push(`Confidence changed to ${currentState.confidence}`);
                changeExplanation = reasons.join(". ");
            }
          }

          parsedStocks.push({
            symbol: sym,
            currentState,
            previousState: prevState || null,
            status,
            changeExplanation
          });
        }

        setMonitoredStocks(parsedStocks);
        
        // Persist new state
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({...previousStateMap, ...newStateMap}));
        } catch(e) {}

      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(symbols)]);

  return { monitoredStocks, loading, error };
}
