# 08 - Prediction Reassessment

## Decision
The current ±2% prediction heuristic creates false precision and implies a price target that the engine cannot mathematically support.

## Action
- Remove the `projected_price` calculation based on static percentages.
- Reframe the output to **Scenario Projection**.
- If Bullish: "Current technical evidence suggests continued upward momentum, provided support holds at SMA20."
- If Bearish: "Current technical evidence suggests downward pressure; risk of further decline until RSI reaches oversold."
- This maps to the existing API structure (`prediction_insight`) without breaking the frontend contract.