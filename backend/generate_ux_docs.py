import os

docs_dir = r"d:\PROJECTS\STOCKSEE\docs\user-experience-foundation"
os.makedirs(docs_dir, exist_ok=True)

files = {
    "01-user-decision-journey.md": """# 01 - User Decision Journey

## Core Decision
The fundamental decision an investor makes when viewing a stock page is **not** "should I immediately buy this stock", but rather **"should I spend more time analyzing this stock?"**.

## The Current Broken Journey
1. User searches for a stock (e.g. AAPL).
2. The user is presented with a standard dashboard of charts, a mock "AI Quant Engine" scoring 85/100, and a long unstructured Markdown summary hidden behind a button.
3. The user has to read fake indicators, synthesize the text block, and decide manually if the setup is good or not.
4. If there is a contradiction, it is obscured by averages.

## The Target First-Principles Journey
1. **Discover**: Search for a stock via the `Analyse` page.
2. **Understand**: The `StockDetail` page loads, presenting a massive, clear **Decision Snapshot** (e.g. `BULLISH SETUP`, `ELEVATED RISK`, `MODERATE CONFIDENCE`).
3. **Analyze**: The user looks immediately below the snapshot to see **WHY?** (the explicit Bullish/Bearish evidence) and **WHAT CONFLICTS?** (the explicitly detected contradictions).
4. **Decide**: The user reads the **Scenario** (what to expect) and decides to either add it to the Watchlist or move on.
5. **Monitor**: The Watchlist page lists the stored stocks with their top-level Signal/Risk/Confidence.
""",

    "02-current-frontend-audit.md": """# 02 - Current Frontend Audit

## Findings from the Frontend Review

1. **Information Hierarchy**: The current `StockDetail.tsx` relies on fake, hardcoded UI components. Specifically, `CoreQuestionsOverview.tsx` hardcodes values like "Gross Margin 45.2%" and "ROE 24.8%". `AIInsightCard.tsx` renders a fake Quant Engine display. 
2. **API Waterfalls**: The frontend fires multiple requests. `AIAdvisor` triggers `/api/ai/report`, while `useStockAnalysis` triggers `/api/report/{symbol}` independently.
3. **Cognitive Overload**: The user is blasted with fake progress bars, fake institutional flows, and random indicators. The real intelligence generated in Bin 4 is completely hidden behind an "AI Report" button that just dumps raw Markdown on the screen.
4. **Poor Terminology**: Words like "Quant Engine Pro" and "Institutional AI" are used, violating the principle of analytical honesty.

## Verdict
The frontend is a classic "data dump" that pretends to be a Bloomberg terminal. We must delete the fake components (`CoreQuestionsOverview`, `AIInsightCard`) and replace them with a single, massive **Decision Snapshot** component that consumes the real `/api/report/{symbol}` response.
""",

    "03-stock-analysis-experience.md": """# 03 - Stock Analysis Experience

The primary stock analysis screen (`StockDetail.tsx`) will be fundamentally redesigned to remove fake information and prioritize the Bin 4 Intelligence Core.

## The New Layout
1. **Identity & Pricing**: (Existing) The top header showing symbol, price, and basic quote data remains.
2. **Decision Snapshot**: A new component directly below the header. It will cleanly display the primary Signal, Confidence, and Risk levels.
3. **Evidence Panel**: A two-column (or responsive) layout. One side shows **WHY?** (Bullish/Bearish Evidence strings). The other side shows **WHAT CONFLICTS?** (Contradictions).
4. **Scenario Projection**: A clear textual block showing the expected market action based on current constraints.
5. **Data Quality Footer**: A transparent banner explaining exactly where the data came from (e.g. "Real", "Demo", "Stale").
""",

    "04-decision-snapshot.md": """# 04 - Decision Snapshot

## Purpose
The Decision Snapshot replaces the "Quant Engine Pro" and fake AI progress bars. It provides the user with an immediate, 3-second understanding of the stock's current analytical state.

## UX Mapping
The `/api/report/{symbol}` endpoint returns:
- `data.final_analysis_summary` (contains the Signal and Confidence, as well as the evidence list).
- `data.risk_factors` (contains the Risk Level)

The UI will parse these fields to extract the top-level labels (e.g. `BULLISH SETUP`, `ELEVATED RISK`, `HIGH CONFIDENCE`) and render them prominently using semantic coloring (but not *only* color, to preserve accessibility).
""",

    "05-evidence-conflict-ux.md": """# 05 - Evidence & Conflict UX

## Purpose
To answer the "Why?" without forcing the user to decipher a massive Markdown wall or raw indicator values.

## UX Mapping
The `/api/report/{symbol}` returns `final_analysis_summary` containing explicit substrings like `Bullish Evidence: ... | Bearish Evidence: ... | Key Conflicts Detected: ...`.

The UI will split this string into arrays and render them as clean bulleted lists with appropriate icons (e.g., green checkmarks for evidence, yellow warning triangles for conflicts).

If there are no conflicts, a lightweight "No major conflicts detected" state will be shown instead of an empty box.
""",

    "06-data-quality-ux.md": """# 06 - Data Quality UX

## Purpose
To ensure users never confuse Demo data with Real data, and to explain *why* confidence might be capped at Low.

## UX Mapping
The `/api/report/{symbol}` returns `_meta.mode` (e.g. `real`, `demo`, `fallback`, `stale_cache`) and `limitations`.

The UI will display a persistent badge or footer on the Decision Snapshot.
- If `mode === "demo"`, the badge will clearly state "Using Demo Data - Analysis Highly Limited".
- The limitations array will be accessible via a small tooltip or info icon for advanced users who want to know the exact missing providers.
""",

    "07-watchlist-experience.md": """# 07 - Watchlist Experience

## Purpose
The Watchlist should not just be a list of prices; it should be a list of *decisions*.

## Target UX
Currently, the Watchlist lists symbols. In the future (or if time permits in this Bin), the Watchlist table should include columns for Signal, Confidence, and Risk, allowing the user to scan their portfolio for immediate actionable setups.

*Note: For Bin 5, if modifying the Watchlist is too complex without backend changes, we will focus solely on the primary Stock Analysis page.*
""",

    "08-loading-error-states.md": """# 08 - Loading & Error States

## UX Strategy
We will eliminate the jarring "Loading..." text and instead use Skeleton loaders that mimic the final layout of the Decision Snapshot. 

If the backend returns a fallback or error, the UI will gracefully degrade, displaying the available data (e.g. just the price) while clearly noting that the Intelligence Core is unavailable, instead of rendering a broken component.
""",

    "09-api-efficiency-audit.md": """# 09 - API Efficiency Audit

## Current Inefficiencies
- `StockDetail.tsx` currently triggers `fetchAI` via a manual button click, which calls a separate endpoint.
- It also loads `AIInsightCard`, which fires `useStockAnalysis`, which calls `/api/report/{symbol}`.
- This creates duplicated state and fragmented data fetching.

## Target Efficiency
We will consolidate the page to rely on a single, unified call to `/api/report/{symbol}`. The entire Decision Snapshot, Evidence, and Pricing data will be driven off this single payload, eliminating waterfall requests and maximizing the use of the backend's caching layer.
""",

    "10-responsive-accessibility-audit.md": """# 10 - Responsive & Accessibility Audit

## Mobile Design
The Decision Snapshot must stack cleanly on mobile devices.
Order:
1. Snapshot (Signal/Risk/Confidence)
2. Scenario
3. Evidence (Why?)
4. Conflicts

## Accessibility
Colors alone will not be used to indicate signal direction. 
- Bullish will include an "Up" arrow or Checkmark icon.
- Bearish will include a "Down" arrow or Warning icon.
- Risk will be denoted with caution symbols.
""",

    "11-ux-test-plan.md": """# 11 - UX Test Plan

## Test Scenarios to Verify Post-Implementation
1. **Beginner Clarity**: Open AAPL. Is the Signal immediately obvious without reading a paragraph?
2. **Conflict Visibility**: Open a stock with a known conflict (e.g., via the deterministic backend test engine). Are the conflicts explicitly listed?
3. **Data Quality Warning**: Run the backend in Demo mode (no API keys). Does the UI explicitly warn the user that they are looking at Demo data?
4. **API Efficiency**: Open the network tab. Verify only ONE request goes to `/api/report/{symbol}` on page load.
""",

    "12-bin5-implementation-report.md": """# 12 - Bin 5 Implementation Report

*(This document will be updated upon completion of the implementation phase, detailing the exact components replaced in `frontend/src/`.)*
"""
}

for filename, content in files.items():
    filepath = os.path.join(docs_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Created {filename}")

print("All user experience documentation files generated successfully.")
