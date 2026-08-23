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
