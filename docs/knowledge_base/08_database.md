# 08 - DATABASE

The STOCKSEE database architecture utilizes PostgreSQL (hosted on Supabase) for production and SQLite for local development (`stocksee_dev.db`). The ORM used is SQLAlchemy.

## Core Tables (SQLAlchemy Models)

### 1. `company_profiles`
- **Purpose**: Stores fundamental company information.
- **Columns**: `symbol` (PK), `company_name`, `exchange`, `currency`, `sector`, `industry`, `website`, `market_cap`, `source`, `last_updated`.

### 2. `market_data_cache`
- **Purpose**: A persistent cache for end-of-day or highly requested stock quotes to prevent hitting external APIs.
- **Columns**: `id` (PK, UUID), `symbol` (Indexed), `price`, `change`, `change_percent`, `volume`, `day_high`, `day_low`, `source`, `delay_label`, `last_updated`.

### 3. `ohlcv_cache`
- **Purpose**: Caches historical price data (Open, High, Low, Close, Volume) to speed up chart rendering and technical indicator computation.
- **Columns**: `id` (PK), `symbol` (Indexed), `timeframe`, `date`, `open`, `high`, `low`, `close`, `volume`, `source`, `last_updated`.

### 4. `technical_indicators`
- **Purpose**: Stores pre-computed MACD, RSI, and SMA values.
- **Columns**: `id` (PK), `symbol` (Indexed), `timeframe`, `sma20`, `sma50`, `sma200`, `rsi14`, `macd`, `macd_signal`, `trend`, `last_updated`.

### 5. `news_articles`
- **Purpose**: Caches news headlines from Finnhub to run historical sentiment analysis.
- **Columns**: `id` (PK), `symbol` (Indexed), `headline`, `summary`, `url`, `source`, `published_at`, `fetched_at`.

### 6. `sentiment_scores`
- **Purpose**: Stores the results of the VADER/FinBERT NLP runs so they don't have to be recalculated for every request.
- **Columns**: `id` (PK), `symbol` (Indexed), `sentiment_label`, `sentiment_score`, `confidence`, `article_count`, `last_updated`.

## User Data Tables (Typically managed via Supabase directly)
*Note: Depending on configuration, some of these reside in Supabase's `public` schema utilizing Row Level Security (RLS).*
- **`profiles`**: Links to `auth.users`. Stores name, avatar, risk tolerance.
- **`watchlist`**: Columns: `user_id`, `symbol`, `added_at`.
- **`user_portfolio`**: Columns: `id`, `user_id`, `symbol`, `quantity`, `average_buy_price`, `currency`.
- **`user_alerts`**: Columns: `id`, `user_id`, `symbol`, `condition` (e.g., 'above', 'below', 'crosses_sma20'), `threshold_price`, `is_active`.

## Data Lifecycle
1. **Cache Miss**: Request hits the API, the service queries the database. If stale (based on `last_updated`), it triggers an external API call.
2. **Upsert**: The new data is processed and written back to the respective cache table (`market_data_cache`, `ohlcv_cache`).
3. **Pruning**: Periodic cron jobs (or background tasks) can clear `ohlcv_cache` older than a specific date to save space if needed.

## Why each table exists
Instead of relying purely on an in-memory Redis cache, storing this data in SQL allows STOCKSEE to build a proprietary historical database over time, which is essential for training future machine learning models.
