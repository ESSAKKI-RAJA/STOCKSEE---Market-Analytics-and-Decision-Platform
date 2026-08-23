# 01 - The Intelligence Problem

## A. Problem Definition
The primary problem with STOCKSEE's current analytical engine is **False Precision and Concealed Conflict**. The current system takes distinct, sometimes contradictory market indicators (e.g., strong bearish momentum via MACD but positive news sentiment) and compresses them into a single arbitrary score (e.g., `(Tech + Sent) / 2`). 

This fundamentally violates the goal of a decision-support engine. An investor doesn't need to know that a stock is a "72 / Bullish". They need to know *what* the indicators are saying, *why* they are saying it, and *where* they disagree.

## B. The Decision-Support Solution
Instead of hiding uncertainty behind a mathematical average, STOCKSEE must:
1. **Expose Evidence**: Provide a structured list of bullish and bearish indicators.
2. **Highlight Conflict**: Explicitly warn the user when momentum contradicts trend, or when sentiment contradicts technicals.
3. **Qualify Confidence**: Link confidence directly to data quality (e.g., demo vs real data, missing data) rather than the strength of the signal itself.
4. **Remove Fake Prediction**: Replace arbitrary ±2% price predictions with scenario-based trajectory analysis.