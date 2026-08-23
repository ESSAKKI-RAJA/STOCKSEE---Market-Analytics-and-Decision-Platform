# 04 - ANALYTICAL ENGINE

## 1. Engine Philosophy
STOCKSEE uses **deterministic Python analytics** (Pandas, NumPy) for mathematical indicators and **rules-based heuristics** for signal generation. It does not use Black-Box Machine Learning (LLMs, LSTMs) to perform basic arithmetic or to hallucinate stock predictions.

## 2. Technical Indicators (`indicator_service.py`)
All indicators are calculated using standard industry formulas via the `pandas` library on closing prices.
- **Simple Moving Averages (SMA)**: Calculated for 20-day and 50-day windows (`rolling.mean`). Used for baseline trend identification.
- **RSI (Relative Strength Index)**: 14-period Wilder's Smoothing RSI. Checks for overbought (>70) and oversold (<30) conditions.
- **MACD**: EMA(12) - EMA(26), with a 9-period signal line.
- **Volatility**: Standard deviation of closing prices over the fetched period.

*Missing Data Behavior*: If `< 2` data points exist in history, the service returns an explicitly empty object (`"available": False`).

## 3. Sentiment Analysis (`sentiment_service.py`)
- **Model**: VADER (Valence Aware Dictionary and sEntiment Reasoner).
- **Process**: Iterates through fetched Finnhub news headlines + summaries. Computes the compound polarity score (-1.0 to +1.0) for each.
- **Aggregation**: Averages the scores. `> 0.15` is Positive, `< -0.15` is Negative.

## 4. Signal Engine (`signal_service.py`)
The signal engine merges technicals and sentiment into a final, safe label.
- **Technical Score Base**: 50
- **Trend Modifier**: Bullish (+20), Bearish (-20)
- **Momentum Modifier**: RSI Oversold (+10), Overbought (-10)
- **Sentiment Modifier**: Averages the normalized VADER score.
- **Final Combined Score**: `(Tech Score + Sentiment Score) / 2`
- **Output Labels**: "Bullish Setup", "Bearish Setup", "Neutral / Wait", "High Uncertainty", "Risk Elevated".

*Conflict Handling*: The system uses a weighted average. If MACD is heavily bearish but sentiment is highly positive, they cancel out, resulting in a "Neutral / Wait" label.

## 5. Prediction Engine (`prediction_service.py`)
**CRITICAL**: There is no LSTM or Deep Learning prediction model currently implemented, despite references in the roadmap.
- **Implementation**: The service uses a simple "Conservative Trend Projection". If the trend is Bullish, it projects a static 2% increase. If Bearish, a 2% decrease. 
- **Transparency**: The API response explicitly states: `"limitations": "Conservative trend projection using SMA + momentum heuristic. No ML model loaded."`

## 6. Analytical Validation
- The implementation of RSI and MACD in Pandas matches standard mathematical definitions.
- Edge Cases: NaN values in early rolling windows are properly handled by `pandas` but should ideally be dropped before conversion to standard Python floats to avoid JSON serialization errors (`NaN` is invalid in strict JSON).
