// STOCK SEE — Company profile resolver.
// Hybrid: returns curated profile if known, otherwise asks LLM (tool call → strict JSON), caches in DB.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Curated profiles for the most-traded names
const CURATED: Record<string, any> = {
  RELIANCE: {
    ceo: "Mukesh Ambani",
    founded: "1973",
    headquarters: "Mumbai, India",
    employees: "~389,000",
    executives: [
      { name: "Mukesh Ambani", role: "Chairman & MD" },
      { name: "Nita Ambani", role: "Director" },
      { name: "Akash Ambani", role: "Chairman, Reliance Jio" },
    ],
    segments: ["Oil-to-Chemicals", "Reliance Jio (Telecom)", "Reliance Retail", "Digital Services", "New Energy"],
    revenue_drivers: ["Jio subscriber growth", "Retail expansion", "Refining margins", "Petrochemicals"],
    industry_position: "India's largest private-sector company by revenue and market cap; dominant in energy, retail, and telecom.",
    global_presence: ["India HQ", "Operations in 100+ countries", "Crude exports to Europe & Asia"],
    summary: "Reliance is India's most diversified conglomerate, transitioning from a hydrocarbon giant into a digital-first retail and telecom powerhouse.",
  },
  TCS: {
    ceo: "K Krithivasan",
    founded: "1968",
    headquarters: "Mumbai, India",
    employees: "~601,000",
    executives: [
      { name: "K Krithivasan", role: "CEO & MD" },
      { name: "N Ganapathy Subramaniam", role: "COO" },
      { name: "Samir Seksaria", role: "CFO" },
    ],
    segments: ["BFSI Services", "Retail & CPG", "Communications & Media", "Manufacturing", "Life Sciences"],
    revenue_drivers: ["Large multi-year deals", "Cloud transformation", "AI/GenAI services", "BFSI modernization"],
    industry_position: "India's largest IT services exporter and a top-3 global IT services firm by market cap.",
    global_presence: ["46 countries", "150+ delivery centers", "North America = ~50% revenue"],
    summary: "TCS is the bellwether of Indian IT — known for execution discipline, deep client relationships, and consistent cash conversion.",
  },
  INFY: {
    ceo: "Salil Parekh",
    founded: "1981",
    headquarters: "Bengaluru, India",
    employees: "~317,000",
    executives: [
      { name: "Salil Parekh", role: "CEO & MD" },
      { name: "Jayesh Sanghrajka", role: "CFO" },
      { name: "Nandan Nilekani", role: "Co-founder & Chairman" },
    ],
    segments: ["Financial Services", "Retail", "Communications", "Energy & Utilities", "Manufacturing"],
    revenue_drivers: ["Digital transformation deals", "Cloud (Cobalt)", "AI (Topaz)", "Outsourcing renewals"],
    industry_position: "Second-largest Indian IT exporter; recognized for digital and consulting capabilities.",
    global_presence: ["56 countries", "Global delivery model", "Strong NA & EU footprint"],
    summary: "Infosys combines scale with a strong digital-first narrative, anchored by AI offerings and large-deal momentum.",
  },
  HDFCBANK: {
    ceo: "Sashidhar Jagdishan",
    founded: "1994",
    headquarters: "Mumbai, India",
    employees: "~213,000",
    executives: [
      { name: "Sashidhar Jagdishan", role: "MD & CEO" },
      { name: "Atanu Chakraborty", role: "Chairman" },
    ],
    segments: ["Retail Banking", "Wholesale Banking", "Treasury", "Insurance & AMC (subsidiaries)"],
    revenue_drivers: ["Retail loan book", "Net interest margin", "Digital onboarding", "Cross-sell"],
    industry_position: "India's largest private bank by assets and the most valuable bank in India.",
    global_presence: ["India + select GIFT City, Bahrain, Hong Kong branches"],
    summary: "HDFC Bank is the gold standard of Indian banking — known for asset quality, scale, and a deep retail franchise post-merger with HDFC Ltd.",
  },
  AAPL: {
    ceo: "Tim Cook",
    founded: "1976",
    headquarters: "Cupertino, CA, USA",
    employees: "~164,000",
    executives: [
      { name: "Tim Cook", role: "CEO" },
      { name: "Luca Maestri", role: "CFO" },
      { name: "Jeff Williams", role: "COO" },
    ],
    segments: ["iPhone", "Mac", "iPad", "Wearables & Home", "Services (App Store, iCloud, Apple Music)"],
    revenue_drivers: ["iPhone upgrade cycle", "Services growth (high margin)", "China demand", "Vision Pro / AR"],
    industry_position: "World's most valuable consumer technology company by market cap.",
    global_presence: ["175+ countries", "Apple Stores in 25+ countries", "Manufacturing across China, India, Vietnam"],
    summary: "Apple's premium hardware ecosystem fuels a high-margin services flywheel — the rare consumer-tech firm with both scale and pricing power.",
  },
  MSFT: {
    ceo: "Satya Nadella",
    founded: "1975",
    headquarters: "Redmond, WA, USA",
    employees: "~228,000",
    executives: [
      { name: "Satya Nadella", role: "Chairman & CEO" },
      { name: "Amy Hood", role: "CFO" },
      { name: "Brad Smith", role: "President" },
    ],
    segments: ["Productivity (Office 365)", "Intelligent Cloud (Azure)", "Personal Computing (Windows, Xbox)", "LinkedIn"],
    revenue_drivers: ["Azure cloud growth", "Microsoft 365 subscriptions", "Copilot AI monetization", "Gaming"],
    industry_position: "Top-2 hyperscale cloud provider and leading enterprise software vendor.",
    global_presence: ["190+ countries", "60+ Azure regions globally"],
    summary: "Microsoft's cloud + AI flywheel under Satya Nadella has made it the pace-setter for enterprise generative AI.",
  },
  GOOGL: {
    ceo: "Sundar Pichai",
    founded: "1998",
    headquarters: "Mountain View, CA, USA",
    employees: "~182,000",
    executives: [
      { name: "Sundar Pichai", role: "CEO of Alphabet & Google" },
      { name: "Ruth Porat", role: "President & CIO" },
    ],
    segments: ["Google Search & Ads", "YouTube Ads", "Google Cloud", "Subscriptions & Devices", "Other Bets"],
    revenue_drivers: ["Search advertising", "YouTube monetization", "Google Cloud growth", "Gemini AI"],
    industry_position: "Dominant in search & digital advertising; #3 hyperscale cloud provider.",
    global_presence: ["200+ countries", "Data centers across NA, EU, APAC, LATAM"],
    summary: "Alphabet pairs an advertising cash machine with rising cloud and AI franchises led by Gemini.",
  },
  TSLA: {
    ceo: "Elon Musk",
    founded: "2003",
    headquarters: "Austin, TX, USA",
    employees: "~140,000",
    executives: [
      { name: "Elon Musk", role: "CEO & Product Architect" },
      { name: "Vaibhav Taneja", role: "CFO" },
    ],
    segments: ["Automotive (Model 3/Y/S/X/Cybertruck)", "Energy Storage", "Solar", "Services & FSD"],
    revenue_drivers: ["EV deliveries", "Energy storage attach", "FSD software", "Regulatory credits"],
    industry_position: "World's most valuable EV maker and a leader in battery / energy storage.",
    global_presence: ["Gigafactories in USA, China, Germany; deliveries in 40+ countries"],
    summary: "Tesla's vertically integrated EV + energy + autonomy bet remains polarizing, but its margin recovery is the swing factor.",
  },
  NVDA: {
    ceo: "Jensen Huang",
    founded: "1993",
    headquarters: "Santa Clara, CA, USA",
    employees: "~29,600",
    executives: [
      { name: "Jensen Huang", role: "Founder, President & CEO" },
      { name: "Colette Kress", role: "CFO" },
    ],
    segments: ["Data Center (AI GPUs)", "Gaming", "Professional Visualization", "Automotive"],
    revenue_drivers: ["H100/H200/Blackwell sales", "CUDA ecosystem", "Networking (Mellanox)", "Sovereign AI deals"],
    industry_position: "The dominant supplier of AI training & inference accelerators worldwide.",
    global_presence: ["Operations in 30+ countries", "Sales globally with concentration in NA & APAC"],
    summary: "NVIDIA is the picks-and-shovels winner of the generative AI build-out, with CUDA as its software moat.",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symbol, name, exchange, sector } = await req.json();
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
      .from("company_profiles")
      .select("*")
      .eq("symbol", symbol)
      .maybeSingle();

    if (cached && Date.now() - new Date(cached.updated_at).getTime() < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ ...cached, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Curated path
    if (CURATED[symbol]) {
      const row = { symbol, source: "curated", ...CURATED[symbol], updated_at: new Date().toISOString() };
      await supabase.from("company_profiles").upsert(row, { onConflict: "symbol" });
      return new Response(JSON.stringify({ ...row, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AI fallback
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const llmResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a financial reference module. Return concise, factual company profile data. If unsure, return null fields rather than fabricating. Keep each list to 3-5 items.",
          },
          {
            role: "user",
            content: `Company profile for ${name || symbol} (${symbol} on ${exchange || "?"}, sector ${sector || "?"}). Call emit_profile.`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "emit_profile",
            description: "Return structured company profile.",
            parameters: {
              type: "object",
              properties: {
                ceo: { type: ["string", "null"] },
                founded: { type: ["string", "null"] },
                headquarters: { type: ["string", "null"] },
                employees: { type: ["string", "null"] },
                executives: { type: "array", items: { type: "object", properties: { name: { type: "string" }, role: { type: "string" } }, required: ["name", "role"], additionalProperties: false } },
                segments: { type: "array", items: { type: "string" } },
                revenue_drivers: { type: "array", items: { type: "string" } },
                industry_position: { type: ["string", "null"] },
                global_presence: { type: "array", items: { type: "string" } },
                summary: { type: ["string", "null"] },
              },
              required: ["ceo", "founded", "headquarters", "employees", "executives", "segments", "revenue_drivers", "industry_position", "global_presence", "summary"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "emit_profile" } },
      }),
    });

    if (!llmResp.ok) {
      const t = await llmResp.text();
      console.error("LLM error", llmResp.status, t);
      // Graceful fallback row
      const fallback = {
        symbol,
        source: "fallback",
        ceo: null,
        founded: null,
        headquarters: null,
        employees: null,
        executives: [],
        segments: sector ? [sector] : [],
        revenue_drivers: [],
        industry_position: name ? `${name} operates in the ${sector || "market"} sector.` : null,
        global_presence: [],
        summary: `Detailed profile data for ${name || symbol} is not yet available.`,
        updated_at: new Date().toISOString(),
      };
      await supabase.from("company_profiles").upsert(fallback, { onConflict: "symbol" });
      return new Response(JSON.stringify({ ...fallback, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const llmJson = await llmResp.json();
    const args = llmJson.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("No tool call");
    const parsed = JSON.parse(args);

    const row = {
      symbol,
      source: "ai",
      ...parsed,
      updated_at: new Date().toISOString(),
    };
    await supabase.from("company_profiles").upsert(row, { onConflict: "symbol" });

    return new Response(JSON.stringify({ ...row, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("company-profile error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
