# 13 - Intelligence Behavioral Tests

## Objective
Execute a deterministic matrix of synthetic inputs to mathematically prove the Intelligence Core behaves strictly as a logic-based decision-support engine, refusing to average conflicting signals or fabricate intelligence from poor data.

## Test Matrix Execution

A local Python test harness (`backend/test_engine.py`) was executed. No paid APIs were called. 

### CASE 1 — Strong Bullish Alignment
- **Input**: Trend bullish, MACD bullish, RSI 55 (healthy), Sentiment positive, Real data.
- **Output**: `Bullish Setup`. Confidence: `High`. Risk: `LOW`.
- **Evidence generated**: Explicit textual lists covering trend, MACD, and sentiment. Bearish evidence list was correctly empty.
- **Result**: PASS

### CASE 2 — Strong Bearish Alignment
- **Input**: Trend bearish, MACD bearish, RSI 45 (weak), Sentiment negative.
- **Output**: `Bearish Setup`. Confidence: `High`. Risk: `LOW`.
- **Result**: PASS

### CASE 3 — Bullish Trend + Overbought RSI
- **Input**: Trend bullish, MACD bullish, RSI 80 (>70).
- **Output**: `Bullish Setup`. Confidence: `Medium`. Risk: `ELEVATED`.
- **Conflict Highlighted**: `['Trend is bullish, but the asset is overbought, increasing pullback risk.']`
- **Behavior**: The conflict was explicitly exposed. Confidence was correctly penalized from High down to Medium due to the conflict, and Risk was elevated. The evidence list preserved both the bullish trend AND the bearish overbought RSI.
- **Result**: PASS

### CASE 4 — Bearish Technical + Positive Sentiment
- **Input**: Technical bearish, Sentiment strongly positive.
- **Output**: `Neutral / Wait`. Confidence: `Medium`.
- **Conflict Highlighted**: `['Technical trend is bearish, but recent news sentiment is positive.']`
- **Behavior**: The engine refused to simply average them into a meaningless score. It explicitly detected the contradiction, generated a Neutral label, penalized confidence, and explicitly listed the conflict in English.
- **Result**: PASS

### CASE 5 — Poor Data Quality
- **Input**: Technicals are mathematically strong, but `_meta.mode = "demo"`.
- **Output**: `High Uncertainty`. Confidence: `Low`. Risk: `HIGH`.
- **Behavior**: Despite perfect technical alignment, the engine aggressively downgraded the signal label and confidence because the underlying data is synthetic. It correctly refused to output high-confidence intelligence from poor data.
- **Result**: PASS

### CASE 6 — Insufficient History
- **Input**: `< 2` data points (`available=False`).
- **Output**: `High Uncertainty`. Confidence: `None`. Risk: `HIGH`.
- **Behavior**: Safely returned empty unavailable state with no fabricated numerical guesses.
- **Result**: PASS

### CASE 7 — Missing Sentiment
- **Input**: Valid technicals, but Sentiment is missing (`"unavailable"`).
- **Output**: Label downgraded to `High Uncertainty`. Confidence: `Low`. Risk: `HIGH`.
- **Behavior**: The technical engine still operated (produced evidence), but the overall signal recognized the incomplete data context, applying heavy confidence/risk penalties.
- **Result**: PASS

### CASE 8 — Extreme Volatility
- **Input**: Strong Bullish alignment, but Volatility is extreme (> 5% of SMA20).
- **Output**: `Bullish Setup`. Risk: `ELEVATED`.
- **Behavior**: The engine differentiated between risk and direction. The setup remained bullish because momentum supported it, but the risk flag correctly triggered `ELEVATED` due to extreme movement. Risk is not just a synonym for bearishness.
- **Result**: PASS

## Conclusion
All 8 behavioral tests passed exactly as outlined in the prompt specifications.
