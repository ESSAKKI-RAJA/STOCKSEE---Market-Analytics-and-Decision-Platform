# 04 - Decision Snapshot

## Purpose
The Decision Snapshot replaces the "Quant Engine Pro" and fake AI progress bars. It provides the user with an immediate, 3-second understanding of the stock's current analytical state.

## UX Mapping
The `/api/report/{symbol}` endpoint returns:
- `data.final_analysis_summary` (contains the Signal and Confidence, as well as the evidence list).
- `data.risk_factors` (contains the Risk Level)

The UI will parse these fields to extract the top-level labels (e.g. `BULLISH SETUP`, `ELEVATED RISK`, `HIGH CONFIDENCE`) and render them prominently using semantic coloring (but not *only* color, to preserve accessibility).