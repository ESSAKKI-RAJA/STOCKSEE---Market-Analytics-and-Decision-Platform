# 01 - PRODUCT OVERVIEW

## What STOCKSEE is
STOCKSEE is a comprehensive, real-time stock market analysis and portfolio intelligence platform. It acts as a unified financial command center (terminal) that provides users with live market data, AI-driven stock recommendations, sentiment analysis from global financial news, and advanced portfolio tracking.

## Why it exists / Problem Statement / Market Problem
Retail and semi-professional investors currently suffer from **platform fragmentation**. They check Yahoo Finance for quotes, TradingView for charts, separate brokerage apps for portfolio tracking, and Twitter/Reddit for sentiment. This disjointed workflow leads to slow decision-making and missed opportunities. Existing platforms are often overly complex (Bloomberg Terminal) or too basic (Robinhood).

## User Pain Points
1. Overwhelming data without actionable insights.
2. High cost of premium tools that offer institutional-grade AI signals.
3. Lack of cohesive sentiment analysis tied directly to asset price action.
4. Difficulty tracking multi-exchange portfolios with real-time risk assessment.

## Vision
To democratize institutional-grade financial intelligence and AI-driven trading insights, making them accessible, intuitive, and actionable for every class of investor.

## Mission
To build the most beautifully designed, hyper-fast, and intelligent retail trading terminal on the web, bridging the gap between raw data and confident financial decisions.

## Product Philosophy
- **Actionable Intelligence over Raw Data**: Don't just show the RSI; explain if it's a bullish or bearish setup.
- **Speed is a Feature**: Financial data must be real-time (or near real-time) and the UI must never block.
- **Aesthetic Excellence**: A premium, "glassmorphism" dark-mode first design that users *want* to stare at for hours.
- **Honesty in AI**: Always surface transparency badges indicating if data is real, delayed, or demo, and explain the limitations of the ML signals.

## Target Audience & Customer Personas
1. **The Data-Driven Retail Investor**: Understands basic technicals (SMA, MACD) but wants them automated.
2. **The Passive Wealth Builder**: Wants AI top picks and easy portfolio tracking.
3. **The Swing Trader**: Relies on sentiment shifts and technical crossovers to capture multi-day trends.

## Target Industries
- Wealth Management Tech (WealthTech)
- Retail Investing / Brokerage
- Financial Analytics & Education

## Core Differentiators & Competitive Advantage
- **Unified AI Signal Engine**: Combines standard technical indicators (MACD, RSI) with VADER/FinBERT NLP sentiment analysis into a single digestible score.
- **Extreme Transparency**: The `FallbackResponse` architecture explicitly tells the user the source and confidence of every single data point.
- **Superior UX/UI**: Leverages Tailwind, Framer Motion, and shadcn/ui to provide a Bloomberg-like density but with Apple-like aesthetics.

## Business Goals & Long-Term Vision
Establish a strong user base via a freemium model, eventually introducing direct broker integrations (to execute trades directly from the terminal) and enterprise API access.


# 02 - BUSINESS MODEL

## Revenue Model
The STOCKSEE revenue model is built around a **Freemium SaaS Strategy**. The core data and basic analytical features are free, designed to capture top-of-funnel users and establish daily active use habits. Monetization comes from advanced AI insights, higher rate limits, and enterprise-level tools.

## Subscription Plans

### 1. Free Tier (Retail Starter)
- **Features**: Basic quotes, 1-day/1-month historical charts, limited watchlist (up to 10 assets), End-of-Day (EOD) data fallback, VADER sentiment analysis.
- **Price**: $0/month

### 2. Pro Tier (Advanced Retail / Swing Trader)
- **Features**: Real-time quotes (via Finnhub/yfinance direct without caching delays), unlimited watchlists, multi-exchange portfolio tracking, AI Signal Engine (MACD + RSI + Sentiment combined scores), FinBERT NLP processing, Push Notification Alerts.
- **Price**: ~$15 - $25/month

### 3. Institutional / Enterprise Tier (Portfolio Managers)
- **Features**: API access for trading algorithms, custom dashboard white-labeling, bulk portfolio optimization scoring, multi-seat licenses, dedicated account manager, unlimited screener queries.
- **Price**: $200+/month or custom negotiated annual contracts.

## Freemium Opportunities
- **Paywalls on Specific Insights**: For example, a user can see the MACD crossover, but the resulting "Confidence Score" and "AI Prediction" are blurred out, prompting an upgrade.
- **Ad-Supported Free Tier**: Subtle, highly targeted financial sponsorships (e.g., brokerage signup offers).

## B2B & White-Label Opportunities
- **Brokerage Integration**: Licensing the STOCKSEE frontend to smaller, legacy brokerages that lack a modern UI.
- **API Monetization**: Exposing the `FallbackResponse` enriched data and `signal_service.py` heuristic engine via a documented REST API for quant researchers and algorithmic traders.

## Expected ARR Model & Business KPIs
- **Primary KPIs**: Daily Active Users (DAU), Free-to-Paid Conversion Rate (Target: 3-5%), Monthly Churn Rate (Target: < 5%), Customer Acquisition Cost (CAC) vs. Lifetime Value (LTV).
- **Growth Strategy**: Product-Led Growth (PLG) where users share specific stock analysis reports generated by `report_service.py` to social media (Twitter/X, Reddit), acting as viral loops.
- **Network Effects**: As more users create watchlists, STOCKSEE can aggregate "retail sentiment" (e.g., "Most Watched on STOCKSEE today") and sell that alternative data back to institutional clients.


# 03 - PRODUCT FEATURES

## 1. Market Dashboard (Command Center)
- **Purpose**: A high-level overview of global markets.
- **Business Value**: Drives DAU by acting as a morning routine check.
- **Technical Implementation**: Fetches macro data via `market_data_service.py` and aggregates top gainers/losers.
- **Files Responsible**: `frontend/src/pages/Index.tsx`, `frontend/src/components/MarketInsights.tsx`
- **Future Improvements**: Customizable widgets (drag-and-drop dashboard).

## 2. Market Scanner / Screener (`Analyse`)
- **Purpose**: Scan thousands of instruments across sectors and exchanges.
- **Business Value**: Core tool for active traders to find setups.
- **Technical Implementation**: Allows filtering by technicals (RSI, MACD) and fundamentals (Market Cap). Handled by `Screener.tsx`.
- **Files Responsible**: `frontend/src/pages/Analyse.tsx`, `frontend/src/pages/Screener.tsx`
- **Current Status**: Implemented frontend filtering. Backend screening needs optimization.

## 3. Watchlist
- **Purpose**: Track specific instruments.
- **Technical Implementation**: Backed by Supabase database with Row Level Security (RLS). Handled via `watchlist_service.py` in the backend and `AuthContext` on the frontend.
- **Files Responsible**: `frontend/src/pages/Watchlist.tsx`, `backend/app/services/watchlist_service.py`, `backend/app/api/stocks.py`
- **Database Tables**: `watchlist` (Supabase).

## 4. Portfolio Management
- **Purpose**: Track holdings, calculate P&L, and visualize sector allocation.
- **Business Value**: Creates extreme stickiness; users rarely leave a platform where they track their money.
- **Technical Implementation**: Computes unrealized gains using real-time quotes vs. average buy price.
- **Files Responsible**: `frontend/src/pages/Portfolio.tsx`
- **Database Tables**: `user_portfolio`.

## 5. AI Advisor & Technical Signals
- **Purpose**: Convert raw data into a "STRONG BUY / BUY / HOLD / SELL / STRONG SELL" signal.
- **Technical Implementation**: Merges `indicator_service.py` (SMA, MACD, RSI) with `sentiment_service.py` and outputs via `signal_service.py`. It explicitly flags limitations.
- **Files Responsible**: `backend/app/services/signal_service.py`, `frontend/src/pages/AIAdvisor.tsx`, `frontend/src/components/AIInsightCard.tsx`
- **Backend APIs**: `GET /api/signal/{symbol}`
- **Future Improvements**: Introduce LLMs (e.g., Llama 3) for deep fundamental analysis.

## 6. News & Sentiment Engine
- **Purpose**: Aggregates news and scores sentiment.
- **Technical Implementation**: Fetches from Finnhub (`news_service.py`), runs NLP via VADER/FinBERT (`sentiment_service.py`).
- **Files Responsible**: `backend/app/services/news_service.py`, `backend/app/services/sentiment_service.py`, `frontend/src/components/MarketNews.tsx`

## 7. Alerts System
- **Purpose**: Push notifications for price thresholds or technical crossovers.
- **Technical Implementation**: Polling or WebSockets to check price vs. threshold.
- **Files Responsible**: `frontend/src/pages/Alerts.tsx`, `frontend/src/hooks/useAlerts.ts`
- **Database Tables**: `user_alerts`.

## 8. Heatmaps
- **Purpose**: Visual sector and market-cap performance comparison.
- **Files Responsible**: `frontend/src/pages/Heatmaps.tsx`, `frontend/src/components/SectorHeatmap.tsx`
- **Backend APIs**: `GET /api/heatmap`

## 9. Educational Academy
- **Purpose**: Onboard beginners, improving retention.
- **Files Responsible**: `frontend/src/pages/Learn.tsx`


# 04 - USER JOURNEY

## 1. Landing & Discovery
- **Flow**: User arrives at `stocksee-delta.vercel.app`. The `Navbar.tsx` and `HeroVisuals.tsx` immediately showcase the glassmorphic, premium UI.
- **Action**: User sees live scrolling ticker (`TickerBar.tsx`) and is prompted to enter a stock symbol.

## 2. Signup & Authentication
- **Flow**: User clicks "Sign Up".
- **Implementation**: Handled via Supabase Auth (or Clerk, as configured in `.env`). The user can use Email/Password or Google OAuth (PKCE).
- **Files**: `frontend/src/pages/SignUp.tsx`, `frontend/src/pages/AuthCallback.tsx`, `AuthContext.tsx`.

## 3. Dashboard Onboarding
- **Flow**: Post-login, user is redirected to `Index.tsx` (Dashboard).
- **Action**: User sees Market Overview, Trending Stocks, and News feeds. They are prompted to add their first stock to the Watchlist.

## 4. Stock Analysis & Discovery
- **Search**: User searches for "AAPL".
- **Detail View**: User is taken to `StockDetail.tsx` (`/stock/AAPL`).
- **Data Hydration**: The frontend calls `GET /api/market/quote/AAPL`, `GET /api/market/history/AAPL`, and `GET /api/report/AAPL`.
- **Insight**: User reads the AI Signal (`AIInsightCard.tsx`) generated by `signal_service.py`.

## 5. Portfolio Tracking
- **Action**: User navigates to `/portfolio` (`Portfolio.tsx`).
- **Flow**: User adds holding: "AAPL", QTY: 10, Buy Price: $150.
- **Result**: The UI calculates real-time P&L against the live quote. A pie chart shows sector allocation.

## 6. Alerts & Retention
- **Action**: User sets an alert: "Notify me if AAPL drops below $145".
- **Flow**: Handled by `Alerts.tsx`. When the condition is met, a notification appears via `NotificationsBell.tsx` and `useNotifications.ts`.
- **Lifecycle**: Alerts bring the user back to the application, driving DAU.

## 7. Settings & Profile Management
- **Flow**: User navigates to `/settings` (`Settings.tsx`) to toggle Dark/Light mode (`ThemeToggle.tsx`), change password, or manage preferences.


# 05 - COMPLETE TECH STACK

## Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite (Lightning fast HMR, optimized production builds)
- **Styling**: Tailwind CSS v3 (Utility-first styling for high customization)
- **UI Components**: shadcn/ui (Accessible, customizable Radix UI primitives)
- **Routing**: React Router v6
- **State Management (Server)**: TanStack Query v5 (Handles caching, deduplication, and background fetching of API requests)
- **Animations**: Framer Motion (Fluid micro-animations, layout transitions)
- **Icons**: Lucide React
- **Charting**: Recharts / Lightweight Charts (TradingView)

## Backend
- **Framework**: FastAPI (Python 3.11+)
- **Language**: Python (Chosen for unmatched ML/Data Science ecosystem support)
- **Server**: Uvicorn (ASGI server)
- **Validation**: Pydantic v2 (Strict type checking and schema validation)
- **Caching Engine**: Custom in-memory dictionary cache with TTL (`cache_service.py`)

## Database & Authentication
- **Primary Database**: PostgreSQL (via Supabase) / SQLite (Local Dev via SQLAlchemy)
- **ORM**: SQLAlchemy 2.0 (Models defined in `app/models/`)
- **Migrations**: Alembic (Directory `backend/alembic/`)
- **Authentication**: Supabase Auth (JWT validation in FastAPI via PyJWT & JWKS) & Clerk integration.

## Machine Learning & Data Processing
- **Data Providers**: yfinance (historical/quotes), Finnhub (news/fundamentals)
- **Data Manipulation**: Pandas, NumPy
- **Sentiment NLP**: VADER (Valence Aware Dictionary and sEntiment Reasoner), FinBERT (transformer-based model for financial text).
- **Architecture**: Graceful degradation (Falls back from FinBERT to VADER if memory limited via `DISABLE_FINBERT=1`).

## Infrastructure & DevOps
- **Frontend Hosting**: Vercel (Global Edge Network, automatic CI/CD on git push).
- **Backend Hosting**: Render (Web Service for FastAPI).
- **Environment Variables**: Managed via `.env` files locally and provider UI in production.
- **Package Managers**: npm (Frontend), pip (Backend).

## Why this stack?
- **React + Tailwind + shadcn**: Enables rapid UI iteration while maintaining a premium aesthetic.
- **FastAPI**: Unbeatable API performance in Python, essential since the backend needs to run Pandas calculations and ML inference.
- **Supabase**: Eliminates backend boilerplate for Auth and RLS (Row Level Security), drastically speeding up time-to-market.


# 06 - FRONTEND ARCHITECTURE

## Folder Structure
```text
frontend/src/
├── assets/         # Static images, logos (stocksense-logo.png)
├── components/     # Reusable UI widgets and layout containers
│   └── ui/         # shadcn/ui primitive components (buttons, dialogs, etc.)
├── contexts/       # React Context providers (AuthContext.tsx)
├── data/           # Mock/Static data (newsData.ts, stockData.ts, heatmaps.ts)
├── hooks/          # Custom React hooks (useAlerts.ts, useWatchlist.ts)
├── integrations/   # Third-party integrations (supabase, lovable)
├── lib/            # Utilities, API clients (apiClient.ts, utils.ts)
├── pages/          # Full page route components
├── App.tsx         # Main router and app shell
├── index.css       # Tailwind entry and global CSS variables
├── main.tsx        # React DOM render entry
```

## Pages
- `Index.tsx`: The main dashboard.
- `Analyse.tsx`, `Screener.tsx`: Market scanning interfaces.
- `StockDetail.tsx`, `CryptoDetail.tsx`, `ETFDetail.tsx`: Asset specific dashboards.
- `Watchlist.tsx`, `Portfolio.tsx`, `Alerts.tsx`: User-specific data views.
- `AIAdvisor.tsx`: Dedicated AI signal explanation page.
- `Auth.tsx`, `SignIn.tsx`, `SignUp.tsx`, `AuthCallback.tsx`: Authentication flows.
- `Settings.tsx`, `Pricing.tsx`, `Learn.tsx`, `NewsCenter.tsx`, `Heatmaps.tsx`.

## Key Components
- **`Layout.tsx`**: Wraps all authenticated and public pages. Contains the `Sidebar.tsx` (navigation) and `Topbar.tsx` (user profile, theme toggle, and `TickerBar.tsx`).
- **`AIInsightCard.tsx` / `AISentiment.tsx`**: Displays the AI signal and confidence score.
- **`MarketInsights.tsx` / `MarketNews.tsx`**: Dashboard widgets for macro data.
- **`StockCard.tsx`**: Reusable card for asset previews in watchlists or screeners.
- **`SectorHeatmap.tsx`**: Treemap visualization for sectors.

## Hooks & Contexts
- **`AuthContext.tsx`**: Manages the user session. Connects to `SupabaseClient` and provides `session`, `user`, and `signOut` functions to the app.
- **`useStockPrices.ts`**: Fetches quotes via `apiClient`.
- **`useStockAnalysis.ts`**: Fetches `GET /api/report/{symbol}` and provides loading states.
- **`useWatchlist.ts`, `useAlerts.ts`, `useNotifications.ts`**: Interact with the respective backend endpoints and manage local cache via TanStack Query.

## State Management
- **TanStack Query (React Query)**: Handles all server state. It caches API responses, handles retries, and eliminates the need for Redux or complex `useEffect` chains for data fetching.
- **Context API**: Handles global UI state (Theme) and Auth state.
- **Local State (`useState`)**: Used exclusively for transient UI state (e.g., modal open/close, form inputs).

## Routing
Managed by `react-router-dom` in `App.tsx`.
- **`ProtectedRoute.tsx`**: An element wrapper that checks `AuthContext`. If `!session`, it redirects to `/login`.

## Styling & Theming
- **Tailwind CSS**: Using `tailwind.config.ts` for custom colors (background, foreground, primary, secondary, destructive, ring) driven by CSS variables in `index.css`.
- **Dark Mode**: Managed by `next-themes` (`ThemeProvider`). `index.css` defines `.dark` class variables.

## Performance Optimizations
- Vite's built-in chunk splitting.
- TanStack Query avoids refetching identical data within the `staleTime` window.
- Debounced search inputs in `Analyse.tsx`.


# 07 - BACKEND ARCHITECTURE

## Folder Structure
```text
backend/app/
├── api/            # FastAPI route controllers
├── core/           # Configuration, security, DB connection
├── database/       # (Or db/) session management
├── models/         # SQLAlchemy ORM definitions
├── schemas/        # Pydantic models for request/response validation
├── services/       # Core business logic and data fetching
├── __init__.py
├── main.py         # FastAPI application entry point
```

## API Architecture (Controller-Service Pattern)
The backend follows a strict separation of concerns:
1. **API Layer (`app/api/` & `main.py`)**: Defines the HTTP endpoints, extracts path/query parameters, validates payloads using Pydantic schemas, and calls the appropriate service layer function. Returns standardized `FallbackResponse`.
2. **Service Layer (`app/services/`)**: Contains all the heavy lifting. Fetches data from external APIs, performs calculations, interacts with the database, and returns Python dictionaries.
3. **Data Access / Model Layer (`app/models/`)**: Defines the structure of the SQLite/PostgreSQL tables using SQLAlchemy.

## Main Entry Point (`main.py`)
- Initializes the FastAPI app `app = FastAPI(title="STOCKSEE API")`.
- Configures `CORSMiddleware` using `settings.cors_origins_list`.
- Includes routers: `ai_router` (`/api/ai`), `stocks_router` (`/api/stocks`), `system_router` (`/api`).
- Defines core `/api/market/*` routes which map directly to `market_data_service.py` and `indicator_service.py`.

## Services Breakdown
- **`market_data_service.py`**: Interacts with `yfinance`. Implements a graceful degradation flow (Cache -> yfinance -> Stale Cache -> Demo Fallback).
- **`indicator_service.py`**: Computes SMA, RSI, MACD, and volatility using Pandas based on history rows.
- **`sentiment_service.py`**: Takes news articles and runs VADER sentiment analysis to output a -1 to +1 score.
- **`prediction_service.py`**: A heuristic-based trend projector (explicitly NOT a deep learning ML model).
- **`signal_service.py`**: Merges indicators and sentiment into a unified "Bullish/Bearish" label.
- **`report_service.py`**: Aggregates all the above into a single comprehensive JSON payload for the frontend `StockDetail` page.
- **`cache_service.py`**: A custom in-memory TTL cache dictionary to prevent blowing past external API rate limits.

## Standardized Response Model
Every endpoint returns a `FallbackResponse` (defined in `schemas/common.py`):
```python
class FallbackResponse(BaseModel):
    status: str
    mode: str         # "real", "fallback", "demo", "stale_cache"
    source: str       # e.g., "yfinance", "calculated", "vader"
    message: str
    data: Any
    limitations: str  # Transparency string explaining the data's reliability
```

## Dependency Injection & Database Connection
- `app/db/session.py` initializes the SQLAlchemy `engine` and `SessionLocal`.
- FastAPI `Depends` is used in API routes to inject the DB session (`get_db()`) and the current user context (via JWT decoding).

## Error Handling & Logging
- Handled at the service level. If an external API fails (e.g., `yfinance` rate limit), the service catches the `Exception`, logs a warning using Python's `logging` module, and returns a demo/fallback payload instead of a 500 error, ensuring the frontend UI never breaks.


# 08 - DATABASE

The STOCKSEE database architecture utilizes PostgreSQL (hosted on Supabase) for production and SQLite for local development (`stocksee_dev.db`). The ORM used is SQLAlchemy.

## Core Tables (SQLAlchemy Models)

### 1. `company_profiles`
- **Purpose**: Stores fundamental company information.
- **Columns**: `symbol` (PK), `company_name`, `exchange`, `currency`, `sector`, `industry`, `website`, `market_cap`, `source`, `last_updated`.

### 2. `market_data_cache`
- **Purpose**: A persistent cache for end-of-day or highly requested stock quotes to prevent hitting external APIs.
- **Columns**: `id` (PK, UUID), `symbol` (Indexed), `price`, `change`, `change_percent`, `volume`, `day_high`, `day_low`, `source`, `delay_label`, `last_updated`.

### 3. `ohlcv_cache`
- **Purpose**: Caches historical price data (Open, High, Low, Close, Volume) to speed up chart rendering and technical indicator computation.
- **Columns**: `id` (PK), `symbol` (Indexed), `timeframe`, `date`, `open`, `high`, `low`, `close`, `volume`, `source`, `last_updated`.

### 4. `technical_indicators`
- **Purpose**: Stores pre-computed MACD, RSI, and SMA values.
- **Columns**: `id` (PK), `symbol` (Indexed), `timeframe`, `sma20`, `sma50`, `sma200`, `rsi14`, `macd`, `macd_signal`, `trend`, `last_updated`.

### 5. `news_articles`
- **Purpose**: Caches news headlines from Finnhub to run historical sentiment analysis.
- **Columns**: `id` (PK), `symbol` (Indexed), `headline`, `summary`, `url`, `source`, `published_at`, `fetched_at`.

### 6. `sentiment_scores`
- **Purpose**: Stores the results of the VADER/FinBERT NLP runs so they don't have to be recalculated for every request.
- **Columns**: `id` (PK), `symbol` (Indexed), `sentiment_label`, `sentiment_score`, `confidence`, `article_count`, `last_updated`.

## User Data Tables (Typically managed via Supabase directly)
*Note: Depending on configuration, some of these reside in Supabase's `public` schema utilizing Row Level Security (RLS).*
- **`profiles`**: Links to `auth.users`. Stores name, avatar, risk tolerance.
- **`watchlist`**: Columns: `user_id`, `symbol`, `added_at`.
- **`user_portfolio`**: Columns: `id`, `user_id`, `symbol`, `quantity`, `average_buy_price`, `currency`.
- **`user_alerts`**: Columns: `id`, `user_id`, `symbol`, `condition` (e.g., 'above', 'below', 'crosses_sma20'), `threshold_price`, `is_active`.

## Data Lifecycle
1. **Cache Miss**: Request hits the API, the service queries the database. If stale (based on `last_updated`), it triggers an external API call.
2. **Upsert**: The new data is processed and written back to the respective cache table (`market_data_cache`, `ohlcv_cache`).
3. **Pruning**: Periodic cron jobs (or background tasks) can clear `ohlcv_cache` older than a specific date to save space if needed.

## Why each table exists
Instead of relying purely on an in-memory Redis cache, storing this data in SQL allows STOCKSEE to build a proprietary historical database over time, which is essential for training future machine learning models.


# 09 - DATA SOURCES

STOCKSEE relies on a hybrid approach of external APIs and demo fallbacks to ensure the UI never breaks, even during API outages or rate limits.

## 1. yfinance (Yahoo Finance API Wrapper)
- **Data Provided**: Real-time (delayed 15m) market quotes, historical OHLCV data.
- **Provider**: Yahoo Finance (scraped/unofficial via `yfinance` library).
- **Frequency**: On-demand during user requests.
- **Format**: Pandas DataFrames, converted to JSON lists of dicts.
- **Usage**: Feeds `market_data_service.py` -> `get_market_quote()` and `get_market_history()`.
- **Limitations**: Rate-limited heavily if abused. Relies on internal cache to mitigate.

## 2. Finnhub (finnhub.io)
- **Data Provided**: Real-time financial news, company fundamentals.
- **Provider**: Finnhub REST API (`FINNHUB_API_KEY`).
- **Frequency**: On-demand.
- **Format**: JSON.
- **Usage**: Feeds `news_service.py`. The headlines are directly piped into `sentiment_service.py`.
- **Limitations**: Free tier limits to 60 calls/minute.

## 3. Fallback / Demo Data
- **Data Provided**: Hardcoded static JSON structures.
- **Provider**: Internal `_get_demo_quote()`, `_get_demo_history()`.
- **Usage**: When `yfinance` fails or network is down, the system gracefully falls back to returning fake data but labels it explicitly with `mode: "demo"`.

## Future Data Integrations (Roadmap)
- **Alpha Vantage / Polygon.io**: For robust, institutional-grade tick data.
- **FRED (Federal Reserve Economic Data)**: For macroeconomic indicators (Inflation, Interest Rates) to feed into a wider AI market health model.
- **Alternative Data**: Twitter/X API for social sentiment (currently missing, relying only on official news).

## Data Processing Pipeline
1. **Fetch**: `yfinance` history.
2. **Clean/Transform**: Fill NaN values in Pandas, convert `Volume` to integers.
3. **Serve**: Return as a standard dictionary to the API controller, which wraps it in `FallbackResponse`.


# 10 - DATA PIPELINES

## Overview
STOCKSEE is designed for real-time inference rather than massive asynchronous batch ETL processing. Data enters the system synchronously upon user request but is heavily cached to simulate a real-time streaming feel without crushing external rate limits.

## The Fetch-Cache-Serve Pipeline

1. **Trigger**: User navigates to `/stock/AAPL`. The frontend fires a TanStack Query to `GET /api/report/AAPL`.
2. **Controller**: `main.py` -> `report(symbol)` is invoked.
3. **Cache Check**: `cache_service.py` is queried for the key `report_AAPL`. If valid, it returns immediately.
4. **Data Aggregation (On-The-Fly ETL)**:
   - `get_market_quote(AAPL)` is called (hits yfinance or local cache).
   - `get_market_history(AAPL)` is called.
   - `calculate_indicators()` transforms the raw OHLCV DataFrame into RSI, MACD, and SMA.
   - `get_news(AAPL)` fetches JSON from Finnhub.
   - `analyze_sentiment()` applies NLP text processing to the news headlines.
5. **Inference**: `generate_signal()` takes the transformed technicals and sentiment and runs a heuristic decision tree.
6. **Storage/Cache Update**: The final aggregated JSON payload is pushed back to `cache_service.py` (TTL: 5-15 mins).
7. **Serve**: The payload is returned to the frontend.

## Caching Strategy
- **Time-to-Live (TTL)**: Quotes (5 mins), History (6 hours), News (1 hour), Sentiment (1 hour).
- **Stale Cache Fallback**: If an external API errors (e.g., HTTP 429 Too Many Requests), the `cache_service.py` explicitly fetches `get_stale_cache()`. It serves old data but mutates the `_meta.mode` flag to `"stale_cache"` so the UI can warn the user.

## Future Streaming / WebSockets
Currently, there is no WebSocket implementation. Polling is handled strictly by the frontend via TanStack Query (`refetchInterval: 300000` for 5 mins). Future iterations will introduce a Python `websockets` or `Redis PubSub` layer to stream tick-level data.


# 11 - MACHINE LEARNING / AI

## Current AI Capabilities

### 1. NLP Sentiment Analysis (`sentiment_service.py`)
- **Model**: VADER (Valence Aware Dictionary and sEntiment Reasoner).
- **Fallback / Upgrade**: The architecture explicitly supports FinBERT (a HuggingFace transformer model fine-tuned on financial text), but it is disabled by default via the `DISABLE_FINBERT=1` environment variable due to memory constraints on Render's free tier.
- **Pipeline**:
  1. News headlines and summaries are concatenated.
  2. Text is passed into the `SentimentIntensityAnalyzer`.
  3. The compound scores (-1.0 to +1.0) are averaged across all fetched articles.
  4. The output is normalized to a 0-100 scale for the UI.

### 2. Trend Projection (`prediction_service.py`)
- **Current State**: Currently uses a *heuristic heuristic* (SMA crossover + momentum), **NOT** a trained ML model. The documentation in the file explicitly states: `"Uses SMA crossover + momentum heuristic for simple directional bias. No ML models (LSTM, Prophet, etc.) are loaded."`
- **Output**: Generates a "Conservative 2% Up/Down" projection based on the current RSI and SMA trend.

### 3. Signal Engine (`signal_service.py`)
- **Current State**: A weighted decision tree (Rules-based AI).
- **Features**: Takes `tech_score` (derived from MACD/RSI/SMA) and `sent_score` (derived from VADER), averages them, and maps them to discrete labels like `"Bullish Setup"` or `"Risk Elevated"`.

## Future AI Roadmap
1. **LSTM Time-Series Forecasting**: Implement TensorFlow/Keras LSTM models trained on the `ohlcv_cache` to predict next-day closing prices.
2. **XGBoost Classification**: Train a model to predict binary outcomes (Up/Down next week) based on a feature matrix of 20+ technical indicators.
3. **Generative AI Copilot**: Integrate an LLM (via OpenAI or Anthropic API) to generate human-readable summaries of the financial data, answering questions like "Why did AAPL drop today?" directly in the dashboard.


# 12 - FINANCIAL ANALYTICS

The `indicator_service.py` is the mathematical heart of STOCKSEE's technical analysis. All calculations are performed using `pandas` and `numpy`.

## Implemented Indicators

### 1. Simple Moving Averages (SMA)
- **Calculation**: Rolling arithmetic mean of the closing prices over a specific window.
- **Implementation**:
  - `sma_20 = closes.rolling(window=20).mean()`
  - `sma_50 = closes.rolling(window=50).mean()`
- **Usage**: Trend identification. Price > SMA20 is considered a short-term bullish condition.

### 2. Relative Strength Index (RSI)
- **Calculation**: 14-period Wilder's Smoothing RSI.
- **Implementation**:
  - Calculates daily deltas (`closes.diff()`).
  - Separates gains and losses.
  - Computes the average gain and average loss over a 14-day rolling window.
  - `RS = Avg Gain / Avg Loss` -> `RSI = 100 - (100 / (1 + RS))`
- **Usage**: Momentum oscillator. >70 is Overbought, <30 is Oversold.

### 3. MACD (Moving Average Convergence Divergence)
- **Calculation**:
  - `EMA_12 = closes.ewm(span=12).mean()`
  - `EMA_26 = closes.ewm(span=26).mean()`
  - `MACD_Line = EMA_12 - EMA_26`
  - `Signal_Line = MACD_Line.ewm(span=9).mean()`
  - `Histogram = MACD_Line - Signal_Line`
- **Usage**: Trend-following momentum indicator. Crossovers dictate entry/exit signals.

### 4. Volatility
- **Calculation**: Standard deviation of the closing prices over the fetched period (`closes.std()`).
- **Usage**: Used in `signal_service.py` to trigger the `"Risk Elevated"` flag if volatility exceeds 5% of the SMA20.

## Missing Analytics (Future Additions)
- Bollinger Bands
- VWAP (Volume Weighted Average Price) - requires intraday tick data.
- Average True Range (ATR)
- Portfolio-level Risk Metrics: Sharpe Ratio, Beta, Max Drawdown.


# 13 - BUSINESS LOGIC

## Recommendation Engine (`signal_service.py`)

The core business logic dictating what the user sees in the "AI Advisor" is entirely encapsulated in `generate_signal()`.

### Scoring System
1. **Technical Base Score**: Starts at 50/100.
2. **Trend Modifier**: If Price > SMA20 AND RSI > 55, Trend = "Bullish" -> Add 20 points. (If Bearish, subtract 20).
3. **Momentum Modifier**: If RSI > 70 (Overbought), subtract 10 points. If RSI < 30 (Oversold), add 10 points.
4. **Sentiment Score**: Normalizes the VADER NLP score (-1 to 1) to a 0-100 scale.
5. **Final Combined Score**: `(Technical Score + Sentiment Score) / 2`.

### Ranking & Thresholds
The Final Combined Score maps to a distinct human-readable label:
- **Score > 70**: `Bullish Setup`
- **Score < 30**: `Bearish Setup`
- **30 <= Score <= 70**: `Neutral / Wait`

### Risk Logic
The system overrides normal labels if volatility is exceptionally high.
- **Condition**: `volatility > (SMA20 * 0.05)`
- **Override Label**: `Risk Elevated`

### Confidence Scoring
The platform grades its own confidence based on data availability, ensuring it never hallucinates certainty when data is missing.
- **Medium Confidence**: Both Technical data AND News Sentiment data are pulled from real external APIs (`mode == "real"`).
- **Low-Medium**: Only Technical data is real.
- **Low**: Fallback or demo data used.

## Alert Logic
Defined in the frontend via `useAlerts.ts` and triggered locally (or via backend cron in future iterations). Alerts evaluate a user-defined threshold against the live `price` from `get_market_quote()`.


# 14 - APIs

All APIs return a standardized `FallbackResponse` (JSON).

## Base URL
Local: `http://localhost:8000`
Production: `https://your-render-app.onrender.com`

## 1. System & Health
### `GET /`
- **Purpose**: Root connection check.
- **Response**: `{"message": "STOCKSEE backend running 🚀", "version": "0.2.0"}`

### `GET /health`
- **Purpose**: Deep health check validating DB and external API connections.

## 2. Market Data (`/api/market/*`)
### `GET /api/market/quote/{symbol}`
- **Purpose**: Fetch live EOD price, volume, and market cap.
- **Provider**: yfinance

### `POST /api/market/quotes`
- **Purpose**: Batch fetch quotes for portfolio/watchlist views.
- **Request**: `{"symbols": ["AAPL", "TSLA"]}`

### `GET /api/market/history/{symbol}`
- **Purpose**: Fetch OHLCV data. Default 1-month period.

### `GET /api/market/indicators/{symbol}`
- **Purpose**: Compute technicals. Returns SMA, RSI, MACD objects.

## 3. AI & Analysis (`/api/*`)
### `GET /api/news/{symbol}`
- **Purpose**: Fetch recent company news from Finnhub.

### `GET /api/sentiment/{symbol}`
- **Purpose**: Run NLP on news.
- **Response**: `{"sentiment_label": "Positive", "sentiment_score": 0.8, ...}`

### `GET /api/prediction/{symbol}`
- **Purpose**: Directional heuristic projection.

### `GET /api/signal/{symbol}`
- **Purpose**: The final aggregated Buy/Sell/Hold signal based on technicals and sentiment.

### `GET /api/report/{symbol}`
- **Purpose**: MEGA-ENDPOINT. Aggregates Quote, History, Indicators, News, Sentiment, and Signal into one massive payload to reduce frontend waterfall requests. Heavily cached.

## 4. User Data
### `GET /api/watchlist`
### `POST /api/watchlist` (Body: `{"symbol": "AAPL"}`)
### `DELETE /api/watchlist/{symbol}`
- **Note**: Currently implemented as in-memory demo endpoints in FastAPI, but the frontend architecture expects these to eventually hit Supabase RLS policies directly or via authenticated API routes.


# 15 - SECURITY

## Authentication & Authorization
- **Provider**: Supabase Auth (with Clerk fallback support in `.env`).
- **Flow**: Frontend uses Supabase JS client to authenticate (Email/Password or Google OAuth PKCE). The resulting JWT is stored securely in local storage / cookies.
- **Backend Validation**: The FastAPI backend intercepts requests to protected routes via a dependency (e.g., `get_current_user` in `api/deps.py`). It decodes the JWT using `PyJWT` and validates it against the Supabase JWKS (JSON Web Key Set).

## Database Security (Row Level Security)
- Instead of complex backend authorization logic, Supabase PostgreSQL utilizes **Row Level Security (RLS)**.
- Policies ensure that `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on tables like `watchlist` and `user_portfolio` can only be executed where `auth.uid() = user_id`.

## Secrets & Environment Variables
- All API keys (`FINNHUB_API_KEY`, `SUPABASE_SECRET_KEY`) are stored in `.env` files and never committed to source control (ignored in `.gitignore`).
- Frontend env vars (`VITE_*`) expose only the anon/public keys, never the service role key.

## Protections
- **CORS**: Enforced by FastAPI `CORSMiddleware`. Only `localhost:5173` and the Vercel production domain are permitted.
- **Rate Limiting**: Currently absent on the FastAPI side, relying entirely on the hosting provider (Render/Cloudflare). *Security Roadmap: Implement `slowapi` for endpoint-level rate limiting.*
- **SQL Injection**: SQLAlchemy ORM inherently parameterizes queries, preventing SQL injection.

## Security Roadmap
- Implement strict JWT expiration and refresh token rotation.
- Add 2FA (Two-Factor Authentication) via Supabase.
- Add API rate limiting via `slowapi` to prevent malicious actors from burning the Finnhub API quota.


# 16 - PERFORMANCE

STOCKSEE is built to feel like a rapid-fire Bloomberg terminal.

## Frontend Optimizations
1. **Caching via TanStack Query**: Once a user fetches `/report/AAPL`, returning to that page within 5 minutes results in an instantaneous load from the memory cache (`staleTime: 300000`).
2. **Lazy Loading**: React `lazy()` and `Suspense` can be used to split chunks, though Vite's default rollup configuration currently handles code splitting sufficiently.
3. **Memoization**: `React.memo` and `useMemo` are utilized in heavy rendering components like charts (`SectorHeatmap.tsx`) to prevent unnecessary re-renders on unrelated state changes.
4. **Virtualization**: Not currently implemented but required for the future Screener table when displaying 1000+ rows.

## Backend Optimizations
1. **The Mega-Endpoint (`/api/report`)**: Instead of the frontend making 6 separate HTTP calls (quote, history, news, indicators, sentiment, signal), the backend aggregates them server-side. This drastically reduces network latency.
2. **In-Memory Cache (`cache_service.py`)**: Before hitting yfinance or Finnhub, the backend checks a custom dictionary cache.
   - Saves 500ms+ per request on cache hit.
   - Prevents API rate limits.
3. **Graceful NLP Degradation**: The `DISABLE_FINBERT=1` flag drops the heavy 400MB HuggingFace transformer model in favor of the lightweight, dictionary-based VADER model. This is critical for running on low-memory edge/free-tier servers.

## Scalability & Load Balancing
Currently, the backend runs as a single Uvicorn worker process. To scale horizontally, Gunicorn should be deployed with multiple Uvicorn worker classes (`gunicorn -w 4 -k uvicorn.workers.UvicornWorker`).


# 17 - DEPLOYMENT

## Architecture
The deployment architecture is completely decoupled: the frontend is a Static Site (SPA) served via CDN, and the backend is an API Web Service.

## Frontend (Vercel)
- **Host**: Vercel
- **Build Command**: `npm run build` (Vite)
- **Routing**: Because it's an SPA using React Router, a `vercel.json` file dictates that all routes rewrite to `index.html`.
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Environment Variables**: Managed in the Vercel UI (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_BACKEND_URL`).

## Backend (Render)
- **Host**: Render.com (Web Service)
- **Environment**: Python 3.11+
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Secrets**: API keys and database URLs are injected via the Render Dashboard. `DISABLE_FINBERT=1` is highly recommended on the free tier to prevent Out-Of-Memory (OOM) crashes.

## Database (Supabase)
- **Host**: AWS via Supabase Cloud.
- **Migration Pipeline**: SQL scripts are run via `npx supabase db push` to synchronize local schemas to production.

## CI/CD Pipeline
Currently relies on the built-in GitHub integrations of Vercel and Render. Pushing to the `main` branch automatically triggers builds and deployments on both platforms.

## Future Scaling
- **Dockerization**: A `Dockerfile` and `docker-compose.yml` should be created to containerize the FastAPI backend and Postgres database for deployment to AWS ECS or Kubernetes if Render's scaling limits are reached.


# 18 - TESTING

Currently, STOCKSEE is in MVP/Alpha phase and testing is minimal, relying on manual verification. To achieve enterprise readiness, the following testing architecture must be implemented.

## Current State
- **Frontend**: Contains `frontend/src/test/example.test.ts` and `vitest.config.ts`.
- **Backend**: No formal `pytest` suite exists.

## Required Testing Architecture

### 1. Frontend Unit & Component Tests (Vitest + React Testing Library)
- **Target**: `AISentiment.tsx`, `StockCard.tsx`, formatting utils (`currency.ts`).
- **Goal**: Ensure that confidence badges change color appropriately (e.g., Red for low confidence, Green for high) and that currency strings format correctly.

### 2. Backend Unit Tests (Pytest)
- **Target**: `indicator_service.py` and `signal_service.py`.
- **Goal**: Pass mocked Pandas DataFrames into `calculate_indicators()` to assert that RSI and MACD math is pixel-perfect against known historical values. Assert that `generate_signal()` correctly categorizes scores into the exact string labels required by the frontend.

### 3. Integration Tests
- **Target**: `main.py` API routes via FastAPI `TestClient`.
- **Goal**: Mock the external `yfinance` network calls using `responses` or `unittest.mock` to ensure the API controller successfully wraps the data in `FallbackResponse` and returns HTTP 200.

### 4. End-to-End (E2E) Tests (Playwright / Cypress)
- **Target**: The critical user path.
- **Flow to test**: User lands on site -> Logs in -> Searches for AAPL -> Adds to Watchlist -> Navigates to Watchlist and verifies AAPL is present.

## Security & Load Testing
- Use `Locust` to simulate 1,000 concurrent users hitting `/api/report/AAPL` to verify the `cache_service.py` successfully prevents rate-limit implosions.


# 19 - FOLDER STRUCTURE

## Root Directory
```text
STOCKSEE/
├── .git/
├── backend/            # Python / FastAPI server
├── docs/               # Documentation & Knowledge Base (You are here)
├── frontend/           # Vite / React UI
├── supabase/           # Database configurations and SQL migrations
├── .env                # Global / Prisma env overrides
├── .gitignore
├── diagnose-stocksee.bat  # Windows utility to check ports and deps
├── start-stocksee-dev.bat # Windows runner for both frontend/backend
├── stop-stocksee-dev.bat  # Windows killer for node/python processes
└── README.md           # Master project documentation
```

## Frontend Directory (`frontend/`)
```text
frontend/
├── dist/               # Compiled production build output
├── node_modules/
├── public/             # Static public files (favicon)
├── src/
│   ├── assets/         # Images
│   ├── components/     # Reusable React components
│   │   └── ui/         # shadcn components
│   ├── contexts/       # Auth context
│   ├── data/           # Hardcoded datasets
│   ├── hooks/          # Custom hooks
│   ├── integrations/   # Supabase client instances
│   ├── lib/            # Utilities
│   ├── pages/          # Next.js-style page components
│   ├── test/           # Vitest setup
│   ├── App.tsx         # Routing
│   ├── index.css       # Tailwind base
│   └── main.tsx        # Entry
├── .env                # VITE_ env vars
├── eslint.config.js
├── package.json
├── tailwind.config.ts  # Tailwind theme definitions
├── tsconfig.json
├── vercel.json         # SPA routing config
└── vite.config.ts      # Vite bundler config
```

## Backend Directory (`backend/`)
```text
backend/
├── alembic/            # Database migration scripts
├── app/
│   ├── api/            # Route controllers
│   ├── core/           # config.py, security setup
│   ├── database/       # session.py
│   ├── models/         # SQLAlchemy schemas
│   ├── schemas/        # Pydantic validation schemas
│   ├── services/       # Business logic (indicator_service, signal_service)
│   └── main.py         # App initialization
├── scripts/            # DB seeder / utility scripts
├── .env                # SUPABASE_, FINNHUB_, DISABLE_FINBERT
├── requirements.txt    # Python dependencies
└── stocksee_dev.db     # SQLite local database
```


# 20 - FILE-BY-FILE DOCUMENTATION

## Backend Files

### `main.py`
- **Purpose**: Initializes FastAPI app and handles the main mega-endpoints.
- **Functions**: `quote()`, `quotes_batch()`, `history()`, `indicators()`, `news()`, `sentiment()`, `prediction()`, `signal()`, `report()`, `heatmap()`, `get_watchlist_api()`.
- **Dependencies**: `app.services.*`, `FastAPI`, `CORS`.

### `models/stock.py`
- **Purpose**: Defines SQLAlchemy ORM models for financial data caching.
- **Classes**: `CompanyProfile`, `MarketDataCache`, `OHLCVCache`, `TechnicalIndicator`, `NewsArticle`, `SentimentScore`.

### `services/market_data_service.py`
- **Purpose**: Bridges API requests to `yfinance` with fallback safety.
- **Functions**: `get_market_quote(symbol)`, `get_market_history(symbol)`, `_get_demo_quote()`.
- **Interactions**: Calls `cache_service.py` to prevent redundant fetches.

### `services/indicator_service.py`
- **Purpose**: Performs all technical analysis math using Pandas.
- **Functions**: `calculate_indicators(symbol, history_data)`.
- **Interactions**: Takes data from `market_data_service.py` and feeds it to `signal_service.py`.

### `services/signal_service.py`
- **Purpose**: Core business logic for buy/sell heuristic decisions.
- **Functions**: `generate_signal(indicators, sentiment, prediction)`.
- **Logic**: Combines technical trend (+/-20 points), RSI overbought/oversold (+/-10 points) with NLP sentiment to generate a unified label (e.g., "Bullish Setup").

### `services/report_service.py`
- **Purpose**: Combines all separate service responses into a single JSON object to speed up frontend rendering.

## Frontend Files

### `App.tsx`
- **Purpose**: Root application component. Sets up React Router, TanStack Query client, ClerkProvider, ThemeProvider, and Toaster.
- **Components**: `<Layout />`, `<ProtectedRoute />`.

### `lib/apiClient.ts`
- **Purpose**: Centralized Axios/fetch wrapper.
- **Functions**: Intercepts requests to automatically attach the Supabase JWT Bearer token to all `/api/` calls.

### `components/AIInsightCard.tsx`
- **Purpose**: Renders the result of `generate_signal()`.
- **Design**: Changes border color and icon based on whether the signal is Bullish (Green), Bearish (Red), or Neutral (Gray).

### `pages/Portfolio.tsx`
- **Purpose**: User dashboard for holdings.
- **Interactions**: Uses `useStockPrices.ts` to fetch live quotes for all holdings to dynamically calculate `(Live Price - Buy Price) * Qty`.


# 21 - DEPENDENCIES

## Frontend Dependencies
- **`react` & `react-dom`**: UI rendering.
- **`react-router-dom`**: Client-side routing.
- **`@tanstack/react-query`**: State management for API data. Prevents race conditions and caches data automatically.
- **`tailwindcss`**: Utility CSS framework for the UI.
- **`framer-motion`**: Used for smooth page transitions and micro-interactions (e.g., expanding cards).
- **`@supabase/supabase-js`**: SDK for Auth and direct database querying.
- **`@clerk/clerk-react`**: Alternative Auth provider (supported via `.env`).
- **`lucide-react`**: Clean, modern SVG icon set.
- **`recharts`**: Lightweight composable charting library used in `SectorHeatmap.tsx` and Portfolio allocation charts.
- **`shadcn/ui` dependencies** (`radix-ui` primitives, `class-variance-authority`, `clsx`, `tailwind-merge`): Provides the accessible underlying foundation for the UI components without forcing a specific style.

## Backend Dependencies
- **`fastapi`**: Asynchronous web framework.
- **`uvicorn`**: ASGI server to run FastAPI.
- **`yfinance`**: Scrapes Yahoo Finance for quotes and OHLCV data. (Pros: Free. Cons: Unofficial, can be rate-limited/blocked).
- **`finnhub-python`**: Official client for Finnhub API to fetch news.
- **`pandas` & `numpy`**: Standard data science stack for calculating technical indicators (SMA, RSI, MACD) quickly.
- **`vaderSentiment`**: Dictionary-based NLP sentiment analyzer. (Pros: Extremely fast, very low RAM. Cons: Doesn't understand deep context).
- **`sqlalchemy` & `alembic`**: Database ORM and migration tool.
- **`pydantic-settings`**: Automatically parses `.env` variables into a typed Python class (`config.py`).
- **`PyJWT`**: Validates Supabase JSON Web Tokens to secure API routes.


# 22 - DESIGN SYSTEM

The STOCKSEE design system is intentionally crafted to mimic high-end financial tools (Bloomberg Terminal, Koyfin) while remaining accessible to retail investors (Robinhood).

## Typography
- **Primary Font**: `Inter` (sans-serif). Highly legible for data-dense tables.
- **Monospace Font**: `JetBrains Mono` or `Roboto Mono`. Used strictly for numbers, prices, and tickers to ensure vertical alignment in tables.

## Color Palette
- **Background (Dark Mode)**: `#09090b` (Deep Zinc). Reduces eye strain during extended trading sessions.
- **Card Backgrounds**: `#18181b` (Zinc 900) with a `1px` border of `border-border/50` to create subtle separation.
- **Bullish (Up)**: `#10b981` (Emerald 500).
- **Bearish (Down)**: `#ef4444` (Red 500).
- **Primary Accent**: `#3b82f6` (Blue 500). Used for primary buttons and active navigational states.

## Spacing & Layout
- Relies heavily on Tailwind's default spacing scale (`p-4`, `m-2`, `gap-4`).
- **Grid Systems**: Dashboards utilize CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to seamlessly reflow from desktop multi-monitor setups down to mobile web apps.

## UI Philosophy (Glassmorphism & Transparency)
- The UI leverages semi-transparent backgrounds with backdrop blur (`bg-background/80 backdrop-blur-md`) for topbars and sidebars. This gives the app a feeling of depth and premium quality.
- **Data Density**: Financial apps require high data density. shadcn/ui components (like Tables and Tooltips) are customized to have slightly smaller padding than standard SaaS apps to fit more data on screen.

## Consistency & Accessibility
- **Consistency**: All cards utilize the `<Card>` primitive from shadcn, ensuring border radius (`rounded-xl`) and shadow depths are universally identical.
- **Accessibility**: Radix UI (the engine behind shadcn) handles ARIA labels, keyboard navigation, and focus trapping natively.


# 23 - PRODUCT PRINCIPLES

## Core Engineering Principles
1. **Never Block the UI**: All external data fetches must be asynchronous. If an API takes 5 seconds, the UI must show a skeleton loader, not a frozen screen.
2. **Graceful Degradation**: If an external API goes down (e.g., yfinance rate limits), the backend MUST catch the error and return local cache or demo data, explicitly labeled. The frontend should never receive a generic `HTTP 500 Internal Server Error`.
3. **Stateless Backend**: The FastAPI backend should remain entirely stateless (relying only on the DB or external caching) to allow horizontal scaling on cloud providers.

## Product & Business Principles
1. **Honesty in AI**: Do not use the term "Price Target" when it is just a trend projection. Always attach a "Confidence" score and explain the "Limitations" to protect users and limit liability.
2. **Time to Value (TTV)**: The user must see actionable data within 2 seconds of landing on the dashboard. Do not force a long onboarding quiz before showing the market.
3. **Freemium Viability**: The free product must be genuinely useful. Paywall the *analysis* and *convenience*, not the raw numbers.

## Architecture & Scalability Principles
- **Decoupled Monolith**: Keep the frontend and backend strictly separated via a REST API, allowing future mobile apps (React Native/Flutter) to consume the exact same backend without changes.
- **Read-Heavy Optimization**: 95% of traffic is reading market data. Optimize read paths using in-memory caches or Redis; writes (updating watchlists) can be slower if necessary.


# 24 - CURRENT LIMITATIONS

## Data Limitations
- **yfinance Reliability**: Relying on an unofficial scraper (`yfinance`) for production quotes is risky. Yahoo frequently changes their DOM/API, which can break the integration silently.
- **Delayed Data**: Free tier data is typically delayed by 15 minutes. This makes the platform unsuitable for day traders requiring tick-by-tick Level 2 data.
- **Missing Global Coverage**: While Finnhub covers US equities well, European and Asian markets may have missing fundamental data.

## Technical Debt & Scaling Issues
- **In-Memory Cache limitation**: `cache_service.py` uses a Python dictionary. If the backend scales to 5 worker processes, each worker has its *own* cache, defeating the purpose and quintupling API calls to yfinance. This must be migrated to **Redis**.
- **Synchronous ML Inference**: Running `SentimentIntensityAnalyzer` inside the request-response cycle works for low volume, but during traffic spikes, it blocks the event loop.

## AI Limitations
- **Heuristic, Not Deep Learning**: The `prediction_service` is just a mathematical rule engine. It cannot recognize complex chart patterns (e.g., Head & Shoulders) or ingest macroeconomic trends.
- **NLP Context**: VADER analyzes sentiment on a sentence-by-sentence basis. It cannot understand sarcasm or complex financial nuance (e.g., "Inflation rose, which is bad for tech but the company beat earnings").

## Security Gaps
- **Lack of Backend Rate Limiting**: A malicious user could spam `/api/report/AAPL` rapidly. Even with caching, it wastes CPU cycles.
- **No 2FA implementation** for user accounts currently.


# 25 - FUTURE ROADMAP

## Short-Term Roadmap (0-3 Months)
- **Redis Migration**: Replace the in-memory python dictionary cache with Redis for true multi-worker horizontal scaling.
- **Enterprise Data Provider**: Swap `yfinance` for a robust paid provider like Polygon.io or Alpha Vantage.
- **Background Task Queue**: Implement Celery or RQ to handle news sentiment scraping asynchronously rather than inside the user request loop.

## Medium-Term Roadmap (3-9 Months)
- **Mobile Application**: Wrap the frontend UI using Capacitor or migrate components to React Native for iOS/Android app store launches.
- **Broker Integrations**: Implement OAuth with Alpaca, Interactive Brokers, and TD Ameritrade to allow users to execute trades directly from the STOCKSEE dashboard.
- **Real-Time WebSockets**: Stream live tick data and live news flashes directly to the UI without polling.

## Long-Term AI & Institutional Roadmap (1+ Years)
- **Autonomous AI Copilot**: "Chat with your Portfolio." A GenAI interface that allows users to ask, "How will a rate hike affect my holdings?" and receive a tailored, fundamentally-driven response using RAG (Retrieval-Augmented Generation) against historical market data.
- **Predictive Intelligence (Deep Learning)**: Train bespoke Transformer models on the proprietary OHLCV database collected by STOCKSEE over time to generate probabilistic price corridors.
- **Enterprise / B2B Whitelabeling**: Package the dashboard and AI signal engine into an embeddable widget for smaller banks and regional wealth management firms.


# 26 - COMPETITOR ANALYSIS

## 1. TradingView
- **Strengths**: The undisputed king of charting. Massive community, PineScript for custom indicators, deep global data.
- **Weaknesses**: The UI is incredibly overwhelming for beginners. AI features are lacking; relies heavily on manual technical analysis.
- **STOCKSEE Advantage**: STOCKSEE distills the complexity into a single "Bullish/Bearish" AI signal. We summarize the noise.

## 2. Yahoo Finance
- **Strengths**: High traffic, universally known, decent free data.
- **Weaknesses**: Cluttered with ads, outdated UI, terrible portfolio tracking interface.
- **STOCKSEE Advantage**: STOCKSEE offers a modern, ad-free, dark-mode glassmorphic interface that feels like a premium SaaS product, not an early 2000s portal.

## 3. Bloomberg Terminal / Refinitiv Eikon
- **Strengths**: The gold standard. Institutional depth, proprietary chat networks, unbreakable data feeds.
- **Weaknesses**: Costs ~$25,000/year. Completely inaccessible to retail.
- **STOCKSEE Advantage**: "Bloomberg for the Retail Guy." 80% of the actionable insight for 1% of the cost.

## 4. Robinhood / Webull
- **Strengths**: Excellent UI, zero-commission trading integration.
- **Weaknesses**: Intentionally gamified, lacks deep analytical tools, pushes users toward risky options trading rather than informed investing.
- **STOCKSEE Advantage**: An agnostic analytical layer that sits *above* the broker.

## Conclusion
STOCKSEE occupies the whitespace between Robinhood (too simple) and TradingView (too complex). It is for the user who wants institutional-grade AI signals handed to them in a beautiful, easy-to-read dashboard without having to write PineScript or parse SEC filings.


# 27 - FUTURE BUSINESS OPPORTUNITIES

## 1. API Marketplace (Data as a Service)
Once STOCKSEE has amassed a large proprietary database of calculated indicators and aggregated sentiment scores (e.g., "The STOCKSEE Retail Fear Index"), this data can be packaged and sold via a REST API to quantitative hedge funds seeking alternative data sources.

## 2. Premium Research & Signals Subscription
Introduce a $49/mo "STOCKSEE Black" tier that offers:
- SMS/Push notifications for immediate AI signal changes (e.g., "AAPL just shifted from Neutral to Bullish Setup").
- Weekly PDF market reports auto-generated by the LLM Copilot.

## 3. Wealth Management Portals (B2B SaaS)
Independent Financial Advisors (IFAs) struggle to provide modern digital experiences to their clients. STOCKSEE can be white-labeled: advisors pay $500/mo to give their clients access to a branded version of the dashboard.

## 4. Investment Education (EdTech)
Expand the "Academy" (`Learn.tsx`) into a full paid course ecosystem. Users learn how to trade using STOCKSEE, creating a massive top-of-funnel acquisition channel.


# 28 - COMPLETE DATA INVENTORY

| Data Type | Source | Purpose | Storage | Sensitivity | Lifecycle / Retention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Profiles** | Supabase Auth | Authentication | `profiles` | High (PII) | Indefinite until account deletion. |
| **Watchlists** | User Input | Dashboard customization | `watchlist` | Medium | Indefinite. |
| **Portfolio Data** | User Input | P&L tracking | `user_portfolio` | High (Financial) | Indefinite. RLS protected. |
| **Market Quotes** | yfinance | Live price display | `market_data_cache` | Low (Public) | Pruned/overwritten every 5 mins. |
| **Historical OHLCV**| yfinance | Charts & Technicals | `ohlcv_cache` | Low (Public) | Overwritten daily. |
| **News Headlines** | Finnhub | Display & Sentiment | `news_articles` | Low (Public) | Rolling 30-day window. |
| **Sentiment Scores**| VADER / FinBERT | AI Signal Generation | `sentiment_scores` | Low (Derivative) | Rolling 30-day window. |
| **Tech Indicators** | Calculated internal | AI Signal Generation | `technical_indicators`| Low (Derivative) | Overwritten daily. |


# 29 - DEVELOPMENT HISTORY

## Phase 1: The Monolith MVP
- **Architecture**: Originally conceived as a standard dashboard. The frontend was built rapidly using Vite and Tailwind. 
- **Design Decisions**: `shadcn/ui` was chosen over heavy frameworks like Material-UI to maintain absolute control over the DOM and ensure a sleek, dark-mode aesthetic.

## Phase 2: The Data Crisis
- **Problem**: Direct API calls to yfinance from the frontend were impossible due to CORS. Calling them from the backend resulted in severe rate limiting and 5-second load times.
- **Refactoring**: Implemented the `cache_service.py`. The backend was decoupled into a strict Controller-Service pattern.
- **Lesson Learned**: Financial APIs are inherently flaky and rate-limited. Graceful degradation (the `FallbackResponse` architecture) is not optional; it is mandatory for user retention.

## Phase 3: The Intelligence Layer
- **Evolution**: Raw charts weren't enough. Users demanded analysis.
- **Implementation**: The NLP engine (`sentiment_service.py`) and the heuristic signal engine (`signal_service.py`) were built to condense data into actionable text.

## Phase 4: Current State
- Moving towards real database persistence (Supabase) for user data and SQLite for local rapid development.


# 30 - EXECUTIVE SUMMARY

## CTO-Level Technical & Business Report: STOCKSEE

### What Has Been Built
STOCKSEE is a highly responsive, beautifully designed retail trading terminal. It successfully integrates real-time market data, technical indicator calculation, and NLP sentiment analysis into a cohesive, non-blocking user interface. The foundation (React/Vite/FastAPI/Supabase) is rock solid and represents modern best practices.

### Engineering & Product Readiness
- **Frontend**: **8/10**. The UI is exceptional. It looks like a premium, established SaaS product. State management via TanStack Query is robust.
- **Backend**: **6/10**. The API structure is clean, and the `FallbackResponse` error handling is excellent. However, the in-memory cache and lack of async task queues (Celery/Redis) prevent true horizontal scaling.
- **AI/ML**: **4/10**. The current "AI" is a heuristic rules engine combined with basic VADER sentiment. It is effective for an MVP, but the platform needs real deep learning (LSTM/Transformers) to claim true predictive intelligence.

### Technical Strengths
1. **Exceptional UI/UX**: Will instantly capture user attention and trust.
2. **Graceful Degradation**: The app never crashes. It simply falls back to cached or demo data.
3. **Decoupled Architecture**: Ready for mobile app development tomorrow.

### Technical Weaknesses
1. Reliance on `yfinance` is a single point of failure for production.
2. Lack of Redis/Celery for heavy NLP tasks limits concurrent user capacity.
3. Minimal test coverage (No E2E testing).

### Investment & Commercialization Readiness
**Assessment**: Seed-Stage Ready. 

STOCKSEE is a highly investable product due to its striking interface and clear value proposition (democratizing institutional analysis). To achieve a Series A valuation, the engineering team must execute the Medium-Term Roadmap:
1. Secure a commercial data provider (Polygon).
2. Migrate caching to Redis.
3. Implement live trading execution via broker APIs.

**Final Verdict**: The codebase is clean, maintainable, and designed with the right philosophies. With a small infrastructure upgrade and aggressive marketing, STOCKSEE is positioned to capture significant market share from legacy portals like Yahoo Finance and overly complex tools like TradingView.


