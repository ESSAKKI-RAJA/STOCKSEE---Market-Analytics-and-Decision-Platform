# 25 - FUTURE ROADMAP

## Short-Term Roadmap (0-3 Months)
- **Redis Migration**: Replace the in-memory python dictionary cache with Redis for true multi-worker horizontal scaling.
- **Enterprise Data Provider**: Swap `yfinance` for a robust paid provider like Polygon.io or Alpha Vantage.
- **Background Task Queue**: Implement Celery or RQ to handle news sentiment scraping asynchronously rather than inside the user request loop.

## Medium-Term Roadmap (3-9 Months)
- **Mobile Application**: Wrap the frontend UI using Capacitor or migrate components to React Native for iOS/Android app store launches.
- **Broker Integrations**: Implement OAuth with Alpaca, Interactive Brokers, and TD Ameritrade to allow users to execute trades directly from the STOCKSEE dashboard.
- **Real-Time WebSockets**: Stream live tick data and live news flashes directly to the UI without polling.

## Long-Term AI & Institutional Roadmap (1+ Years)
- **Autonomous AI Copilot**: "Chat with your Portfolio." A GenAI interface that allows users to ask, "How will a rate hike affect my holdings?" and receive a tailored, fundamentally-driven response using RAG (Retrieval-Augmented Generation) against historical market data.
- **Predictive Intelligence (Deep Learning)**: Train bespoke Transformer models on the proprietary OHLCV database collected by STOCKSEE over time to generate probabilistic price corridors.
- **Enterprise / B2B Whitelabeling**: Package the dashboard and AI signal engine into an embeddable widget for smaller banks and regional wealth management firms.
