# 10 - Intelligence Test Plan

Unit tests must be implemented (or manually validated) for the following deterministic scenarios:

1. **Perfect Bullish Alignment**: SMA20 > SMA50, MACD positive, RSI = 55. Result: `Bullish Setup`, `High Confidence`, `Low Risk`.
2. **Conflict Scenario**: SMA20 > SMA50, but RSI = 85. Result: `Neutral / Wait`, `Medium Confidence`, `Elevated Risk`, Conflict explicitly stated in evidence.
3. **Data Degradation**: Input `demo` mode data. Result: `Low Confidence`, `High Risk`, Limitations clearly warn of fake data.
4. **Missing History**: Input `< 50` days of data. Result: Fallback to basic insights, Confidence capped at `Low`.