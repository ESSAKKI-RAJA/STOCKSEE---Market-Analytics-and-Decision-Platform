# 11 - UX Test Plan

## Test Scenarios to Verify Post-Implementation
1. **Beginner Clarity**: Open AAPL. Is the Signal immediately obvious without reading a paragraph?
2. **Conflict Visibility**: Open a stock with a known conflict (e.g., via the deterministic backend test engine). Are the conflicts explicitly listed?
3. **Data Quality Warning**: Run the backend in Demo mode (no API keys). Does the UI explicitly warn the user that they are looking at Demo data?
4. **API Efficiency**: Open the network tab. Verify only ONE request goes to `/api/report/{symbol}` on page load.