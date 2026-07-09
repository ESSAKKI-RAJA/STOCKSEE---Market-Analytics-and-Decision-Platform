// STOCK SEE — Multi-source price orchestrator.
// Detects exchange from ticker, routes to Twelve Data first, falls back to Yahoo Finance.
// Validates across both when possible (picks freshest, flags >1% discrepancies).
// Caches in stock_prices (10-min TTL) to absorb traffic and respect rate limits.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TD_KEY = Deno.env.get("TWELVE_DATA_API_KEY") || "";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

type Quote = {
  symbol: string;
  exchange: string;
  price: number;
  change: number;
  change_percent: number;
  volume: string | null;
  market_cap: string | null;
  pe: number | null;
  high_52w: number | null;
  low_52w: number | null;
  source: string;
  delay_label: string;
  discrepancy: boolean;
  ts: number; // ms
};

// ---------- Exchange detection ----------
function detectExchange(symbol: string, hint?: string): string {
  if (hint) return hint;
  if (symbol.endsWith(".NS")) return "NSE";
  if (symbol.endsWith(".BO")) return "BSE";
  if (symbol.endsWith(".L")) return "LSE";
  if (symbol.endsWith(".T")) return "TSE";
  if (symbol.endsWith(".HK")) return "HKEX";
  if (symbol.endsWith(".DE")) return "XETRA";
  return "NASDAQ";
}

function toYahoo(symbol: string, exchange: string): string {
  if (symbol.includes(".")) return symbol;
  if (exchange === "NSE" || exchange === "BSE") return `${symbol}.NS`;
  if (exchange === "LSE") return `${symbol}.L`;
  if (exchange === "TSE") return `${symbol}.T`;
  if (exchange === "HKEX") return `${symbol}.HK`;
  if (exchange === "XETRA") return `${symbol}.DE`;
  return symbol;
}

function toTwelveData(symbol: string, exchange: string): string {
  const base = symbol.replace(/\.(NS|BO|L|T|HK|DE)$/i, "");
  if (exchange === "NSE") return `${base}:NSE`;
  if (exchange === "BSE") return `${base}:BSE`;
  if (exchange === "LSE") return `${base}:LSE`;
  if (exchange === "XETRA") return `${base}:XETR`;
  return base;
}

function fmtVol(v: number | undefined | null): string {
  if (!v) return "0";
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return String(v);
}

// ---------- Twelve Data ----------
async function fetchTwelveData(symbol: string, exchange: string): Promise<Quote | null> {
  if (!TD_KEY) return null;
  try {
    const tdSym = toTwelveData(symbol, exchange);
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(tdSym)}&apikey=${TD_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    if (d.status === "error" || !d.close) return null;
    const price = parseFloat(d.close);
    const prev = parseFloat(d.previous_close ?? d.close);
    const change = price - prev;
    const pct = prev ? (change / prev) * 100 : 0;
    return {
      symbol,
      exchange,
      price,
      change,
      change_percent: pct,
      volume: fmtVol(parseInt(d.volume ?? "0")),
      market_cap: null,
      pe: null,
      high_52w: d.fifty_two_week?.high ? parseFloat(d.fifty_two_week.high) : null,
      low_52w: d.fifty_two_week?.low ? parseFloat(d.fifty_two_week.low) : null,
      source: "twelve_data",
      delay_label: "~15 sec delay",
      discrepancy: false,
      ts: d.timestamp ? d.timestamp * 1000 : Date.now(),
    };
  } catch (e) {
    console.error("TD error", symbol, e);
    return null;
  }
}

// ---------- Yahoo Finance ----------
async function fetchYahoo(symbol: string, exchange: string): Promise<Quote | null> {
  try {
    const ySym = toYahoo(symbol, exchange);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySym)}?interval=1d&range=1d`;
    const r = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!r.ok) return null;
    const d = await r.json();
    const result = d?.chart?.result?.[0];
    if (!result) return null;
    const m = result.meta || {};
    const price = m.regularMarketPrice || 0;
    if (!price) return null;
    const prev = m.chartPreviousClose || m.previousClose || price;
    const change = price - prev;
    const pct = prev ? (change / prev) * 100 : 0;
    return {
      symbol,
      exchange,
      price,
      change,
      change_percent: pct,
      volume: fmtVol(m.regularMarketVolume),
      market_cap: null,
      pe: null,
      high_52w: m.fiftyTwoWeekHigh || null,
      low_52w: m.fiftyTwoWeekLow || null,
      source: "yahoo",
      delay_label: "~15 min delay",
      discrepancy: false,
      ts: (m.regularMarketTime ?? Math.floor(Date.now() / 1000)) * 1000,
    };
  } catch (e) {
    console.error("Yahoo error", symbol, e);
    return null;
  }
}

// ---------- Multi-source pick ----------
async function getQuote(symbol: string, exchangeHint?: string): Promise<Quote | null> {
  const exchange = detectExchange(symbol, exchangeHint);
  const [td, yh] = await Promise.all([fetchTwelveData(symbol, exchange), fetchYahoo(symbol, exchange)]);
  if (!td && !yh) return null;
  if (td && !yh) return td;
  if (!td && yh) return yh;
  // Both present — pick freshest, flag >1% discrepancy
  const a = td!;
  const b = yh!;
  const diffPct = Math.abs(a.price - b.price) / Math.max(a.price, b.price);
  const discrepancy = diffPct > 0.01;
  const fresher = a.ts >= b.ts ? a : b;
  return { ...fresher, discrepancy };
}

// ---------- HTTP ----------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let body: { symbols?: { symbol: string; exchange?: string }[]; force?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      // ignore
    }

    // No symbols → return cached
    if (!body.symbols || body.symbols.length === 0) {
      const { data } = await supabase.from("stock_prices").select("*");
      return new Response(JSON.stringify({ prices: data || [], source: "cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const symbols = body.symbols.slice(0, 100);

    // Check cache freshness per symbol unless force
    const symList = symbols.map((s) => s.symbol);
    const { data: cached } = await supabase
      .from("stock_prices")
      .select("*")
      .in("symbol", symList);
    const cachedMap = new Map((cached || []).map((c) => [c.symbol, c]));

    const toFetch: { symbol: string; exchange?: string }[] = [];
    const now = Date.now();
    for (const s of symbols) {
      const c = cachedMap.get(s.symbol);
      const fresh = c && now - new Date(c.updated_at).getTime() < CACHE_TTL_MS;
      if (body.force || !fresh) toFetch.push(s);
    }

    // Concurrency 6
    const results: Quote[] = [];
    const conc = 6;
    for (let i = 0; i < toFetch.length; i += conc) {
      const chunk = toFetch.slice(i, i + conc);
      const got = await Promise.all(chunk.map((s) => getQuote(s.symbol, s.exchange)));
      for (const q of got) if (q) results.push(q);
      if (i + conc < toFetch.length) await new Promise((r) => setTimeout(r, 150));
    }

    if (results.length > 0) {
      const rows = results.map((q) => ({
        symbol: q.symbol,
        price: q.price,
        change: q.change,
        change_percent: q.change_percent,
        volume: q.volume,
        market_cap: q.market_cap,
        pe: q.pe,
        high_52w: q.high_52w,
        low_52w: q.low_52w,
        source: q.source,
        delay_label: q.delay_label,
        exchange: q.exchange,
        discrepancy: q.discrepancy,
        updated_at: new Date(q.ts).toISOString(),
      }));
      const { error } = await supabase
        .from("stock_prices")
        .upsert(rows, { onConflict: "symbol" });
      if (error) console.error("upsert error", error);
    }

    const { data: fresh } = await supabase
      .from("stock_prices")
      .select("*")
      .in("symbol", symList);

    return new Response(
      JSON.stringify({
        prices: fresh || [],
        fetched: results.length,
        cached: symbols.length - toFetch.length,
        source: "orchestrator",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("orchestrator error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
