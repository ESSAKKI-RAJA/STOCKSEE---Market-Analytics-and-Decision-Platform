# 07 - Refresh Strategy

## On-Demand Monitoring
To adhere to Free-First principles and avoid spamming external APIs (like Finnhub or yfinance):
1. Intelligence is refreshed **when the user opens the Watchlist page**.
2. A "Refresh Intelligence" button allows manual triggering.
3. No continuous backend background workers (Celery/Redis) will be introduced.