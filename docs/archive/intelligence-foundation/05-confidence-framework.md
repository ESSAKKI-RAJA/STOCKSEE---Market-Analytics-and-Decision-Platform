# 05 - Confidence Framework

Confidence measures *reliability of the data and clarity of the signal*, NOT the likelihood of the stock going up.

## Calculation Hierarchy
1. **Data Quality Ceiling**:
   - If any core data is `demo` -> `Low`
   - If any core data is `stale_cache` -> `Medium` max
   - If missing news/sentiment -> `Medium` max
   - If real and fresh -> `High` potential

2. **Conflict Penalty**:
   - If `High Conflict` (e.g., Bullish Trend + Overbought RSI + Bearish MACD) -> Downgrade confidence by one level.
   - If `Low Conflict` (e.g., All indicators align) -> Maintain confidence.

3. **Data Depth Penalty**:
   - If less than 50 days of history -> Downgrade confidence by one level.