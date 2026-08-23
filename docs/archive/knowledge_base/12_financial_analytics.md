# 12 - FINANCIAL ANALYTICS

The `indicator_service.py` is the mathematical heart of STOCKSEE's technical analysis. All calculations are performed using `pandas` and `numpy`.

## Implemented Indicators

### 1. Simple Moving Averages (SMA)
- **Calculation**: Rolling arithmetic mean of the closing prices over a specific window.
- **Implementation**:
  - `sma_20 = closes.rolling(window=20).mean()`
  - `sma_50 = closes.rolling(window=50).mean()`
- **Usage**: Trend identification. Price > SMA20 is considered a short-term bullish condition.

### 2. Relative Strength Index (RSI)
- **Calculation**: 14-period Wilder's Smoothing RSI.
- **Implementation**:
  - Calculates daily deltas (`closes.diff()`).
  - Separates gains and losses.
  - Computes the average gain and average loss over a 14-day rolling window.
  - `RS = Avg Gain / Avg Loss` -> `RSI = 100 - (100 / (1 + RS))`
- **Usage**: Momentum oscillator. >70 is Overbought, <30 is Oversold.

### 3. MACD (Moving Average Convergence Divergence)
- **Calculation**:
  - `EMA_12 = closes.ewm(span=12).mean()`
  - `EMA_26 = closes.ewm(span=26).mean()`
  - `MACD_Line = EMA_12 - EMA_26`
  - `Signal_Line = MACD_Line.ewm(span=9).mean()`
  - `Histogram = MACD_Line - Signal_Line`
- **Usage**: Trend-following momentum indicator. Crossovers dictate entry/exit signals.

### 4. Volatility
- **Calculation**: Standard deviation of the closing prices over the fetched period (`closes.std()`).
- **Usage**: Used in `signal_service.py` to trigger the `"Risk Elevated"` flag if volatility exceeds 5% of the SMA20.

## Missing Analytics (Future Additions)
- Bollinger Bands
- VWAP (Volume Weighted Average Price) - requires intraday tick data.
- Average True Range (ATR)
- Portfolio-level Risk Metrics: Sharpe Ratio, Beta, Max Drawdown.
