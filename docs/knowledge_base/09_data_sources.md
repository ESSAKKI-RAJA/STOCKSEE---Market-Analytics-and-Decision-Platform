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
