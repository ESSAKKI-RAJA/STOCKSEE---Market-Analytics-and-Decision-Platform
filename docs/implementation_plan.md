# Implementation Plan: STOCKSEE Real-Data MVP Upgrade (Phase 2)

This plan outlines the systematic steps to transition STOCKSEE from a demo-runnable application to a trustworthy, real-data MVP, without overbuilding advanced ML models or trading functionality.

## Objective
To ensure STOCKSEE provides genuine financial analysis using actual market data, while honestly and visibly communicating the mode (real vs. fallback), data source, and confidence levels across both backend APIs and frontend UI components.

## Proposed Changes

### Phase 1 — Preserve Reports
- Create the `docs/` folder in the project root.
- Copy the previously generated reports (`STOCKSEE_ENGINE_PHASE_AUDIT_REPORT.md`, `STOCKSEE_FULL_ENGINE_PHASE_DEBUG_REPORT.md`, `walkthrough.md`) from the system artifact directory into the new `docs/` folder.

### Phase 2 — Real Market Data Verification
- **Update**: `backend/app/services/market_data_service.py`
- **Actions**:
  - Verify `yfinance` properly fetches and maps data for US (`AAPL`, `MSFT`) and NSE (`RELIANCE.NS`) symbols.
  - Implement a rigorous try-except block to return structured JSON errors (with `mode="unavailable"`) instead of crashing on invalid symbols.
  - Ensure the fallback/demo behavior triggers *only* if the external API request completely fails, and is strictly labeled.

### Phase 3 — Finnhub Real News Integration
- **Update**: `backend/app/services/news_service.py`
- **Actions**:
  - Implement the actual HTTP request to Finnhub using `requests`.
  - Condition this fetch strictly on the presence of `FINNHUB_API_KEY` from environment variables.
  - Normalize Finnhub response arrays into the expected schema (headline, source, url, published_at, summary).
  - Implement deduplication logic based on headlines/URLs.
  - If the key is missing or the request fails, return clearly labeled fallback news.

### Phase 4 — Sentiment Correctness
- **Update**: `backend/app/services/sentiment_service.py`
- **Actions**:
  - Enforce logic that prevents generating a sentiment score if the input news list is empty.
  - Return explicit "Unavailable" / "Neutral" states rather than scoring zero.
  - Maintain VADER as the active engine and document FinBERT as a future MVP+ requirement.

### Phase 5 — Technical Indicator Accuracy
- **Update**: `backend/app/services/indicator_service.py`
- **Actions**:
  - Add explicit handling for DataFrames with insufficient rows (e.g., returning early if `< 20` rows exist for SMA-20).
  - Replace `NaN` values with `None` or zeroes dynamically to prevent React frontend rendering crashes.

### Phase 6 — Prediction Engine Honesty
- **Update**: `backend/app/services/prediction_service.py`
- **Actions**:
  - Ensure logic remains a straightforward trend projection.
  - Explicitly hardcode the `limitations` output to enforce the "Experimental trend projection" label. No Prophet or LSTM integrations will be added.

### Phase 7 — Signal Engine Explainability
- **Update**: `backend/app/services/signal_service.py`
- **Actions**:
  - Enforce analysis-safe labels (`Bullish Setup`, `Bearish Setup`, `Neutral / Wait`, `High Uncertainty`, `Risk Elevated`).
  - Add logic that significantly discounts the `confidence` score if upstream engines report `missing_data` or `fallback` mode.

### Phase 8 — Database Persistence Plan
- **Update**: `backend/app/models/` and `backend/alembic/`
- **Actions**:
  - Define initial SQLAlchemy ORM models for `user_watchlists`, `market_data_cache`, `news_articles`, `sentiment_scores`, `ai_reports`, `source_logs`, and `api_health_logs`.
  - Ensure columns for `symbol`, `created_at`, `source`, and `mode` are present.
  - Generate a safe, additive Alembic migration.

### Phase 9 — Watchlist Production Path
- **Update**: `backend/app/services/watchlist_service.py`
- **Actions**:
  - Implement **Option B**: Maintain the demo-local watchlist logic for immediate use (due to incomplete Supabase Auth context in FastAPI), but heavily document the exact DB steps required for the impending Auth integration phase.

### Phase 10 — Frontend Honesty and UX
- **Update**: React components across `frontend/src/`
- **Actions**:
  - Render explicit UI badges displaying `mode` (Real/Demo/Fallback), `source`, `generated_at`, and `confidence`.
  - Ensure the "Analysis-only disclaimer" is visible on all relevant report and signal components.

### Phase 11 — Verification Script
- **Update**: `backend/scripts/verify_stocksee.py`
- **Actions**:
  - Create a standalone Python script that loops through the required test endpoints using the `requests` library.
  - Print PASS/FAIL alongside the returned `mode` and `source` for each required symbol (`AAPL`, `RELIANCE.NS`, `INVALID_SYMBOL_TEST`).

### Phase 12 — Final Report
- **Update**: `docs/STOCKSEE_REAL_DATA_MVP_UPGRADE_REPORT.md`
- **Actions**:
  - Generate the final summary report verifying what has been upgraded to real data, what remains on fallback, and exact run commands.

---

## User Review Required

> [!WARNING]
> Please review this implementation plan. The goal is to enforce brutal honesty regarding data availability and safety of analysis, actively refusing to fake data or output overconfident financial advice. Once approved, I will begin execution with Phase 1 and proceed through the entire checklist.
