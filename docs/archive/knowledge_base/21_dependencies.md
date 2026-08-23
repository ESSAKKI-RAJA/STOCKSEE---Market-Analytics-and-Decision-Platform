# 21 - DEPENDENCIES

## Frontend Dependencies
- **`react` & `react-dom`**: UI rendering.
- **`react-router-dom`**: Client-side routing.
- **`@tanstack/react-query`**: State management for API data. Prevents race conditions and caches data automatically.
- **`tailwindcss`**: Utility CSS framework for the UI.
- **`framer-motion`**: Used for smooth page transitions and micro-interactions (e.g., expanding cards).
- **`@supabase/supabase-js`**: SDK for Auth and direct database querying.
- **`@clerk/clerk-react`**: Alternative Auth provider (supported via `.env`).
- **`lucide-react`**: Clean, modern SVG icon set.
- **`recharts`**: Lightweight composable charting library used in `SectorHeatmap.tsx` and Portfolio allocation charts.
- **`shadcn/ui` dependencies** (`radix-ui` primitives, `class-variance-authority`, `clsx`, `tailwind-merge`): Provides the accessible underlying foundation for the UI components without forcing a specific style.

## Backend Dependencies
- **`fastapi`**: Asynchronous web framework.
- **`uvicorn`**: ASGI server to run FastAPI.
- **`yfinance`**: Scrapes Yahoo Finance for quotes and OHLCV data. (Pros: Free. Cons: Unofficial, can be rate-limited/blocked).
- **`finnhub-python`**: Official client for Finnhub API to fetch news.
- **`pandas` & `numpy`**: Standard data science stack for calculating technical indicators (SMA, RSI, MACD) quickly.
- **`vaderSentiment`**: Dictionary-based NLP sentiment analyzer. (Pros: Extremely fast, very low RAM. Cons: Doesn't understand deep context).
- **`sqlalchemy` & `alembic`**: Database ORM and migration tool.
- **`pydantic-settings`**: Automatically parses `.env` variables into a typed Python class (`config.py`).
- **`PyJWT`**: Validates Supabase JSON Web Tokens to secure API routes.
