# 05 - COMPLETE TECH STACK

## Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite (Lightning fast HMR, optimized production builds)
- **Styling**: Tailwind CSS v3 (Utility-first styling for high customization)
- **UI Components**: shadcn/ui (Accessible, customizable Radix UI primitives)
- **Routing**: React Router v6
- **State Management (Server)**: TanStack Query v5 (Handles caching, deduplication, and background fetching of API requests)
- **Animations**: Framer Motion (Fluid micro-animations, layout transitions)
- **Icons**: Lucide React
- **Charting**: Recharts / Lightweight Charts (TradingView)

## Backend
- **Framework**: FastAPI (Python 3.11+)
- **Language**: Python (Chosen for unmatched ML/Data Science ecosystem support)
- **Server**: Uvicorn (ASGI server)
- **Validation**: Pydantic v2 (Strict type checking and schema validation)
- **Caching Engine**: Custom in-memory dictionary cache with TTL (`cache_service.py`)

## Database & Authentication
- **Primary Database**: PostgreSQL (via Supabase) / SQLite (Local Dev via SQLAlchemy)
- **ORM**: SQLAlchemy 2.0 (Models defined in `app/models/`)
- **Migrations**: Alembic (Directory `backend/alembic/`)
- **Authentication**: Supabase Auth (JWT validation in FastAPI via PyJWT & JWKS) & Clerk integration.

## Machine Learning & Data Processing
- **Data Providers**: yfinance (historical/quotes), Finnhub (news/fundamentals)
- **Data Manipulation**: Pandas, NumPy
- **Sentiment NLP**: VADER (Valence Aware Dictionary and sEntiment Reasoner), FinBERT (transformer-based model for financial text).
- **Architecture**: Graceful degradation (Falls back from FinBERT to VADER if memory limited via `DISABLE_FINBERT=1`).

## Infrastructure & DevOps
- **Frontend Hosting**: Vercel (Global Edge Network, automatic CI/CD on git push).
- **Backend Hosting**: Render (Web Service for FastAPI).
- **Environment Variables**: Managed via `.env` files locally and provider UI in production.
- **Package Managers**: npm (Frontend), pip (Backend).

## Why this stack?
- **React + Tailwind + shadcn**: Enables rapid UI iteration while maintaining a premium aesthetic.
- **FastAPI**: Unbeatable API performance in Python, essential since the backend needs to run Pandas calculations and ML inference.
- **Supabase**: Eliminates backend boilerplate for Auth and RLS (Row Level Security), drastically speeding up time-to-market.
