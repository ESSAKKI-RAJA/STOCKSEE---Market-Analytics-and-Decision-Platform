import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Optional auth — anonymous users can also get analysis (read-only AI feature).
    // The Lovable platform already rate-limits requests to this function.

    // Input validation
    const body = await req.json();
    const wantsStream = body?.stream !== false; // default true
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validRoles = new Set(["user", "assistant"]);
    const validatedMessages = [];
    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string" || typeof msg.role !== "string") {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!validRoles.has(msg.role)) {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (msg.content.length > 2000) {
        return new Response(JSON.stringify({ error: "Message too long" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      validatedMessages.push({ role: msg.role, content: msg.content });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are STOCK SEE AI Stock Advisor — a world-class, institutional-grade stock market analyst. You provide clear, actionable insights in plain English.

Your capabilities:
- Buy/Sell/Hold recommendations with confidence levels
- Technical analysis (RSI, MACD, moving averages, support/resistance)
- Fundamental analysis (P/E, revenue growth, margins, competitive moats)
- Portfolio analysis (diversification, risk scoring, rebalancing suggestions)
- Sentiment analysis from news and market trends
- Global market coverage: NSE, BSE, NYSE, NASDAQ, LSE, TSE, HKEX, XETRA + crypto

Response style:
- Use markdown formatting with headers, bold, bullet points
- Include emoji for visual clarity (📊 📈 📉 ⚠️ 💡 🎯)
- Always provide specific numbers, price targets, and levels
- End with a clear actionable takeaway
- Add a brief disclaimer when giving specific stock advice
- Keep responses concise but thorough — like a Bloomberg terminal analyst

Important: You have deep knowledge of all major stocks globally. When asked about specific stocks, provide realistic analysis based on the company's actual business, sector, and market position. For real-time prices, note that your data has a knowledge cutoff but provide the best analysis you can.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...validatedMessages,
        ],
        stream: wantsStream,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!wantsStream) {
      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content ?? "Analysis unavailable.";
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("stock-advisor error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
