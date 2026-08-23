# 04 - Watchlist Intelligence API

## Current State
The frontend calls `/api/watchlist` to get an array of strings (e.g., `["AAPL", "TSLA"]`). Then the frontend maps this to real-time prices via websockets or polling.

## Target State
We need a batch endpoint `POST /api/watchlist/intelligence` that takes an array of symbols and returns their current intelligence summaries efficiently. Wait, we can just use the existing `/api/report/{symbol}` if it is fast, but an N+1 loop on the frontend is bad. 

Instead, a single API `/api/analyze/batch` or similar that utilizes `asyncio.gather` on the backend to concurrently fetch cached reports for multiple symbols.