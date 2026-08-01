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
