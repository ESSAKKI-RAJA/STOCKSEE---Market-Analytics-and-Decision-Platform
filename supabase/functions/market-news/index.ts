import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const prompt = `You are a financial news aggregator. Today is ${today}. Generate exactly 4 real, current stock market news items. Return ONLY valid JSON array with this exact format, no markdown, no code fences:
[
  {"title":"...","desc":"...","category":"india","url":"https://economictimes.indiatimes.com/markets"},
  {"title":"...","desc":"...","category":"global","url":"https://www.reuters.com/markets/"},
  {"title":"...","desc":"...","category":"global","url":"https://www.bloomberg.com/markets"},
  {"title":"...","desc":"...","category":"usa","url":"https://www.cnbc.com/markets/"}
]
Rules:
- Item 1: Indian stock market news (BSE/NSE/NIFTY/SENSEX related)
- Item 2: Global market news (Asia/Europe/commodities)
- Item 3: Global market news (different region/topic from item 2)  
- Item 4: USA stock market news (S&P 500/NASDAQ/specific US stock)
- Each title must be under 60 chars, desc under 120 chars
- News should reflect realistic current market conditions
- URLs should link to the relevant section of major financial news sites`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "google/gemini-2.5-flash",
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Extract JSON from response (handle potential markdown fences)
    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    
    const news = JSON.parse(jsonStr);

    return new Response(JSON.stringify(news), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-news error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
