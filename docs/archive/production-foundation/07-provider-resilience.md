# 07 - Provider Resilience

## Fallback Mechanisms
- When `yfinance` or `Finnhub` fail, the backend degrades gracefully to `mode="demo"` or `mode="fallback"`.
- It does not fabricate live data; the frontend transparently alerts the user.