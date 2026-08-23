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
