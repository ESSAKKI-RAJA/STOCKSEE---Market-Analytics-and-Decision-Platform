# 11 - MACHINE LEARNING / AI

## Current AI Capabilities

### 1. NLP Sentiment Analysis (`sentiment_service.py`)
- **Model**: VADER (Valence Aware Dictionary and sEntiment Reasoner).
- **Fallback / Upgrade**: The architecture explicitly supports FinBERT (a HuggingFace transformer model fine-tuned on financial text), but it is disabled by default via the `DISABLE_FINBERT=1` environment variable due to memory constraints on Render's free tier.
- **Pipeline**:
  1. News headlines and summaries are concatenated.
  2. Text is passed into the `SentimentIntensityAnalyzer`.
  3. The compound scores (-1.0 to +1.0) are averaged across all fetched articles.
  4. The output is normalized to a 0-100 scale for the UI.

### 2. Trend Projection (`prediction_service.py`)
- **Current State**: Currently uses a *heuristic heuristic* (SMA crossover + momentum), **NOT** a trained ML model. The documentation in the file explicitly states: `"Uses SMA crossover + momentum heuristic for simple directional bias. No ML models (LSTM, Prophet, etc.) are loaded."`
- **Output**: Generates a "Conservative 2% Up/Down" projection based on the current RSI and SMA trend.

### 3. Signal Engine (`signal_service.py`)
- **Current State**: A weighted decision tree (Rules-based AI).
- **Features**: Takes `tech_score` (derived from MACD/RSI/SMA) and `sent_score` (derived from VADER), averages them, and maps them to discrete labels like `"Bullish Setup"` or `"Risk Elevated"`.

## Future AI Roadmap
1. **LSTM Time-Series Forecasting**: Implement TensorFlow/Keras LSTM models trained on the `ohlcv_cache` to predict next-day closing prices.
2. **XGBoost Classification**: Train a model to predict binary outcomes (Up/Down next week) based on a feature matrix of 20+ technical indicators.
3. **Generative AI Copilot**: Integrate an LLM (via OpenAI or Anthropic API) to generate human-readable summaries of the financial data, answering questions like "Why did AAPL drop today?" directly in the dashboard.
