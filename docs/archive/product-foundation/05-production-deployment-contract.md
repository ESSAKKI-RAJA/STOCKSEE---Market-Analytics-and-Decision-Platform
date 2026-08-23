# 05 - PRODUCTION DEPLOYMENT CONTRACT

This document establishes the absolute baseline requirements to keep the existing STOCKSEE production environment stable. **DO NOT modify the configurations listed here without explicit production safety testing.**

---

## 1. VERCEL (Frontend)

- **Framework**: Vite / React 18 SPA
- **Build Command**: `npm run build` (Maps to `vite build` in `package.json`)
- **Output Directory**: `dist`
- **Node Version**: v18+ (Inferred from standard Vite requirements)
- **Environment Variables**:
  - `VITE_API_BASE_URL`: Must point to the Render backend URL in production (e.g., `https://stocksee-api.onrender.com`). If not set, it defaults to `http://127.0.0.1:8000` (which will fail in production).
  - `VITE_SUPABASE_URL`: Required for Supabase Auth.
  - `VITE_SUPABASE_ANON_KEY`: Required for Supabase Auth.
  - `VITE_CLERK_PUBLISHABLE_KEY`: Required if using Clerk as auth fallback.
- **Routing Configuration**: 
  - Because it is a Single Page Application (SPA) using React Router, Vercel must rewrite all traffic to `index.html`.
  - **Contract File**: `vercel.json` MUST exist with the following content:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
- **Fallback Behavior**: If the backend API goes down, the frontend relies on TanStack Query error boundaries to prevent a white screen.

---

## 2. RENDER (Backend)

- **Service Type**: Web Service
- **Runtime**: Python 3.11+
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - *Critical Note*: The `$PORT` variable is dynamically injected by Render. The app must bind to `0.0.0.0`, not `127.0.0.1`.
- **Environment Variables**:
  - `ENVIRONMENT`: Set to `production` on Render.
  - `CORS_ORIGINS`: Must include the Vercel production URL (e.g., `https://stocksee.vercel.app`) to prevent CORS blocks.
  - `FINNHUB_API_KEY`: Required for real news data.
  - `DATABASE_URL`: Must point to the Supabase PostgreSQL connection string in production, not `sqlite:///./stocksee_dev.db`.
  - `DISABLE_FINBERT=1`: **CRITICAL ON FREE TIER**. If FinBERT is enabled on a 512MB RAM instance, the process will OOM (Out of Memory) and crash continuously.
- **Exposed Port**: Dynamically handled via `$PORT`.
- **Health Endpoint**: `GET /health` is available for uptime monitoring.
- **CORS Configuration**: Handled in `main.py` via FastAPI `CORSMiddleware`.

---

## 3. DATABASE (Supabase)

- **Provider**: PostgreSQL via Supabase Cloud.
- **Connection Mechanism**: SQLAlchemy ORM via the `DATABASE_URL` environment variable.
- **Migrations**: Alembic (`alembic/` folder).
- **Environment Variables**: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`.
- **Contract**: The backend relies on Supabase Auth JWTs. Modifying the `SUPABASE_JWKS_URL` will break authentication validation in FastAPI.

---

## 4. AUTHENTICATION (Hybrid / Supabase / Clerk)

- **Provider**: The configuration indicates a hybrid/transition state between Supabase and Clerk. 
- **Frontend Contract**: React Context (`AuthContext.tsx`) or specific Clerk provider wrappers depend on the presence of `.env` publishable keys.
- **Backend Contract**: `main.py` (via `api/deps.py` or similar JWT middleware) intercepts requests and validates against JWKS.
- **Redirect URLs**: Must be properly configured in the Supabase/Clerk dashboard to allow redirects back to the Vercel production domain.

---

## 5. EXTERNAL APIS

- **yfinance (Yahoo Finance)**
  - **Required Keys**: None.
  - **Fallback Behavior**: Aggressively cached via `cache_service.py` to prevent 429 Too Many Requests. If it fails, `_get_demo_data()` returns static JSON.
  - **Rate-limit Behavior**: High risk.

- **Finnhub**
  - **Required Keys**: `FINNHUB_API_KEY`
  - **Fallback Behavior**: If empty or rate-limited, returns demo news headlines.
  - **Rate-limit Behavior**: Free tier limits to 60 calls/minute.

---

## 6. DEPLOYMENT SAFETY CHECKLIST

Before any future PR is merged, verify:
1. `vercel.json` has not been deleted.
2. `requirements.txt` does not include untested heavy ML libraries without a memory flag.
3. `CORS_ORIGINS` in production backend still includes the frontend domain.
4. `vite.config.ts` has not altered the build output directory away from `dist`.
5. Frontend API calls still point to `VITE_API_BASE_URL` and have not been hardcoded to `localhost`.
