# 04 - Signal Framework

## A. Technical Rules
- **Trend**: 
  - `Bullish`: SMA20 > SMA50 AND Close > SMA20
  - `Bearish`: SMA20 < SMA50 AND Close < SMA20
  - `Neutral`: Otherwise
- **Momentum (MACD)**:
  - `Positive`: MACD Line > Signal Line and Histogram > 0
  - `Negative`: MACD Line < Signal Line and Histogram < 0
  - `Neutral`: Otherwise
- **Extension (RSI)**:
  - `Overbought`: RSI > 70
  - `Oversold`: RSI < 30
  - `Neutral`: 30 <= RSI <= 70

## B. Sentiment Rules
- `Positive`: VADER > 0.15
- `Negative`: VADER < -0.15
- `Neutral`: Otherwise

## C. Final Labeling
Instead of a numerical score, the engine will count Bullish vs Bearish evidence points.
- If Bullish > Bearish by 2+: `Bullish Setup`
- If Bearish > Bullish by 2+: `Bearish Setup`
- If Evidence is mixed/conflicting: `Neutral / Wait` or `High Uncertainty`