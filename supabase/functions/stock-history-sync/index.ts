// STOCK SEE — Sync up to 200 days of OHLCV history per symbol from Yahoo Finance.
// Used by stock-analysis to compute SMA-20/50/200 and RSI-14.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function toYahoo(symbol: string, exchange?: string): string {
  if (symbol.includes(".")) return symbol;
  if (exchange === "NSE" || exchange === "BSE") return `${symbol}.NS`;
  if (exchange === "LSE") return `${symbol}.L`;
  if (exchange === "TSE") return `${symbol}.T`;
  if (exchange === "HKEX") return `${symbol}.HK`;
  if (exchange === "XETRA") return `${symbol}.DE`;
  return symbol;
}

async function fetchHistory(symbol: string, exchange?: string) {
  const ySym = toYahoo(symbol, exchange);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ySym
  )}?interval=1d&range=1y`;
  const r = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!r.ok) return [];
  const d = await r.json();
  const result = d?.chart?.result?.[0];
  if (!result) return [];
  const ts: number[] = result.timestamp || [];
  const q = result.indicators?.quote?.[0] || {};
  const rows: any[] = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i],
      h = q.high?.[i],
      l = q.low?.[i],
      c = q.close?.[i],
      v = q.volume?.[i];
    if (o == null || c == null) continue;
    rows.push({
      symbol,
      date: new Date(ts[i] * 1000).toISOString().slice(0, 10),
      open: o,
      high: h,
      low: l,
      close: c,
      volume: v ?? null,
    });
  }
  return rows.slice(-200); // keep last 200 days
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const body = await req.json().catch(() => ({}));
    const symbols: { symbol: string; exchange?: string }[] = body.symbols || [];
    if (symbols.length === 0) {
      return new Response(JSON.stringify({ error: "symbols[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let totalRows = 0;
    for (const s of symbols.slice(0, 20)) {
      const rows = await fetchHistory(s.symbol, s.exchange);
      if (rows.length === 0) continue;
      const { error } = await supabase
        .from("stock_history")
        .upsert(rows, { onConflict: "symbol,date" });
      if (error) console.error("history upsert", s.symbol, error);
      else totalRows += rows.length;
      await new Promise((r) => setTimeout(r, 200));
    }

    return new Response(JSON.stringify({ symbols: symbols.length, rows: totalRows }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("history-sync", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
