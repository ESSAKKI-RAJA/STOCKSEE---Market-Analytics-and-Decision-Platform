# 23 - PRODUCT PRINCIPLES

## Core Engineering Principles
1. **Never Block the UI**: All external data fetches must be asynchronous. If an API takes 5 seconds, the UI must show a skeleton loader, not a frozen screen.
2. **Graceful Degradation**: If an external API goes down (e.g., yfinance rate limits), the backend MUST catch the error and return local cache or demo data, explicitly labeled. The frontend should never receive a generic `HTTP 500 Internal Server Error`.
3. **Stateless Backend**: The FastAPI backend should remain entirely stateless (relying only on the DB or external caching) to allow horizontal scaling on cloud providers.

## Product & Business Principles
1. **Honesty in AI**: Do not use the term "Price Target" when it is just a trend projection. Always attach a "Confidence" score and explain the "Limitations" to protect users and limit liability.
2. **Time to Value (TTV)**: The user must see actionable data within 2 seconds of landing on the dashboard. Do not force a long onboarding quiz before showing the market.
3. **Freemium Viability**: The free product must be genuinely useful. Paywall the *analysis* and *convenience*, not the raw numbers.

## Architecture & Scalability Principles
- **Decoupled Monolith**: Keep the frontend and backend strictly separated via a REST API, allowing future mobile apps (React Native/Flutter) to consume the exact same backend without changes.
- **Read-Heavy Optimization**: 95% of traffic is reading market data. Optimize read paths using in-memory caches or Redis; writes (updating watchlists) can be slower if necessary.
