# 02 - Current Engine Audit

## A. indicator_service.py
- **Calculations**: Correctly computes SMA20, SMA50, RSI(14), and MACD.
- **Flaw**: It computes a basic `trend` (Bullish if close > SMA20 and RSI > 55; Bearish if close < SMA20 and RSI < 45). This logic is rigid and ignores MACD entirely.

## B. sentiment_service.py
- **Calculations**: VADER sentiment on headline + summary.
- **Flaw**: Averages compound scores.

## C. signal_service.py
- **Flaw 1 (Arbitrary Scoring)**: Starts technical score at 50, adds 20 for bullish trend, subtracts 10 for overbought RSI.
- **Flaw 2 (Double Counting)**: `trend` already includes RSI, but `signal_service` modifies the score again based on RSI!
- **Flaw 3 (Averaging)**: Takes the arbitrary tech score, averages it with the normalized sentiment score. This completely destroys context.

## D. prediction_service.py
- **Flaw**: Takes the technical trend. If Bullish, projects `current_price * 1.02`. If Bearish, `current_price * 0.98`. This is fake precision and provides no value over simply stating the trend direction.

## E. report_service.py
- Currently just concatenates strings together without offering any synthesizing insights or conflict detection.