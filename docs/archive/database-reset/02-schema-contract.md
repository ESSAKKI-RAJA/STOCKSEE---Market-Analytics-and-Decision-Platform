# Database Schema Contract (Phases 3 & 4)

## Definitive Table Inventory

| Table | Model | Purpose | PK | FKs | Indexes |
|---|---|---|---|---|---|
| `users` | `User` | Core identity mapped to Clerk | `id` (String 255) | None | `email` |
| `user_preferences` | `UserPreference` | UI/Risk settings | `id` (String UUID) | `user_id` -> `users.id` | `user_id` (Unique) |
| `user_portfolio` | `UserPortfolio` | Owned assets | `id` (String UUID) | `user_id` -> `users.id` | `user_id`, `symbol` |
| `user_watchlists` | `UserWatchlist` | Monitored assets | `id` (String UUID) | **MISSING** (Needs `user_id` -> `users.id`) | `symbol`, `(user_id, symbol)` |
| `company_profiles` | `CompanyProfile` | Static asset data | `symbol` (String 50) | None | None |
| `ohlcv_cache` | `OHLCVCache` | Historical prices | `id` (String UUID) | None | `symbol` |
| `technical_indicators` | `TechnicalIndicator`| TA math cache | `id` (String UUID) | None | `symbol` |
| `market_data_cache` | `MarketDataCache` | Live quote cache | `id` (String UUID) | None | `symbol`, `endpoint_type`, `created_at` |
| `news_articles` | `NewsArticle` | Finnhub cache | `id` (String UUID) | None | `symbol`, `created_at` |
| `sentiment_scores` | `SentimentScore` | VADER analysis | `id` (String UUID) | None | `symbol`, `created_at` |
| `ai_reports` | `AIReport` | Intelligence Core | `id` (String UUID) | None | `symbol`, `created_at` |
| `source_logs` | `SourceLog` | Provider tracing | `id` (String UUID) | None | `symbol`, `created_at` |
| `api_health_logs` | `ApiHealthLog` | Resilience logs | `id` (String UUID) | None | `created_at` |

## Clerk ID Compatibility (Phase 4)
- **Identity Storage**: `users.id` is a `String(255)`. This is strictly compatible with Clerk's standard format (e.g., `user_2W1O...`). No auto-increment integer IDs are introduced, ensuring a 1:1 map.
- **Ownership**: `user_preferences` and `user_portfolio` correctly define foreign keys tying back to `users.id` with `ondelete="CASCADE"`.
- **Gap Identified**: `user_watchlists` does not define a formal foreign key for `user_id`, originally marked `# nullable for local/demo`. To satisfy the absolute rule ("No user-owned record should be capable of becoming detached accidentally"), we must add a formal `ForeignKey("users.id", ondelete="CASCADE")`. The field can remain nullable if demo users are strictly required, but the foreign key constraint must exist for real users.
