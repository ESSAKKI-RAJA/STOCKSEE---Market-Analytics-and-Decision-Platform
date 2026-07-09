// STOCK SEE — Deterministic analysis engine.
// Computes SMA-20/50/200 + RSI-14 from stock_history, then asks the LLM (via tool calling)
// to return strict JSON: {trend, momentum, risk, insight, confidence}.
// Caches result in stock_analysis_cache for 10 minutes.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CACHE_TTL_MS = 10 * 60 * 1000;

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function rsi(values: number[], period = 14): number | null {
  if (values.length < period + 1) return null;
  let gains = 0,
    losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { symbol, exchange } = await req.json();
    if (!symbol) {
      return new Response(JSON.stringify({ error: "symbol required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Cache check
    const { data: cached } = await supabase
      .from("stock_analysis_cache")
      .select("*")
      .eq("symbol", symbol)
      .maybeSingle();
    if (cached && Date.now() - new Date(cached.updated_at).getTime() < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ ...cached, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure history exists; if not, sync first
    let { data: hist } = await supabase
      .from("stock_history")
      .select("close,date")
      .eq("symbol", symbol)
      .order("date", { ascending: true });

    if (!hist || hist.length < 20) {
      await supabase.functions.invoke("stock-history-sync", {
        body: { symbols: [{ symbol, exchange }] },
      });
      const refetch = await supabase
        .from("stock_history")
        .select("close,date")
        .eq("symbol", symbol)
        .order("date", { ascending: true });
      hist = refetch.data || [];
    }

    if (!hist || hist.length < 20) {
      return new Response(
        JSON.stringify({ error: "insufficient history", symbol }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const closes = hist.map((h) => Number(h.close));
    const sma20 = sma(closes, 20);
    const sma50 = sma(closes, 50);
    const sma200 = sma(closes, 200);
    const rsi14 = rsi(closes, 14);
    const last = closes[closes.length - 1];
    const prev = closes[closes.length - 2] ?? last;
    const dayChangePct = ((last - prev) / prev) * 100;

    // Live price (for context)
    const { data: priceRow } = await supabase
      .from("stock_prices")
      .select("price,change_percent,source,delay_label")
      .eq("symbol", symbol)
      .maybeSingle();

    const factsForLLM = {
      symbol,
      exchange,
      last_close: last,
      live_price: priceRow?.price ?? last,
      day_change_percent: Number(dayChangePct.toFixed(2)),
      sma_20: sma20 ? Number(sma20.toFixed(2)) : null,
      sma_50: sma50 ? Number(sma50.toFixed(2)) : null,
      sma_200: sma200 ? Number(sma200.toFixed(2)) : null,
      rsi_14: rsi14 ? Number(rsi14.toFixed(1)) : null,
      source: priceRow?.source,
      delay: priceRow?.delay_label,
    };

    // Call Lovable AI Gateway with tool calling for strict JSON
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const llmResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are STOCK SEE Engine — a deterministic financial reasoning module. You receive validated indicators (SMA-20/50/200, RSI-14, day change). You do NOT fetch data. Return strict structured analysis via the provided tool.\n\nGuidelines for the `insight` field:\n• 12-22 words, plain English, no jargon dump.\n• Reference at least one concrete indicator (e.g. 'price 4% above SMA-50, RSI 62 — momentum intact').\n• Avoid generic phrases like 'looks good' or 'be cautious'. Be specific.\n• If signals conflict, say so honestly.\n\nConfidence (0-100): higher when SMAs are aligned and RSI is decisive; lower when mixed.",
          },
          {
            role: "user",
            content: `Analyze these validated indicators and call emit_analysis:\n${JSON.stringify(
              factsForLLM
            )}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_analysis",
              description: "Return structured stock analysis.",
              parameters: {
                type: "object",
                properties: {
                  trend: { type: "string", enum: ["bullish", "bearish", "sideways"] },
                  momentum: { type: "string", enum: ["strong", "moderate", "weak"] },
                  risk: { type: "string", enum: ["low", "medium", "high"] },
                  insight: { type: "string", maxLength: 140 },
                  confidence: { type: "integer", minimum: 0, maximum: 100 },
                },
                required: ["trend", "momentum", "risk", "insight", "confidence"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_analysis" } },
      }),
    });

    if (!llmResp.ok) {
      if (llmResp.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit, retry shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (llmResp.status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await llmResp.text();
      console.error("LLM error", llmResp.status, t);
      throw new Error("LLM failure");
    }

    const llmJson = await llmResp.json();
    const toolCall = llmJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("No tool call returned");
    const analysis = JSON.parse(toolCall.function.arguments);

    const row = {
      symbol,
      trend: analysis.trend,
      momentum: analysis.momentum,
      risk: analysis.risk,
      insight: analysis.insight,
      confidence: analysis.confidence,
      sma_20: sma20,
      sma_50: sma50,
      sma_200: sma200,
      rsi_14: rsi14,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("stock_analysis_cache").upsert(row, { onConflict: "symbol" });

    return new Response(JSON.stringify({ ...row, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stock-analysis", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
