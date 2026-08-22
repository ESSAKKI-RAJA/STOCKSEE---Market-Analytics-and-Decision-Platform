import os

docs_dir = r"d:\PROJECTS\STOCKSEE\docs\intelligence-foundation"
os.makedirs(docs_dir, exist_ok=True)

files = {
    "01-intelligence-problem.md": """# 01 - The Intelligence Problem

## A. Problem Definition
The primary problem with STOCKSEE's current analytical engine is **False Precision and Concealed Conflict**. The current system takes distinct, sometimes contradictory market indicators (e.g., strong bearish momentum via MACD but positive news sentiment) and compresses them into a single arbitrary score (e.g., `(Tech + Sent) / 2`). 

This fundamentally violates the goal of a decision-support engine. An investor doesn't need to know that a stock is a "72 / Bullish". They need to know *what* the indicators are saying, *why* they are saying it, and *where* they disagree.

## B. The Decision-Support Solution
Instead of hiding uncertainty behind a mathematical average, STOCKSEE must:
1. **Expose Evidence**: Provide a structured list of bullish and bearish indicators.
2. **Highlight Conflict**: Explicitly warn the user when momentum contradicts trend, or when sentiment contradicts technicals.
3. **Qualify Confidence**: Link confidence directly to data quality (e.g., demo vs real data, missing data) rather than the strength of the signal itself.
4. **Remove Fake Prediction**: Replace arbitrary ±2% price predictions with scenario-based trajectory analysis.
""",

    "02-current-engine-audit.md": """# 02 - Current Engine Audit

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
""",

    "03-intelligence-architecture.md": """# 03 - Target Intelligence Architecture

STOCKSEE will adopt a layered analytical hierarchy to transform raw indicators into explicit decision support.

1. **DATA QUALITY ENGINE**: Inspects the `_meta` modes of incoming data (real, stale_cache, demo, fallback). Determines base confidence ceiling.
2. **TECHNICAL STATE ENGINE**: Evaluates RSI, MACD, and SMAs independently to determine Momentum, Trend, and Mean Reversion contexts.
3. **SENTIMENT STATE ENGINE**: Evaluates VADER sentiment scores.
4. **CONFLICT ENGINE**: Cross-references Technical and Sentiment states to detect logical contradictions (e.g., Bullish Trend + Overbought RSI).
5. **RISK ENGINE**: Evaluates volatility, conflicts, and data quality to flag elevated risk conditions.
6. **EVIDENCE ENGINE**: Generates explicit "Bullish Evidence" and "Bearish Evidence" strings based entirely on deterministic mathematical thresholds.
7. **EXPLANATION ENGINE**: Assembles the evidence into a structured summary.
8. **CONFIDENCE ENGINE**: Lowers confidence if data is demo, stale, or highly conflicting.
""",

    "04-signal-framework.md": """# 04 - Signal Framework

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
""",

    "05-confidence-framework.md": """# 05 - Confidence Framework

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
""",

    "06-risk-framework.md": """# 06 - Risk Framework

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
""",

    "07-evidence-explanation-framework.md": """# 07 - Evidence & Explanation Framework

All explanations are deterministic strings generated by Python if-statements mapped to mathematical truths.

## Evidence Generators
- `RSI > 70` -> "RSI indicates overbought conditions (momentum extended)."
- `SMA20 > SMA50` -> "Short-term trend (SMA20) is positively above medium-term trend (SMA50)."
- `MACD Histogram > 0` -> "MACD momentum is positive and strengthening."

## Contradiction Highlight
If Bullish Trend + Overbought RSI:
"WARNING: While the underlying trend is bullish, the RSI indicates the asset is currently overbought, increasing the risk of a near-term pullback."
""",

    "08-prediction-reassessment.md": """# 08 - Prediction Reassessment

## Decision
The current ±2% prediction heuristic creates false precision and implies a price target that the engine cannot mathematically support.

## Action
- Remove the `projected_price` calculation based on static percentages.
- Reframe the output to **Scenario Projection**.
- If Bullish: "Current technical evidence suggests continued upward momentum, provided support holds at SMA20."
- If Bearish: "Current technical evidence suggests downward pressure; risk of further decline until RSI reaches oversold."
- This maps to the existing API structure (`prediction_insight`) without breaking the frontend contract.
""",

    "09-intelligence-api-contract.md": """# 09 - Intelligence API Contract

The existing JSON schema must be perfectly preserved to maintain frontend compatibility. 

## Unchanged Keys
- `company_summary`
- `market_performance`
- `technical_analysis`
- `sentiment_analysis`
- `prediction_insight` (Text will change to Scenario Projection)
- `risk_factors` (Will now include structured Risk Engine outputs)
- `final_analysis_summary` (Will now include explicitly generated evidence & conflict text)
- `data_source_list`
- `limitations`
- `_meta`

No changes to the frontend code are necessary to support this intelligence upgrade, as the improvements are purely in the textual context and logical weighting provided to these keys.
""",

    "10-intelligence-test-plan.md": """# 10 - Intelligence Test Plan

Unit tests must be implemented (or manually validated) for the following deterministic scenarios:

1. **Perfect Bullish Alignment**: SMA20 > SMA50, MACD positive, RSI = 55. Result: `Bullish Setup`, `High Confidence`, `Low Risk`.
2. **Conflict Scenario**: SMA20 > SMA50, but RSI = 85. Result: `Neutral / Wait`, `Medium Confidence`, `Elevated Risk`, Conflict explicitly stated in evidence.
3. **Data Degradation**: Input `demo` mode data. Result: `Low Confidence`, `High Risk`, Limitations clearly warn of fake data.
4. **Missing History**: Input `< 50` days of data. Result: Fallback to basic insights, Confidence capped at `Low`.
""",

    "11-bin4-implementation-report.md": """# 11 - Bin 4 Implementation Report

*(This file will be updated upon completion of the execution phase, documenting the exact lines of code altered in `signal_service.py`, `prediction_service.py`, and `report_service.py`)*
"""
}

for filename, content in files.items():
    filepath = os.path.join(docs_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Created {filename}")

print("All documentation files generated successfully.")
