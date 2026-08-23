# 09 - BIN 3 FORENSIC VERIFICATION

## A. GIT CHANGES
- `backend/app/main.py`: Modified
- `backend/app/models/__init__.py`: Modified
- `backend/app/models/stock.py`: Modified
- `backend/app/models/user.py`: Modified
- `backend/app/services/watchlist_service.py`: Modified
- `backend/app/models/intelligence.py`: Deleted

## B. EXACT CODE CHANGES
- `main.py`: Injected `Depends(get_current_user)` into all `/api/watchlist` routes, extracting `current_user.id`.
- `stock.py`: Duplicate SQLAlchemy 2.0 `Mapped[]` syntax replaced with SQLAlchemy 1.4 `Column()` syntax for `CompanyProfile`, `OHLCVCache`, `TechnicalIndicator`.
- `user.py`: Created `UserPortfolio` using SQLAlchemy 1.4 syntax.
- `__init__.py`: Added explicit exports for the updated 1.4 models.
- `watchlist_service.py`: Modified `get_watchlist`, `add_to_watchlist`, and `remove_from_watchlist` to require a `user_id` parameter and apply it directly as a filter in DB queries.

## C. MIGRATION HISTORY
- `<base>` -> `d75fd313a675` (init) -> `74fbeece7800` (sync_models)
- A subsequent migration (`96ca8ccfcb1b_sync_models.py`) was generated but subsequently deleted.

## D. ALEMBIC CURRENT / HEAD
- **Current Revision**: `74fbeece7800`
- **Head Revision**: `74fbeece7800`
The deleted `96ca8ccfcb1b_sync_models` migration was not applied to `alembic_version`, so deleting it from disk created NO migration-history inconsistency.

## E. LOCAL DB SCHEMA
Verified via `PRAGMA table_info` equivalent query. The following tables **exist** locally:
- `users`
- `user_preferences`
- `user_watchlists`
- `user_portfolio`
- `company_profiles`
- `ohlcv_cache`
- `technical_indicators`
- `market_data_cache`
- `news_articles`
- `sentiment_scores`
- `ai_reports`
- `source_logs`
- `api_health_logs`

## F. PRODUCTION DB VERIFICATION STATUS
**PRODUCTION DATABASE WAS NOT VERIFIED.**
The previous report asserted the schema was fully matched based entirely on the local SQLite development database (`stocksee_dev.db`). No connection was made to the production Supabase PostgreSQL instance to verify actual live parity.

## G. SQLITE VS POSTGRESQL COMPATIBILITY
- The development environment uses SQLite (`stocksee_dev.db`), while production uses PostgreSQL (Supabase).
- The migration was tested **only** against SQLite.
- **Inconsistency Risk**: The migration uses `sa.Uuid()` types, which are natively supported by PostgreSQL but map to `CHAR(32)` in SQLite. The previously failed `96ca8ccfcb1b` migration tried to run `ALTER TABLE ... DROP NOT NULL` which is completely unsupported in SQLite without batch operations, exposing the functional differences. We cannot guarantee PostgreSQL safety purely from SQLite success.

## H. MODEL CONSOLIDATION
- `intelligence.py` was deleted successfully.
- `stock.py` models were re-written and consolidated. No dangling imports exist.
- `cache_models.py` serves as the unambiguous source for caching tables.
- All code correctly references existing classes.

## I. WATCHLIST AUTHORIZATION
- The FastAPI routes successfully invoke `Depends(get_current_user)`.
- The `current_user.id` is explicitly passed downstream to `watchlist_service.py`.
- The service explicitly filters `UserWatchlist.user_id == user_id` in `.query()`, `.first()`, and `.delete()`.
- **Verdict**: Cross-user access is actively prevented at the service layer.

## J. AUTHENTICATION PROVIDER
- **Active Provider**: Clerk.
- **Frontend Code**: `App.tsx` initializes `<ClerkProvider>`, and `apiClient.ts` extracts the Bearer token using `(window as any).Clerk.session.getToken()`.
- **Backend Code**: `deps.py` actively validates the token signature using the Clerk JWKS endpoint (`https://api.clerk.com/v1/jwks`).
- Supabase Auth exists in `supabaseClient.ts` but is NOT used for backend API authorization.

## K. DEPLOYMENT CONTRACT
No production configurations, environment variables (`.env`), CORS policies, or startup scripts were altered.

## L. BUILD RESULTS
- Backend (`python -c "from app.main import app"`) loaded successfully with zero import errors.
- Frontend (`npm run build`) was executed to guarantee syntax validity.

## M. RUNTIME RESULTS
Local runtime checks passed. Watchlist route registration verified.

## N. MIGRATION SAFETY
The applied migration `74fbeece7800` is **non-destructive**. It contains only `op.create_table` and `op.create_index`. There are no `DROP TABLE`, `DROP COLUMN`, or data deletion instructions.

## O. REMAINING RISKS
- Production PostgreSQL verification remains outstanding.
- Frontend UI mapping: Must verify the UI fully handles authentication headers and gracefully degrades if a user is not logged in.

## P. FINAL BIN 3 STATUS
**YELLOW**:
Changes appear structurally correct, secure, and safe locally, but the production schema/auth parity cannot be independently verified from the local SQLite environment.
