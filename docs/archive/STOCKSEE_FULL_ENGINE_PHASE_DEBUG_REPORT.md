# STOCKSEE Full Engine Phase Debug Report

## Executive Summary
STOCKSEE has undergone a full 12-phase audit, repair, and alignment process. The monolithic application was successfully separated into a working React/Vite frontend and a FastAPI backend with multiple mockable engine services. External dependencies have been safely isolated so the product is 100% locally runnable offline or without API keys, fulfilling the primary requirement.

## Current Repo Reality
- **Frontend**: Vite 5.4.21, React 18, running on `http://localhost:5173`.
- **Backend**: FastAPI running via Uvicorn on `http://127.0.0.1:8000`.
- **Database**: Replaced with in-memory demo data handlers where Supabase was incomplete.

## What Was Broken
- The frontend was bypassing the backend, trying to hit Supabase edge functions directly (`stock-orchestrator`, `company-profile`, `stock-analysis`).
- The backend had only stubbed endpoints (`/api/market-news`) without real service logic.
- Environment variables were missing (`.env.example` not present in frontend).
- There were no fallback strategies for missing API keys, which would cause crashes.

## What Was Fixed
- **Config Audit**: Created `.env` and `.env.example` across both frontend and backend.
- **FastAPI Core**: Upgraded `main.py` with full exception handling, CORS middleware matching frontend, and proper routing.
- **Service Layer Creation**: Created 8 individual services in `backend/app/services` to isolate logic for market data, indicators, news, sentiment, predictions, signals, and reporting.
- **Frontend-Backend Alignment**: Rewrote frontend React hooks (`useStockPrices`, `useCompanyProfile`, `useStockAnalysis`, `useWatchlist`) to call the FastAPI backend via `apiClient.ts` instead of Supabase edge functions.

## What Is Still Placeholder / Demo
- **News Engine**: Defaults to demo news if `FINNHUB_API_KEY` is not present.
- **Sentiment Engine**: Uses `VADER` as the primary fallback instead of `FinBERT`.
- **Prediction Engine**: Uses simple Moving Average trend heuristics instead of ML LSTMs.
- **Watchlist/Database**: Supabase Auth/DB logic has been replaced with an in-memory fallback list to ensure local running without setup.

## Engine Status Table

| Engine | Status | Notes |
|--------|--------|-------|
| **Market Data** | Active | Uses `yfinance` with fallback to static demo data. |
| **Technical Indicator** | Active | Calculates RSI, MACD, MAs, and volatility on the fly. |
| **News** | Fallback | Finnhub integrated but defaults to demo JSON. |
| **Sentiment** | Active | VADER sentiment scoring on news headlines. |
| **Prediction** | Fallback | Heuristic trend projection. |
| **Signal Generation** | Active | Computes technical/sentiment scores to yield safe labels. |
| **Report** | Active | Aggregates all engines into a single JSON structure. |
| **Heatmap** | Fallback | Static JSON fallback. |
| **Watchlist/Auth** | Demo | In-memory list (`["AAPL", "TSLA", "MSFT"]`). |
| **Source/Health** | Active | `GET /health` reports engine status properly. |
| **Frontend Visualization** | Active | UI states adapted to consume fallback/demo tags gracefully. |

## Required Environment Variables
**Frontend (`frontend/.env`)**:
- `VITE_API_BASE_URL=http://localhost:8000`

**Backend (`backend/.env`)**:
- `ENVIRONMENT=development`
- `CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`
- `FINNHUB_API_KEY=` (Optional)

## How to Run

**Backend**:
```bash
cd backend
python -m venv .venv
# activate venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## Known Limitations & Next Steps
1. **Supabase Auth Integration**: Frontend needs to re-integrate user sessions when moving to production.
2. **FinBERT Integration**: Load FinBERT instead of VADER for deep financial sentiment if memory allows.
3. **ML Models**: Train and host LSTM models for the prediction engine.
4. **Database Models**: Connect Alembic and SQLAlchemy to real Postgres tables for watchlist and cache persistence.
