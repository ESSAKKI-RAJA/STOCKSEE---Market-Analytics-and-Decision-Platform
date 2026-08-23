# 03 - PRODUCT REQUIREMENTS DOCUMENT (PRD)

*Priority Key: P0 = Essential, P1 = Important, P2 = Useful, P3 = Future Roadmap*
*Status Key: Implemented, Partially Implemented, Planned, Explicitly Deferred*

---

## A. CORE PRODUCT REQUIREMENTS
- **REQ-A1**: The platform must serve as a unified terminal consolidating market data, news, and technical analysis into a single interface.
  - **Priority**: P0
  - **Status**: Implemented (`Frontend Layout, Dashboard`)
- **REQ-A2**: The system must provide a stock screener to filter assets by technical and fundamental metrics.
  - **Priority**: P1
  - **Status**: Partially Implemented (Frontend UI built, backend needs optimization)

## B. MARKET DATA REQUIREMENTS
- **REQ-B1**: Fetch and display real-time or EOD stock quotes.
  - **Priority**: P0
  - **Status**: Implemented (`market_data_service.py` via yfinance)
- **REQ-B2**: Fetch and store historical OHLCV data for charting.
  - **Priority**: P0
  - **Status**: Implemented (`get_market_history` endpoint)
- **REQ-B3**: Integrate with institutional-grade tick data providers (e.g., Polygon).
  - **Priority**: P3
  - **Status**: Explicitly Deferred (Roadmap item)

## C. ANALYTICS REQUIREMENTS
- **REQ-C1**: Compute technical indicators: SMA, RSI, MACD.
  - **Priority**: P0
  - **Status**: Implemented (`indicator_service.py` using Pandas)
- **REQ-C2**: Calculate asset volatility.
  - **Priority**: P1
  - **Status**: Implemented (used for "Risk Elevated" flag)

## D. AI / INTELLIGENCE REQUIREMENTS
- **REQ-D1**: Generate a combined Bullish/Bearish/Hold signal based on technicals and sentiment.
  - **Priority**: P0
  - **Status**: Implemented (`signal_service.py`)
- **REQ-D2**: Deep-learning LSTM price forecasting.
  - **Priority**: P3
  - **Status**: Explicitly Deferred (Currently uses heuristic trend projection)

## E. NEWS / SENTIMENT REQUIREMENTS
- **REQ-E1**: Fetch recent financial news for a specific asset.
  - **Priority**: P1
  - **Status**: Implemented (`news_service.py` via Finnhub)
- **REQ-E2**: Run Natural Language Processing (NLP) to generate a sentiment score (-1 to 1).
  - **Priority**: P0
  - **Status**: Implemented (`sentiment_service.py` via VADER, FinBERT disabled by default for memory reasons)

## F. WATCHLIST REQUIREMENTS
- **REQ-F1**: Users can add or remove stocks from a personal watchlist.
  - **Priority**: P0
  - **Status**: Implemented (Backend: `watchlist_service.py`, DB: Supabase)

## G. PORTFOLIO REQUIREMENTS
- **REQ-G1**: Users can track holdings, entry prices, and calculate real-time P&L.
  - **Priority**: P1
  - **Status**: Implemented (`Portfolio.tsx`, `user_portfolio` table)

## H. ALERT REQUIREMENTS
- **REQ-H1**: Users can set price thresholds and receive notifications when crossed.
  - **Priority**: P2
  - **Status**: Partially Implemented (Frontend polling/local state, needs robust backend worker queue)

## I. AUTHENTICATION REQUIREMENTS
- **REQ-I1**: Secure user authentication via Email/Password and OAuth.
  - **Priority**: P0
  - **Status**: Implemented (Supabase Auth / Clerk hybrid config)
- **REQ-I2**: Row Level Security (RLS) to ensure users can only access their own data.
  - **Priority**: P0
  - **Status**: Implemented (Supabase PostgreSQL RLS)

## J. USER EXPERIENCE REQUIREMENTS
- **REQ-J1**: UI must follow a dark-mode first, glassmorphism aesthetic.
  - **Priority**: P0
  - **Status**: Implemented (Tailwind, shadcn/ui, `index.css`)
- **REQ-J2**: The UI must never block or crash while waiting for data.
  - **Priority**: P0
  - **Status**: Implemented (TanStack Query for asynchronous fetching)

## K. PERFORMANCE REQUIREMENTS
- **REQ-K1**: Implement server-side data aggregation to minimize client requests.
  - **Priority**: P0
  - **Status**: Implemented (The MEGA-ENDPOINT `/api/report/{symbol}` aggregates all data)
- **REQ-K2**: Aggressive API caching to prevent rate-limit failures and reduce latency.
  - **Priority**: P0
  - **Status**: Implemented (`cache_service.py` TTL dict)

## L. SECURITY REQUIREMENTS
- **REQ-L1**: Sensitive API keys must be isolated in `.env` and never exposed to the client.
  - **Priority**: P0
  - **Status**: Implemented
- **REQ-L2**: API rate limiting via `slowapi` to prevent abuse.
  - **Priority**: P2
  - **Status**: Planned (Currently absent, relying on hosting provider)

## M. DATA QUALITY REQUIREMENTS
- **REQ-M1**: Clean missing (NaN) values in historical OHLCV data before inference.
  - **Priority**: P0
  - **Status**: Implemented (Pandas interpolation)

## N. TRANSPARENCY REQUIREMENTS
- **REQ-N1**: All data points must carry metadata detailing their source (e.g., real vs. demo).
  - **Priority**: P0
  - **Status**: Implemented (`FallbackResponse` schema returns `mode` and `source`)
- **REQ-N2**: Explicitly state that AI signals are not financial advice.
  - **Priority**: P0
  - **Status**: Implemented (Returned in `limitations` string from API)

## O. FALLBACK / FAILURE REQUIREMENTS
- **REQ-O1**: If external APIs (yfinance, Finnhub) fail, the system must gracefully fall back to stale cache or static demo data.
  - **Priority**: P0
  - **Status**: Implemented (Handled in `main.py` controller and services)

## P. DEPLOYMENT REQUIREMENTS
- **REQ-P1**: Decoupled deployment (Frontend on CDN/Edge, Backend on Web Service).
  - **Priority**: P0
  - **Status**: Implemented (Vercel + Render)
