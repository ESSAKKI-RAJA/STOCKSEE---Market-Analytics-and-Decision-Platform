# PostgreSQL-Native Types (Phase 5 & 6)

## Audit & Standardization Plan

### 1. Timestamps
- Currently: All models use `DateTime(timezone=True)`.
- PostgreSQL Equivalency: This maps perfectly to `TIMESTAMP WITH TIME ZONE`. No changes required.

### 2. UUIDs vs Strings
- Currently: Identifiers that act as UUIDs (like `OHLCVCache.id` and cache keys) are declared as `String(36)` or generic `String`.
- Rule Check: "UUID -> PostgreSQL UUID where actually intended."
- Decision: We will convert these IDs to the native `sqlalchemy.dialects.postgresql.UUID(as_uuid=True)` to take full advantage of PostgreSQL's optimized 128-bit UUID type.

### 3. JSON vs JSONB
- Currently: `MarketDataCache.payload_json`, `NewsArticle.payload_json`, etc., use the standard `sqlalchemy.JSON`.
- Rule Check: "DO NOT change JSON to JSONB automatically. Use JSONB only when it provides a real benefit and does not break existing application behavior."
- Decision: Standard `JSON` is sufficient for caching provider responses as we retrieve them entirely by the row `id` or `symbol`. We do not perform complex inner-JSON indexing or partial queries. The models will retain the standard `JSON` type.

### 4. Clerk Identifiers
- `User.id`, `UserPreference.user_id`, and `UserPortfolio.user_id` are defined as `String(255)`.
- This securely stores Clerk IDs (e.g., `user_2W1...`) as `VARCHAR(255)` in PostgreSQL. No changes required.

### 5. Shared Database Cache (Phase 6)
The cache models (`market_data_cache`, `ai_reports`, etc.) store keys by `symbol` and `endpoint_type`, utilizing standard string matching and timestamp-based TTL filtering (`expires_at > now()`). 
Since Redis is forbidden by the instructions, the PostgreSQL caching mechanism is verified as correct and will port natively. The JSON payloads are safely serialized.
