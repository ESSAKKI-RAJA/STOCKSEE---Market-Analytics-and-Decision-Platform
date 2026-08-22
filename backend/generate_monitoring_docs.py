import os

docs_dir = r"d:\PROJECTS\STOCKSEE\docs\monitoring-foundation"
os.makedirs(docs_dir, exist_ok=True)

files = {
    "01-monitoring-problem.md": """# 01 - Monitoring Problem

## The Problem
Users currently add stocks to a watchlist, but the watchlist only shows current price and a fake "AI Score". To see if a setup has fundamentally changed (e.g., from Bullish to Neutral), the user has to click into each stock one by one. This is tedious, leading to missed opportunities or ignored risks.

## The Goal
Transform the watchlist into an "Attention Center" that surfaces material changes in analytical setups. The system must answer: "Which of my watched stocks deserve my attention right now, and why?"
""",

    "02-material-change-definition.md": """# 02 - Material Change Definition

## Definition
A Material Change occurs when the underlying analytical Intelligence Core output meaningfully shifts between two distinct points in time. It is NOT triggered by minor price fluctuations.

## Change Matrix
1. **Signal Transition**: Shift between Bullish / Bearish / Neutral. (e.g., Bullish -> Neutral) - **HIGH PRIORITY**
2. **Confidence Deterioration**: High -> Moderate -> Low. - **HIGH PRIORITY**
3. **Risk Escalation**: Low -> Elevated -> High. - **HIGH PRIORITY**
4. **Scenario Invalidation**: A previous projection is no longer applicable. - **MODERATE PRIORITY**
5. **New Conflict**: The appearance of a new contradictory factor. - **MODERATE PRIORITY**
6. **Data Quality Degradation**: Fresh -> Stale, or Fresh -> Demo. - **WARNING**
""",

    "03-decision-state-model.md": """# 03 - Decision State Model

## Persisted State
To compare previous vs. current state without parsing the full report payload, we need a lightweight snapshot:
- `symbol` (str)
- `signal_label` (str)
- `confidence` (str)
- `risk_level` (str)
- `mode` (str)

*Note: For the Free-First, minimal API architecture, we will not store this in the database yet. Instead, we can dynamically load the current intelligence using the backend's caching layer.*
""",

    "04-watchlist-intelligence.md": """# 04 - Watchlist Intelligence API

## Current State
The frontend calls `/api/watchlist` to get an array of strings (e.g., `["AAPL", "TSLA"]`). Then the frontend maps this to real-time prices via websockets or polling.

## Target State
We need a batch endpoint `POST /api/watchlist/intelligence` that takes an array of symbols and returns their current intelligence summaries efficiently. Wait, we can just use the existing `/api/report/{symbol}` if it is fast, but an N+1 loop on the frontend is bad. 

Instead, a single API `/api/analyze/batch` or similar that utilizes `asyncio.gather` on the backend to concurrently fetch cached reports for multiple symbols.
""",

    "05-change-detection-engine.md": """# 05 - Change Detection Engine

## Deterministic Rules (No LLM)
The frontend (or backend) will compare the previous stored state (e.g. from local storage or previous session) against the freshly fetched state.

Since this is Bin 6, and we want a stateless Free-First architecture:
For a true "change" to be detected across sessions, the backend or frontend must store the *last seen* state. 
- Option A: Frontend `localStorage`. Simple, free.
- Option B: Backend database (`UserWatchlist` extended with last_signal). 

To keep database migrations to zero (per safety rules), we will use **Option A (Frontend `localStorage`)** to track the user's "Last Seen" state.
""",

    "06-monitoring-api-contract.md": """# 06 - Monitoring API Contract

## New Endpoint: `POST /api/watchlist/intelligence`
Since `GET /api/report/{symbol}` is heavy, we will create a lightweight batch fetcher in the backend that pulls from cache primarily.
**Request**:
```json
{
  "symbols": ["AAPL", "MSFT"]
}
```
**Response**:
```json
{
  "status": "ok",
  "data": {
    "AAPL": { "signal": "Bullish Setup", "confidence": "High", "risk": "Low" },
    "MSFT": { "signal": "Neutral", "confidence": "Moderate", "risk": "Elevated" }
  }
}
```
""",

    "07-refresh-strategy.md": """# 07 - Refresh Strategy

## On-Demand Monitoring
To adhere to Free-First principles and avoid spamming external APIs (like Finnhub or yfinance):
1. Intelligence is refreshed **when the user opens the Watchlist page**.
2. A "Refresh Intelligence" button allows manual triggering.
3. No continuous backend background workers (Celery/Redis) will be introduced.
""",

    "08-attention-prioritization.md": """# 08 - Attention Prioritization

The Watchlist UI will sort items into three distinct sections:
1. **NEEDS ATTENTION**: Stocks that had a negative material change (Signal downgrade, Risk increase, Confidence drop).
2. **CHANGED**: Positive material changes or neutral shifts.
3. **STABLE**: No material changes detected since last viewed.
""",

    "09-change-explanation-ux.md": """# 09 - Change Explanation UX

## Explainability
When a stock is in the "NEEDS ATTENTION" section, the UI will clearly state:
"TSLA changed from Bullish -> Neutral."
"Risk escalated from Low -> Elevated."

The user can click to expand and see the actual Bin 4 Report summary string to understand *Why*.
""",

    "10-monitoring-security.md": """# 10 - Monitoring Security

## Watchlist Ownership
The existing `get_watchlist` API already uses `current_user.id` from Clerk. We will strictly use the JWT token to fetch the watchlist symbols. 

For the Batch Intelligence endpoint, since it only returns public market analysis (not user data), it is safe to accept an array of symbols from the frontend.
""",

    "11-monitoring-test-plan.md": """# 11 - Monitoring Test Plan

## N+1 Verification
- Create a watchlist of 10 items.
- Ensure the network tab shows exactly 1 request to fetch intelligence, not 10.

## Change Detection Verification
- Manually edit `localStorage` to mock an old "Bullish" state for a stock that is currently "Neutral".
- Verify it appears in "NEEDS ATTENTION".
""",

    "12-bin6-implementation-report.md": """# 12 - Bin 6 Implementation Report
(To be updated upon completion)
"""
}

for filename, content in files.items():
    filepath = os.path.join(docs_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Created {filename}")

print("All monitoring documentation files generated successfully.")
