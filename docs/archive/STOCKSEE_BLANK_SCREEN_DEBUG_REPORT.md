# STOCKSEE Blank White Screen Debug Report

## Root Cause

The blank white page was caused by **two interrelated bugs**:

### 1. `vite.config.ts` had `envDir: '../'`
Vite was configured to read environment variables from the **project root** (`STOCKSEE/`), not the `frontend/` directory. But there was **no `.env` file** in the project root. The `frontend/.env` file (which had all the correct `VITE_*` vars) was completely ignored. This meant:
- `VITE_API_BASE_URL` = `undefined`
- `VITE_SUPABASE_URL` = `undefined`
- `VITE_SUPABASE_ANON_KEY` = `undefined`

### 2. Supabase `createClient(undefined, undefined)` crashed at module load time
The Supabase client at `frontend/src/integrations/supabase/client.ts` called `createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)` with both values being `undefined`. The `@supabase/supabase-js` library throws a synchronous error when given invalid arguments. Since this module is imported by `AuthContext.tsx`, which is imported by `App.tsx`, the **entire React component tree crashed before rendering a single pixel**.

There was **no ErrorBoundary** to catch this, so the browser showed a completely blank white page with no visible error.

## Exact Files Changed

### `frontend/vite.config.ts`
- **Removed** `envDir: '../'` so Vite reads `.env` from `frontend/` (the default behavior).

### `frontend/src/integrations/supabase/client.ts`
- **Replaced** the crash-prone `createClient(undefined, undefined)` with a safe factory function.
- When `VITE_SUPABASE_URL` and key are missing, exports a lightweight stub that satisfies the `SupabaseClient` type without crashing.
- Exports a `supabaseConfigured` boolean so other code can skip Supabase calls.

### `frontend/src/lib/apiClient.ts`
- Imports `supabaseConfigured` and skips auth header fetching when Supabase is not set up.
- Changed fallback URL from `localhost:8000` to `127.0.0.1:8000`.

### `frontend/src/components/ErrorBoundary.tsx` [NEW]
- Created a React class component `ErrorBoundary` that catches runtime errors.
- Displays a styled error panel with error message, reload button, and troubleshooting hint.
- Prevents any future crash from producing a blank white page.

### `frontend/src/main.tsx`
- Wrapped `<App />` inside `<ErrorBoundary>` at the top level.

### `start-stocksee-dev.bat`
- Updated messaging to say "Servers started. Now open http://127.0.0.1:5173" instead of claiming the product is running.

### `diagnose-stocksee.bat`
- Added backend health check and frontend HTML reachability check.

## Console/Runtime Errors Found
- `TypeError: supabaseUrl is required` — thrown by `@supabase/supabase-js` when both URL and key are empty strings or undefined.
- No visible error in browser because there was no ErrorBoundary to catch it.

## Backend Status
- **All 15 test endpoints pass** (`verify_stocksee.py`).
- Health endpoint responds correctly at `http://127.0.0.1:8000/health`.
- CORS is configured to allow `http://127.0.0.1:5173`.

## Frontend Status
- Build completes successfully (3421 modules, 10.75s).
- No TypeScript or import errors.
- Only minor CSS warnings (template literal in CSS variable — cosmetic only).

## Verification Result
- **Page title:** "STOCK SEE -- Global Stock Intelligence"
- **Visible UI elements confirmed:**
  - STOCKSEE logo and navigation sidebar
  - "Global Markets Intelligence Platform" hero text
  - S&P 500 and NASDAQ market cards
  - "Start Analysing" and "Upgrade Pro" buttons
  - Intelligence Modules grid
  - Status bar showing "BACKEND CONNECTED"
  - "Analysis only -- Not financial advice" disclaimer

## Final Status: **3 — UI visible, local demo-ready**

The application renders fully with backend connected. Without Finnhub API keys, market quotes fall back to demo mode. With valid keys, it becomes a real-data MVP candidate (status 4).
