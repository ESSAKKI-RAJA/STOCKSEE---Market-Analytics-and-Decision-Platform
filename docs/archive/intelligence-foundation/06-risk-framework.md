# 06 - Risk Framework

The Risk Engine identifies conditions that make a setup dangerous to trade, regardless of direction.

## Risk Factors
1. **High Volatility**: If recent historical volatility > 5% of SMA20.
2. **Extreme Over-extension**: RSI > 80 or RSI < 20.
3. **Data Risk**: Using `demo` or `stale_cache` data.
4. **Fundamental Disconnect**: Technical setup is extremely Bullish, but Sentiment is extremely Negative (or vice versa).

## Output Labels
- `LOW`: Standard market conditions, no major conflicts, real data.
- `MODERATE`: Some conflict, or slightly elevated volatility.
- `ELEVATED`: Extreme RSI, high volatility, or major directional conflict.
- `HIGH`: Demo data, missing pricing history, or extreme instability.