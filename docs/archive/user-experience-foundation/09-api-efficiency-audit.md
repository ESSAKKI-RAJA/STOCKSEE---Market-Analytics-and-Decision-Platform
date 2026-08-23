# 09 - API Efficiency Audit

## Current Inefficiencies
- `StockDetail.tsx` currently triggers `fetchAI` via a manual button click, which calls a separate endpoint.
- It also loads `AIInsightCard`, which fires `useStockAnalysis`, which calls `/api/report/{symbol}`.
- This creates duplicated state and fragmented data fetching.

## Target Efficiency
We will consolidate the page to rely on a single, unified call to `/api/report/{symbol}`. The entire Decision Snapshot, Evidence, and Pricing data will be driven off this single payload, eliminating waterfall requests and maximizing the use of the backend's caching layer.