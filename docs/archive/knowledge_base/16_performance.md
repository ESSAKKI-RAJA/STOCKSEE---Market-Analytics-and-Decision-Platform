# 16 - PERFORMANCE

STOCKSEE is built to feel like a rapid-fire Bloomberg terminal.

## Frontend Optimizations
1. **Caching via TanStack Query**: Once a user fetches `/report/AAPL`, returning to that page within 5 minutes results in an instantaneous load from the memory cache (`staleTime: 300000`).
2. **Lazy Loading**: React `lazy()` and `Suspense` can be used to split chunks, though Vite's default rollup configuration currently handles code splitting sufficiently.
3. **Memoization**: `React.memo` and `useMemo` are utilized in heavy rendering components like charts (`SectorHeatmap.tsx`) to prevent unnecessary re-renders on unrelated state changes.
4. **Virtualization**: Not currently implemented but required for the future Screener table when displaying 1000+ rows.

## Backend Optimizations
1. **The Mega-Endpoint (`/api/report`)**: Instead of the frontend making 6 separate HTTP calls (quote, history, news, indicators, sentiment, signal), the backend aggregates them server-side. This drastically reduces network latency.
2. **In-Memory Cache (`cache_service.py`)**: Before hitting yfinance or Finnhub, the backend checks a custom dictionary cache.
   - Saves 500ms+ per request on cache hit.
   - Prevents API rate limits.
3. **Graceful NLP Degradation**: The `DISABLE_FINBERT=1` flag drops the heavy 400MB HuggingFace transformer model in favor of the lightweight, dictionary-based VADER model. This is critical for running on low-memory edge/free-tier servers.

## Scalability & Load Balancing
Currently, the backend runs as a single Uvicorn worker process. To scale horizontally, Gunicorn should be deployed with multiple Uvicorn worker classes (`gunicorn -w 4 -k uvicorn.workers.UvicornWorker`).
