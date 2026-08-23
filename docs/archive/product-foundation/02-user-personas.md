# 02 - USER PERSONAS

## Framework Overview
STOCKSEE serves retail and semi-professional investors. The product must remain a unified financial command center and avoid diluting its value by catering to audiences outside its core focus.

---

## 1. PRIMARY PERSONA: The Data-Driven Retail Investor

- **Persona Name**: Alex (The Analytical Investor)
- **Experience Level**: Intermediate (2-5 years investing)
- **Financial Knowledge**: Understands basic technicals (SMA, MACD, RSI) and fundamental metrics (P/E, Market Cap).
- **Primary Objective**: Make informed, data-backed stock purchases without spending hours calculating indicators manually.
- **Typical Workflow**: Checks the market morning and evening. Uses screeners to find setups. Analyzes 3-5 specific stocks deeply before buying.
- **Pain Points**: Existing platforms require too much manual chart configuration. News is disconnected from technical analysis.
- **Information Needs**: Aggregated technical signals, consolidated sentiment, clear buy/sell indicators.
- **Decision-Making Behavior**: Methodical. Needs to understand *why* an asset is moving before committing capital.
- **STOCKSEE Features They Need**: AI Advisor, Screener, Technical Indicators, News & Sentiment Engine.
- **STOCKSEE Features They Don't Need**: Educational Academy (too basic for them).
- **Frequency of Use**: Daily (1-2 times per day).
- **Risk Sensitivity**: Moderate. Prefers calculated risks over meme-stock gambling.
- **Technical Sophistication**: High comfort with web apps, low comfort with APIs/coding.
- **Primary Success Outcome**: Finding a profitable trade setup using the AI Signal Engine that they would have missed otherwise.
- **Main Reason to Adopt STOCKSEE**: It automates their technical analysis workflow into a single, beautiful dashboard.
- **Main Reason to Abandon STOCKSEE**: The AI signals prove unreliable, or the platform is too slow.

---

## 2. SECONDARY PERSONA: The Swing Trader

- **Persona Name**: Jordan (The Trend Rider)
- **Experience Level**: Advanced (5+ years trading)
- **Financial Knowledge**: High. Deeply understands momentum, volatility, and sector rotation.
- **Primary Objective**: Capture multi-day or multi-week trends based on technical crossovers and sentiment shifts.
- **Typical Workflow**: Constantly monitors watchlists and alerts. Acts quickly when specific technical thresholds are crossed.
- **Pain Points**: Missing a crossover because they weren't staring at the chart. Too much noise in social sentiment.
- **Information Needs**: Real-time alerts, momentum indicators, volatility metrics, sector heatmaps.
- **Decision-Making Behavior**: Fast and rules-based.
- **STOCKSEE Features They Need**: Alerts System, Watchlist, Heatmaps, MACD/RSI data.
- **STOCKSEE Features They Don't Need**: Long-term portfolio sector allocation views.
- **Frequency of Use**: Multiple times per day; heavily relies on push/background alerts.
- **Risk Sensitivity**: High, but strictly managed via stop-losses.
- **Technical Sophistication**: High. Might be interested in API access eventually.
- **Primary Success Outcome**: Receiving an alert that catches a MACD crossover right as sentiment turns positive.
- **Main Reason to Adopt STOCKSEE**: The speed of data aggregation and reliable alerts.
- **Main Reason to Abandon STOCKSEE**: Data latency (15-min delays on the free tier will drive them away).

---

## 3. TERTIARY PERSONA: The Passive Wealth Builder

- **Persona Name**: Taylor (The Set-and-Forget Investor)
- **Experience Level**: Beginner to Intermediate
- **Financial Knowledge**: Basic. Understands ETFs, diversification, and long-term holding.
- **Primary Objective**: Grow net worth steadily over time with minimal daily effort.
- **Typical Workflow**: Checks their portfolio balance once a week or month. Occasionally looks for a new "blue chip" stock to buy and hold.
- **Pain Points**: Financial jargon is intimidating. Complex charts are useless to them.
- **Information Needs**: High-level portfolio performance, sector allocation, simple "Buy/Hold" ratings.
- **Decision-Making Behavior**: Slow, conservative, heavily influenced by brand reputation and simple metrics.
- **STOCKSEE Features They Need**: Portfolio Management, Market Dashboard (Overview), Educational Academy.
- **STOCKSEE Features They Don't Need**: Screener, intraday alerts, complex MACD charts.
- **Frequency of Use**: Weekly or Monthly.
- **Risk Sensitivity**: Low. Highly risk-averse.
- **Technical Sophistication**: Average consumer level.
- **Primary Success Outcome**: Seeing their portfolio grow in a beautifully visualized interface.
- **Main Reason to Adopt STOCKSEE**: It's prettier and easier to understand than their legacy brokerage app.
- **Main Reason to Abandon STOCKSEE**: The interface becomes cluttered with advanced trading tools they don't understand.

---

## 4. ANTI-PERSONA: The High-Frequency Quant / Day Trader

- **Persona Name**: The Millisecond Scalper
- **Why they are an Anti-Persona**:
  - STOCKSEE is fundamentally a web-based REST/HTTP application with caching layers. It is **not** a WebSocket-first, tick-by-tick C++ trading engine.
  - STOCKSEE's AI is based on heuristic trend projection and sentiment, not complex Level 2 order book statistical arbitrage.
  - Attempting to cater to this user would require rewriting the entire backend architecture, sacrificing the UX for the Primary Persona.
- **STOCKSEE must actively NOT build**: 
  - Level 2 / Level 3 market depth charts.
  - Millisecond execution routing algorithms.
  - Custom scripting languages for automated bot trading.
