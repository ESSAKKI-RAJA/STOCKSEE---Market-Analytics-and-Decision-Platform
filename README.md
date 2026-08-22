# STOCKSEE

> An AI-driven market intelligence and decision-support platform that transforms market data, technical signals, company information, news, and sentiment into structured investment intelligence.

**Production Status:** 
🟢 Frontend deployed (Vercel)
🟢 Backend deployed (Render)
🟢 PostgreSQL connected (Supabase)
🟢 Authentication configured (Clerk)

### Live Application
**Frontend (Vercel):** [https://stocksee-market-analytics-and-decis.vercel.app/](https://stocksee-market-analytics-and-decis.vercel.app/)  
**Backend API (Render):** [https://stocksee-market-analytics-and-decision.onrender.com](https://stocksee-market-analytics-and-decision.onrender.com)  

**Contributor:** Essakki Raja T

---

## The Problem

Modern investors often have to move across multiple disjointed sources to understand price behavior, technical signals, company fundamentals, market conditions, breaking news, and sentiment. 

This fragmented information creates significant cognitive and analytical overhead. When an asset's price drops, an investor must manually correlate the price action with technical momentum, sift through unstructured news, evaluate sentiment shifts, and determine their risk exposure.

**STOCKSEE's Approach:**

```text
UNSTRUCTURED MARKET INFORMATION
        ↓
DATA COLLECTION (yfinance, Finnhub)
        ↓
NORMALIZATION (FastAPI)
        ↓
ANALYTICS (Pandas, VADER)
        ↓
INTELLIGENCE CORE (Signal Synthesis)
        ↓
DECISION SUPPORT (React SPA)
```

By unifying these pipelines, STOCKSEE provides a structured decision-support experience.

---

## Core Product Capabilities

| Intelligence Layer | Capability | What it provides |
|---|---|---|
| **Market Intelligence** | Real-time / EOD Data | Live OHLCV quotes and historical price action via yfinance. |
| **Technical Intelligence**| Momentum & Trend | Calculates SMA, MACD, and RSI to identify trend extensions and reversals. |
| **News Intelligence** | Article Retrieval | Aggregates and normalizes market-moving news via Finnhub. |
| **Sentiment Intelligence**| NLP Scoring | Uses VADER to assess the polarity and compound sentiment of news flows. |
| **Risk Intelligence** | Conflict Detection | Automatically flags logical contradictions between price momentum and sentiment. |
| **Decision Support** | Signal Synthesis | Produces deterministic, evidence-backed labels (e.g. *Bullish Setup*, *Risk Elevated*). |

---

## The STOCKSEE Intelligence Model

STOCKSEE is designed as an intelligence pipeline rather than a simple screener. It combines multiple evidence layers into a single synthesized signal.

```text
MARKET DATA (OHLCV)
    +
TECHNICAL SIGNALS (SMA, RSI, MACD)
    +
NEWS (Finnhub Articles)
    +
SENTIMENT (VADER NLP)
    +
RISK SIGNALS (Volatility, Signal Conflicts)
    ↓
STOCKSEE INTELLIGENCE CORE
    ↓
STRUCTURED MARKET INSIGHT
    ↓
DECISION SUPPORT
```

Rather than predicting the market with arbitrary percentages, STOCKSEE aggregates evidence, synthesizes market context, and provides **risk-aware decision support**.

---

## Technical Analysis

STOCKSEE computes indicators natively using Pandas directly from raw historical closes. 

### Simple Moving Averages (SMA 20, 50)
Identifies short-term and medium-term directional trends. STOCKSEE evaluates SMA crossovers to determine bullish or bearish momentum.

### Relative Strength Index (RSI)
Measures the speed and change of price movements. STOCKSEE flags RSI extensions (>70 Overbought, <30 Oversold) to identify exhaustion risk or potential bounces.

### MACD (Moving Average Convergence Divergence)
Used to assess trend momentum. STOCKSEE analyzes the MACD histogram to detect underlying momentum strengthening or weakening.

### Volatility & Trend
Calculates historical standard deviation and flags elevated risk environments when asset volatility exceeds baseline thresholds.

---

## News & Sentiment Intelligence

Sentiment alone is insufficient without market context. STOCKSEE contextualizes natural language processing alongside market data:

```text
News Sources (Finnhub API)
   ↓
Article Retrieval & Normalization
   ↓
Processing (Headline + Summary Extraction)
   ↓
Sentiment Analysis (VADER Polarity Scores)
   ↓
Market Context (Conflict Detection)
   ↓
Intelligence Layer
```

STOCKSEE flags when technicals contradict sentiment (e.g., *Trend is bullish, but recent news sentiment is negative*).

---

## Decision Support

STOCKSEE moves beyond raw charts to answer: *"What does the available evidence mean?"*

- **Signal Synthesis:** Generates deterministic labels like *Bullish Setup*, *Bearish Setup*, *Neutral / Wait*, or *Risk Elevated* based on strict evidence rules.
- **Conflict Detection:** Warns users when technical momentum diverges from news sentiment.
- **Watchlists:** Allows authenticated users to save, persist, and monitor assets of interest.
- **Market Overview:** High-level dashboards, heatmaps, and screeners to surface actionable setups.

---

## User Experience

1. **Authenticate:** Secure login via Clerk authentication.
2. **Explore:** Discover market intelligence via Heatmaps and Screeners.
3. **Analyze:** Select a specific security to dive deep into Stock Detail and Analysis views.
4. **Evaluate:** Review technical signals, company context, and recent news sentiment.
5. **Decide:** Use the Intelligence Core's synthesized signals and risk flags to formulate a decision.
6. **Monitor:** Save the asset to a personalized, persistent Watchlist.

---

## Security & User Isolation

STOCKSEE is built with a modern, strict authorization boundary:

- **Authentication:** Handled entirely by **Clerk** (Email/Password & Social Logins).
- **Authorization:** Handled by **FastAPI** using `PyJWT` to verify Clerk JWKS (RS256).
- **User Isolation:** All personalized resources (Watchlists, Preferences, Portfolios) are strictly tied to the Clerk User ID.
- **Database:** Supabase PostgreSQL is accessed via SQLAlchemy. Environment variables securely manage the `DATABASE_URL` pooling connection.
- **CORS:** Render backend strictly enforces allowed origins matching the Vercel production URL.

---

## Technical Architecture

```text
       React + Vite Frontend (Vercel)
                     │
                     ▼
             Clerk Authentication
                     │
                     ▼
         FastAPI Backend API (Render)
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
Intelligence Services          PostgreSQL
 (Pandas, VADER)               (Supabase)
       │
 ┌─────┼──────────┐
 ▼     ▼          ▼
Market Data     News
(yfinance)    (Finnhub)
```

### Stack Details
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend:** Python, FastAPI, SQLAlchemy, Alembic, Pandas, VADER.
- **Database:** Supabase PostgreSQL.
- **Deployment:** Vercel (Frontend), Render (Backend).

---

## Database Architecture

The system utilizes 13 application tables managed via Alembic migrations.

**Key Entities:**
- **Users:** `User`, `UserPreference`, `UserPortfolio`
- **Market & Tech:** `CompanyProfile`, `OHLCVCache`, `TechnicalIndicator`
- **Intelligence:** `MarketDataCache`, `NewsArticle`, `SentimentScore`, `AIReport`, `SourceLog`, `ApiHealthLog`
- **Decision:** `UserWatchlist`

---

## API Architecture

The FastAPI backend is logically grouped by functional domain:

- **Authentication (`deps.py`):** JWT verification and user resolution.
- **Market Data & Technicals (`stocks.py`):** OHLCV retrieval and indicator calculation.
- **Intelligence (`ai.py`):** Signal generation and sentiment synthesis.
- **Monitoring (`health.py`, `system.py`):** Liveness probes and caching metrics.

---

## Performance & Reliability

- **Aggressive Caching:** High-latency upstream requests (yfinance, Finnhub) are cached in the PostgreSQL `MarketDataCache` with distinct TTLs (e.g., 5 mins for quotes, 3 hours for news).
- **Graceful Fallbacks:** If API keys are missing or upstream providers fail, STOCKSEE automatically degrades to stale cache data or clearly-labeled demo fallback data to ensure the platform remains functional.

---

## Why STOCKSEE?

Why does STOCKSEE exist alongside platforms like Yahoo Finance or TradingView?

STOCKSEE is designed around a specific product thesis: **synthesizing fragmented market evidence into a structured decision-support experience.** 

While traditional platforms provide excellent raw charting, they leave the burden of synthesis entirely on the user. STOCKSEE unifies **DATA → CONTEXT → INTELLIGENCE → DECISION** into a single cohesive pipeline.

---

## License

This project is proprietary and confidential.

*(c) 2024 Essakki Raja T. All rights reserved.*
