# 08 - Cache Resilience

## Database Cache
- The N+1 batch endpoint successfully hits the database cache (`get_cached_payload`).
- **Performance measured**: Cache misses take ~2s per symbol due to external calls. Cache hits resolve locally in milliseconds.
- Redis is deferred. The database cache is sufficiently fast.