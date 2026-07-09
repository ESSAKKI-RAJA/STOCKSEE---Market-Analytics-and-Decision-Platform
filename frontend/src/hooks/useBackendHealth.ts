import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

interface HealthStatus {
  connected: boolean;
  environment: string;
  finnhubConfigured: boolean;
  engines: Record<string, { engine: string; status: string; mode: string }>;
  generatedAt: string;
}

export function useBackendHealth() {
  const [health, setHealth] = useState<HealthStatus>({
    connected: false,
    environment: "unknown",
    finnhubConfigured: false,
    engines: {},
    generatedAt: "",
  });
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const res = await apiClient.get<Record<string, unknown>>("/health");
      setHealth({
        connected: true,
        environment: (res.environment as string) || "unknown",
        finnhubConfigured: (res.finnhub_configured as boolean) || false,
        engines: (res.engines as Record<string, { engine: string; status: string; mode: string }>) || {},
        generatedAt: (res.generated_at as string) || "",
      });
    } catch {
      setHealth((prev) => ({ ...prev, connected: false }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { health, loading, recheckHealth: checkHealth };
}
