# 02 - DATA PROVIDER ANALYSIS

## 1. Primary Provider: yfinance
- **Dataset**: Quotes, Historical OHLCV, Market Cap, Volume.
- **Current Usage**: Extensive. Used by `market_data_service.py` to hydrate the mega-report.
- **Free Tier limits**: Unofficial API. Susceptible to aggressive rate limiting (IP blocking) and occasional structural changes that break the Python wrapper.
- **Historical Depth**: Excellent (decades).
- **Exchanges**: Global (NSE, BSE, NYSE, NASDAQ).
- **Risk Level**: **HIGH**.
- **Fallback Behavior**: `cache_service.py` prevents redundant calls. If the call fails, it falls back to stale cache. If no stale cache exists, it returns a static hardcoded demo object.

## 2. Primary Provider: Finnhub
- **Dataset**: Financial news headlines, summaries, and URLs.
- **Authentication**: `FINNHUB_API_KEY` in `.env`.
- **Free Tier limits**: 60 API calls per minute.
- **Historical Depth**: Up to 1 year for free tier.
- **Exchanges**: US focus, but supports global tickers. Note: STOCKSEE currently strips suffixes (e.g., `.NS`) before calling Finnhub to fetch global news.
- **Risk Level**: **MEDIUM** (Hard limits, but predictable).
- **Fallback Behavior**: If the key is missing or the limit is hit, `news_service.py` returns clearly labeled `[DEMO DATA]` headlines to prevent UI breakage.

## 3. Provider Abstraction Strategy
STOCKSEE implements a robust abstraction layer. The frontend UI does not know if data came from yfinance or Finnhub. It consumes generic `Quote`, `MarketHistory`, and `NewsArticle` internal schemas.
- **Example**: `market_data_service.py` abstracts `yfinance` pandas DataFrames into a standard JSON array of `{"date", "open", "high", "low", "close", "volume"}`.

## 4. Free-First Requirement
The current architecture complies perfectly with the free-first philosophy. By utilizing aggressive caching and graceful degradation, STOCKSEE can theoretically serve thousands of users on free-tier APIs without incurring data licensing costs, provided the cache hit rate remains high.

## 5. Replacement Options (Future)
If `yfinance` fails permanently or restricts access:
- **Polygon.io**: Excellent REST API for US Equities. Generous free tier (5 API calls/min — would require extremely aggressive caching).
- **Alpha Vantage**: Good for daily/EOD data. Free tier is 25 requests/day (severely restrictive for scale).
- **Financial Modeling Prep (FMP)**: Strong fundamental data and real-time quotes. Paid tiers required for serious scale.
