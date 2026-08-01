# 13 - BUSINESS LOGIC

## Recommendation Engine (`signal_service.py`)

The core business logic dictating what the user sees in the "AI Advisor" is entirely encapsulated in `generate_signal()`.

### Scoring System
1. **Technical Base Score**: Starts at 50/100.
2. **Trend Modifier**: If Price > SMA20 AND RSI > 55, Trend = "Bullish" -> Add 20 points. (If Bearish, subtract 20).
3. **Momentum Modifier**: If RSI > 70 (Overbought), subtract 10 points. If RSI < 30 (Oversold), add 10 points.
4. **Sentiment Score**: Normalizes the VADER NLP score (-1 to 1) to a 0-100 scale.
5. **Final Combined Score**: `(Technical Score + Sentiment Score) / 2`.

### Ranking & Thresholds
The Final Combined Score maps to a distinct human-readable label:
- **Score > 70**: `Bullish Setup`
- **Score < 30**: `Bearish Setup`
- **30 <= Score <= 70**: `Neutral / Wait`

### Risk Logic
The system overrides normal labels if volatility is exceptionally high.
- **Condition**: `volatility > (SMA20 * 0.05)`
- **Override Label**: `Risk Elevated`

### Confidence Scoring
The platform grades its own confidence based on data availability, ensuring it never hallucinates certainty when data is missing.
- **Medium Confidence**: Both Technical data AND News Sentiment data are pulled from real external APIs (`mode == "real"`).
- **Low-Medium**: Only Technical data is real.
- **Low**: Fallback or demo data used.

## Alert Logic
Defined in the frontend via `useAlerts.ts` and triggered locally (or via backend cron in future iterations). Alerts evaluate a user-defined threshold against the live `price` from `get_market_quote()`.
