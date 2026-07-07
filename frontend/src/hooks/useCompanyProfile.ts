import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

interface ApiResponse {
  status: string;
  mode: string;
  source: string;
  message: string;
  data: Record<string, unknown>;
}

export interface Executive { name: string; role: string }
export interface CompanyProfile {
  symbol: string;
  ceo: string | null;
  founded: string | null;
  headquarters: string | null;
  employees: string | null;
  executives: Executive[];
  segments: string[];
  revenue_drivers: string[];
  industry_position: string | null;
  global_presence: string[];
  summary: string | null;
  source: string;
  cached?: boolean;
}

export function useCompanyProfile(symbol?: string, name?: string, exchange?: string, sector?: string) {
  const [data, setData] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    apiClient.get<ApiResponse>(`/api/company/${symbol}`)
      .then((res) => {
        if (cancelled) return;
        const profileData = res.data;
        setData({
          symbol: (profileData.symbol as string) || symbol,
          ceo: null,
          founded: null,
          headquarters: null,
          employees: null,
          executives: [],
          segments: [(profileData.sector as string) || sector || "General"],
          revenue_drivers: [],
          industry_position: null,
          global_presence: [],
          summary: profileData.name as string,
          source: res.mode,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => !cancelled && setLoading(false));
      
    return () => { cancelled = true };
  }, [symbol, name, exchange, sector]);

  return { data, loading, error };
}
