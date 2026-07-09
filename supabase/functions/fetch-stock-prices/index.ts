import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map our symbols to Yahoo Finance tickers
function toYahooSymbol(symbol: string, exchange: string): string {
  if (exchange === "NSE" || exchange === "BSE") return `${symbol}.NS`;
  if (exchange === "LSE") return `${symbol}.L`;
  if (exchange === "TSE") return `${symbol}.T`;
  if (exchange === "HKEX") return `${symbol}.HK`;
  if (exchange === "XETRA") return `${symbol}.DE`;
  return symbol; // NASDAQ/NYSE use plain symbols
}

// Fetch single symbol from Yahoo Finance chart API (public, no auth needed)
async function fetchYahooChart(yahooSymbol: string): Promise<any | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });
    if (!resp.ok) {
      console.error(`Yahoo chart ${yahooSymbol} failed: ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta || {};
    const price = meta.regularMarketPrice || 0;
    const prevClose = meta.chartPreviousClose || meta.previousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;
    const volume = result.indicators?.quote?.[0]?.volume?.slice(-1)?.[0];
    return {
      price,
      change,
      changePercent,
      volume: formatVolume(volume || meta.regularMarketVolume),
      marketCap: "N/A",
      pe: null,
      high52w: meta.fiftyTwoWeekHigh || null,
      low52w: meta.fiftyTwoWeekLow || null,
    };
  } catch (e) {
    console.error(`Chart fetch error ${yahooSymbol}:`, e);
    return null;
  }
}

// Fetch with concurrency control
async function fetchYahooBatch(yahooSymbols: string[]): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  const concurrency = 8;
  for (let i = 0; i < yahooSymbols.length; i += concurrency) {
    const chunk = yahooSymbols.slice(i, i + concurrency);
    const settled = await Promise.all(chunk.map(s => fetchYahooChart(s).then(r => [s, r] as const)));
    for (const [sym, data] of settled) {
      if (data && data.price > 0) results[sym] = data;
    }
    if (i + concurrency < yahooSymbols.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  return results;
}

function formatVolume(vol: number | undefined): string {
  if (!vol) return "0";
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
  return vol.toString();
}

function formatMarketCap(cap: number | undefined): string {
  if (!cap) return "N/A";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(0)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`;
  return `$${cap}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request - optional symbols filter
    let requestedSymbols: { symbol: string; exchange: string }[] | null = null;
    try {
      const body = await req.json();
      if (body?.symbols && Array.isArray(body.symbols)) {
        requestedSymbols = body.symbols.slice(0, 100); // Max 100 at a time
      }
    } catch {
      // No body = fetch all from known symbols
    }

    // If no specific symbols requested, return cached prices
    if (!requestedSymbols) {
      const { data: cached } = await supabase
        .from("stock_prices")
        .select("*")
        .order("updated_at", { ascending: false });

      return new Response(JSON.stringify({ prices: cached || [], source: "cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert to Yahoo symbols
    const yahooMap: Record<string, string> = {};
    for (const s of requestedSymbols) {
      const yahoo = toYahooSymbol(s.symbol, s.exchange);
      yahooMap[yahoo] = s.symbol;
    }

    const yahooSymbols = Object.keys(yahooMap);
    const results = await fetchYahooBatch(yahooSymbols);

    // Upsert into stock_prices
    const upsertRows = [];
    for (const [yahooSym, originalSym] of Object.entries(yahooMap)) {
      const data = results[yahooSym];
      if (data && data.price > 0) {
        upsertRows.push({
          symbol: originalSym,
          price: data.price,
          change: data.change,
          change_percent: data.changePercent,
          volume: data.volume,
          market_cap: data.marketCap,
          pe: data.pe,
          high_52w: data.high52w,
          low_52w: data.low52w,
          updated_at: new Date().toISOString(),
        });
      }
    }

    if (upsertRows.length > 0) {
      const { error } = await supabase
        .from("stock_prices")
        .upsert(upsertRows, { onConflict: "symbol" });
      if (error) console.error("Upsert error:", error);
    }

    // Return fresh data
    const { data: freshData } = await supabase
      .from("stock_prices")
      .select("*");

    return new Response(JSON.stringify({ 
      prices: freshData || [], 
      fetched: upsertRows.length,
      source: "live" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-stock-prices error:", e);
    return new Response(JSON.stringify({ error: "Failed to fetch prices" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
