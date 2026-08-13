# 03 - Target Intelligence Architecture

STOCKSEE will adopt a layered analytical hierarchy to transform raw indicators into explicit decision support.

1. **DATA QUALITY ENGINE**: Inspects the `_meta` modes of incoming data (real, stale_cache, demo, fallback). Determines base confidence ceiling.
2. **TECHNICAL STATE ENGINE**: Evaluates RSI, MACD, and SMAs independently to determine Momentum, Trend, and Mean Reversion contexts.
3. **SENTIMENT STATE ENGINE**: Evaluates VADER sentiment scores.
4. **CONFLICT ENGINE**: Cross-references Technical and Sentiment states to detect logical contradictions (e.g., Bullish Trend + Overbought RSI).
5. **RISK ENGINE**: Evaluates volatility, conflicts, and data quality to flag elevated risk conditions.
6. **EVIDENCE ENGINE**: Generates explicit "Bullish Evidence" and "Bearish Evidence" strings based entirely on deterministic mathematical thresholds.
7. **EXPLANATION ENGINE**: Assembles the evidence into a structured summary.
8. **CONFIDENCE ENGINE**: Lowers confidence if data is demo, stale, or highly conflicting.