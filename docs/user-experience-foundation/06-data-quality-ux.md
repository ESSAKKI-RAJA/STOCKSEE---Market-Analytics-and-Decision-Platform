# 06 - Data Quality UX

## Purpose
To ensure users never confuse Demo data with Real data, and to explain *why* confidence might be capped at Low.

## UX Mapping
The `/api/report/{symbol}` returns `_meta.mode` (e.g. `real`, `demo`, `fallback`, `stale_cache`) and `limitations`.

The UI will display a persistent badge or footer on the Decision Snapshot.
- If `mode === "demo"`, the badge will clearly state "Using Demo Data - Analysis Highly Limited".
- The limitations array will be accessible via a small tooltip or info icon for advanced users who want to know the exact missing providers.