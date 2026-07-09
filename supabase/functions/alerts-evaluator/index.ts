import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  exchange: string;
  alert_type: "price_above" | "price_below" | "sma_crossover_bullish" | "sma_crossover_bearish";
  threshold: number | null;
  sma_fast: number | null;
  sma_slow: number | null;
  last_triggered_at: string | null;
}

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: alerts, error: alertsErr } = await supabase
      .from("user_alerts")
      .select("*")
      .eq("active", true);
    if (alertsErr) throw alertsErr;

    const symbols = [...new Set((alerts ?? []).map((a) => a.symbol))];
    if (symbols.length === 0) {
      return new Response(JSON.stringify({ evaluated: 0, triggered: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: prices } = await supabase
      .from("stock_prices")
      .select("symbol, price")
      .in("symbol", symbols);
    const priceMap = new Map((prices ?? []).map((p) => [p.symbol, Number(p.price)]));

    const notifications: Array<Record<string, unknown>> = [];
    const triggeredAlertIds: string[] = [];

    for (const alert of (alerts ?? []) as Alert[]) {
      const price = priceMap.get(alert.symbol);
      if (price === undefined || price <= 0) continue;

      // De-dupe: don't re-trigger within last 6 hours
      if (alert.last_triggered_at) {
        const sinceMs = Date.now() - new Date(alert.last_triggered_at).getTime();
        if (sinceMs < 6 * 3600_000) continue;
      }

      let triggered = false;
      let title = "";
      let message = "";

      if (alert.alert_type === "price_above" && alert.threshold !== null && price >= Number(alert.threshold)) {
        triggered = true;
        title = `${alert.symbol} crossed above ${alert.threshold}`;
        message = `${alert.symbol} is now at ${price.toFixed(2)}, above your threshold of ${alert.threshold}.`;
      } else if (alert.alert_type === "price_below" && alert.threshold !== null && price <= Number(alert.threshold)) {
        triggered = true;
        title = `${alert.symbol} dropped below ${alert.threshold}`;
        message = `${alert.symbol} is now at ${price.toFixed(2)}, below your threshold of ${alert.threshold}.`;
      } else if (
        alert.alert_type === "sma_crossover_bullish" || alert.alert_type === "sma_crossover_bearish"
      ) {
        const fast = alert.sma_fast ?? 20;
        const slow = alert.sma_slow ?? 50;
        const { data: hist } = await supabase
          .from("stock_history")
          .select("close, date")
          .eq("symbol", alert.symbol)
          .order("date", { ascending: true })
          .limit(slow + 5);
        if (!hist || hist.length < slow + 1) continue;

        const closes = hist.map((h) => Number(h.close));
        const fastNow = sma(closes, fast);
        const slowNow = sma(closes, slow);
        const fastPrev = sma(closes.slice(0, -1), fast);
        const slowPrev = sma(closes.slice(0, -1), slow);
        if (fastNow == null || slowNow == null || fastPrev == null || slowPrev == null) continue;

        if (alert.alert_type === "sma_crossover_bullish" && fastPrev <= slowPrev && fastNow > slowNow) {
          triggered = true;
          title = `${alert.symbol}: bullish SMA crossover`;
          message = `SMA-${fast} (${fastNow.toFixed(2)}) crossed above SMA-${slow} (${slowNow.toFixed(2)}). Often a bullish signal.`;
        } else if (alert.alert_type === "sma_crossover_bearish" && fastPrev >= slowPrev && fastNow < slowNow) {
          triggered = true;
          title = `${alert.symbol}: bearish SMA crossover`;
          message = `SMA-${fast} (${fastNow.toFixed(2)}) crossed below SMA-${slow} (${slowNow.toFixed(2)}). Often a bearish signal.`;
        }
      }

      if (triggered) {
        notifications.push({
          user_id: alert.user_id,
          alert_id: alert.id,
          symbol: alert.symbol,
          title,
          message,
          type: "alert",
        });
        triggeredAlertIds.push(alert.id);
      }
    }

    if (notifications.length > 0) {
      await supabase.from("notifications").insert(notifications);
      await supabase
        .from("user_alerts")
        .update({ last_triggered_at: new Date().toISOString() })
        .in("id", triggeredAlertIds);
    }

    return new Response(
      JSON.stringify({ evaluated: alerts?.length ?? 0, triggered: notifications.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("alerts-evaluator error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
