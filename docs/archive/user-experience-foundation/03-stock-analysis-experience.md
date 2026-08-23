# 03 - Stock Analysis Experience

The primary stock analysis screen (`StockDetail.tsx`) will be fundamentally redesigned to remove fake information and prioritize the Bin 4 Intelligence Core.

## The New Layout
1. **Identity & Pricing**: (Existing) The top header showing symbol, price, and basic quote data remains.
2. **Decision Snapshot**: A new component directly below the header. It will cleanly display the primary Signal, Confidence, and Risk levels.
3. **Evidence Panel**: A two-column (or responsive) layout. One side shows **WHY?** (Bullish/Bearish Evidence strings). The other side shows **WHAT CONFLICTS?** (Contradictions).
4. **Scenario Projection**: A clear textual block showing the expected market action based on current constraints.
5. **Data Quality Footer**: A transparent banner explaining exactly where the data came from (e.g. "Real", "Demo", "Stale").