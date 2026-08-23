# 01 - PostgreSQL Schema Final

## Overview
The final schema consists of the following 10 tables:
1. `users` (Auth ID string, PK)
2. `user_preferences` (User config, FK `users.id`)
3. `user_watchlists` (User symbols)
4. `user_portfolio` (User holdings, FK `users.id`)
5. `ai_reports` (Report cache, JSON payload)
6. `api_health_logs` (System health)
7. `market_data_cache` (Financial payload cache, JSON payload)
8. `news_articles` (News cache, JSON payload)
9. `sentiment_scores` (Sentiment cache, JSON payload)
10. `source_logs` (Provider latency tracking)

## Identifiers
- User IDs are handled as `VARCHAR(255)` because Clerk uses string-based identifiers (e.g. `user_2...`).
- Caches heavily leverage the native `JSON` type.