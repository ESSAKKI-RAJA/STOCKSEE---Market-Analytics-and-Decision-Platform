import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type AlertType = "price_above" | "price_below" | "sma_crossover_bullish" | "sma_crossover_bearish";

export interface UserAlert {
  id: string;
  user_id: string;
  symbol: string;
  exchange: string;
  alert_type: AlertType;
  threshold: number | null;
  sma_fast: number | null;
  sma_slow: number | null;
  active: boolean;
  last_triggered_at: string | null;
  note: string | null;
  created_at: string;
}

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!user) {
      setAlerts([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("user_alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setAlerts(data as UserAlert[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (input: Omit<UserAlert, "id" | "user_id" | "created_at" | "last_triggered_at" | "active"> & { active?: boolean }) => {
    if (!user) {
      toast.error("Please sign in to create alerts");
      return null;
    }
    const { data, error } = await supabase
      .from("user_alerts")
      .insert({
        user_id: user.id,
        symbol: input.symbol,
        exchange: input.exchange,
        alert_type: input.alert_type,
        threshold: input.threshold,
        sma_fast: input.sma_fast,
        sma_slow: input.sma_slow,
        active: input.active ?? true,
        note: input.note,
      })
      .select()
      .single();
    if (error) {
      toast.error("Failed to create alert");
      return null;
    }
    setAlerts((prev) => [data as UserAlert, ...prev]);
    toast.success("Alert created");
    return data as UserAlert;
  };

  const toggleAlert = async (id: string, active: boolean) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)));
    await supabase.from("user_alerts").update({ active }).eq("id", id);
  };

  const deleteAlert = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("user_alerts").delete().eq("id", id);
    toast.success("Alert removed");
  };

  return { alerts, loading, createAlert, toggleAlert, deleteAlert, refresh: fetchAlerts };
}
