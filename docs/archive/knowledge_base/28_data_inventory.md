# 28 - COMPLETE DATA INVENTORY

| Data Type | Source | Purpose | Storage | Sensitivity | Lifecycle / Retention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Profiles** | Supabase Auth | Authentication | `profiles` | High (PII) | Indefinite until account deletion. |
| **Watchlists** | User Input | Dashboard customization | `watchlist` | Medium | Indefinite. |
| **Portfolio Data** | User Input | P&L tracking | `user_portfolio` | High (Financial) | Indefinite. RLS protected. |
| **Market Quotes** | yfinance | Live price display | `market_data_cache` | Low (Public) | Pruned/overwritten every 5 mins. |
| **Historical OHLCV**| yfinance | Charts & Technicals | `ohlcv_cache` | Low (Public) | Overwritten daily. |
| **News Headlines** | Finnhub | Display & Sentiment | `news_articles` | Low (Public) | Rolling 30-day window. |
| **Sentiment Scores**| VADER / FinBERT | AI Signal Generation | `sentiment_scores` | Low (Derivative) | Rolling 30-day window. |
| **Tech Indicators** | Calculated internal | AI Signal Generation | `technical_indicators`| Low (Derivative) | Overwritten daily. |
