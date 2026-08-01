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
