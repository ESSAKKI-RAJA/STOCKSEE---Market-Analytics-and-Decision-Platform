# 06 - API CONTRACT MAP

## 1. Core Endpoints

### Report (Mega-Endpoint)
- **GET `/api/report/{symbol}`**
  - **Auth**: None (Public).
  - **Action**: Orchestrates calls to `market_data_service`, `news_service`, `indicator_service`, `sentiment_service`, and `signal_service`.
  - **Response**: A massive nested JSON object containing Quotes, OHLCV History, Technicals, Sentiment, and the AI Signal.
  - **Fallback**: Returns the `FallbackResponse` schema on failure.

### Market Data
- **GET `/api/market/quote/{symbol}`**
  - **Action**: Fetches live price data.
- **GET `/api/market/history/{symbol}`**
  - **Action**: Fetches historical OHLCV data.
- **POST `/api/stocks/compare`**
  - **Schema**: `{"symbols": ["AAPL", "TSLA"]}`
  - **Action**: Returns an array of basic quote data for comparison.

### Watchlist CRUD
- **GET `/api/watchlist`**
  - **Action**: Returns list of watched symbols for the user.
- **POST `/api/watchlist`**
  - **Schema**: `{"symbol": "string"}`
  - **Action**: Adds symbol to watchlist.
- **DELETE `/api/watchlist/{symbol}`**
  - **Action**: Removes symbol from watchlist.

## 2. API Contract Principles
- **No Provider Leakage**: The frontend receives standard `price`, `change`, and `volume` keys, regardless of whether the backend used `yfinance` or a fallback.
- **Transparency via `_meta`**: Every nested object (e.g., `indicators`, `sentiment`) includes a `_meta` object detailing the `mode` (`real`, `stale_cache`, `demo`) and `source`. The frontend must parse this to display appropriate warning badges to the user.

## 3. Duplicate Endpoint Check
Currently, the `/api/report` mega-endpoint aggregates data that is also available individually via `/api/market/...`. This is acceptable for the main dashboard (which requires all data at once), but individual widgets should eventually migrate to calling their specific endpoints to prevent slow overall page loads (Waterfall vs. Parallel loading).
