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
