# 11 - Monitoring Test Plan

## N+1 Verification
- Create a watchlist of 10 items.
- Ensure the network tab shows exactly 1 request to fetch intelligence, not 10.

## Change Detection Verification
- Manually edit `localStorage` to mock an old "Bullish" state for a stock that is currently "Neutral".
- Verify it appears in "NEEDS ATTENTION".