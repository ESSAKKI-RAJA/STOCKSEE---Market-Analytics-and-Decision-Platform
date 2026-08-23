# 07 - CACHE STRATEGY

## 1. Cache Implementation Reality vs. Documentation
**CRITICAL FINDING**: The product documentation repeatedly references an "in-memory cache". However, an audit of `cache_service.py` proves this to be false. 
The system actively uses SQLAlchemy (`SessionLocal()`) to serialize and store API payloads as JSON blobs in the database tables defined in `cache_models.py` (`market_data_cache`, `news_articles`, `sentiment_scores`).

## 2. TTL Strategy
- **Quotes**: 5 minutes (`expires_at` column)
- **Indicators**: 6 hours
- **News**: 3 hours (calculated dynamically from `created_at`)
- **Sentiment**: 3 hours
- **Historical OHLCV**: 6 hours

## 3. The `stale_cache` Fallback Mechanism
If an external API (like yfinance) fails, `get_market_quote()` explicitly attempts to retrieve a `stale_cache` payload. If found, it returns the stale data to the frontend but overrides `_meta.mode = "stale_cache"`. This allows the application to stay online during provider outages while remaining honest with the user.

## 4. The Redis Decision
### Should Redis be implemented NOW? (Phase 07)
**Decision**: DO NOT IMPLEMENT REDIS IN THIS BIN.

**Reasoning**:
1. **Current DB Cache works**: Because the cache is actually backed by PostgreSQL (in production) rather than a local Python dictionary, it already solves the "multi-worker state sharing" problem. All Uvicorn workers on Render share the same Supabase database.
2. **Cost/Complexity**: Adding a Redis cluster introduces infrastructure complexity and potential costs that violate the "Free-First" requirement unless strictly necessary.
3. **Database Strain**: While querying large JSON blobs from Postgres is slower than Redis, the current traffic volume does not warrant an immediate architectural shift. 

### Implementation Strategy (Future)
When database read/write latency becomes the bottleneck, Redis should replace `cache_service.py`'s SQLAlchemy calls. The schema mapping is already perfect for Redis Key-Value pairs:
- Key: `stocksee:cache:{endpoint_type}:{symbol}`
- Value: JSON Payload
- Expiry: Native Redis TTL.
