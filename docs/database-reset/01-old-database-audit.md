# Old Database Audit (Phase 1)

## 1. What old database artifacts exist
- **SQLite Database**: `backend/stocksee_dev.db` (The local SQLite database).
- **Environment config**: `backend/.env` containing `# DATABASE_URL=postgresql://...` referencing the obsolete Supabase instance, and `DATABASE_URL=sqlite:///./stocksee_dev.db`.
- **Alembic Migrations**:
  - `backend/alembic/versions/d75fd313a675_init.py`
  - `backend/alembic/versions/500000000000_add_users.py`
  - `backend/alembic/versions/74fbeece7800_sync_models.py`
  These migrations were built with a mix of SQLite constraints and later attempts to force PostgreSQL compatibility, leading to a messy history.
- **Generated SQL Scripts**: `backend/postgres_migration.sql` and `backend/postgres_migration_postgresql.sql`.
- **Application Startup Hook**: `backend/app/main.py` contains `Base.metadata.create_all(bind=engine)`, which blindly initializes tables (a relic of SQLite testing).
- **Session Configuration**: `backend/app/db/session.py` has fallback logic specifically checking for `sqlite` to inject `check_same_thread: False`.

## 2. What can safely be removed
- `backend/stocksee_dev.db`: The obsolete local SQLite database file.
- `backend/postgres_migration*.sql`: The previously generated offline SQL scripts (they will be regenerated cleanly for the new Supabase).
- `backend/alembic/versions/*.py`: The entire messy migration history can and should be deleted to start fresh.
- `Base.metadata.create_all(bind=engine)` in `backend/app/main.py`: Should be removed to rely strictly on Alembic for schema management in production.
- Any references to the old Supabase URL in `.env` or Render/Vercel configs (once the new secrets are provided).

## 3. What must be preserved
- **Core Models**: All SQLAlchemy models in `backend/app/models/` (`user.py`, `stock.py`, `cache_models.py`, `system.py`, etc.).
- **Intelligence Core & Logic**: All services in `backend/app/services/` that depend on the database (Watchlist, Cache, etc.).
- **Alembic Infrastructure**: The `alembic.ini` and `env.py` setup, but pointing cleanly to PostgreSQL.
- **FastAPI Dependency**: `get_db` in `backend/app/db/session.py` and its usage across routers.
- **Clerk Authentication**: The dependency injection in `backend/app/api/deps.py` that maps Clerk identities to the database.

## 4. Whether Alembic should be reset or reused
**Alembic should absolutely be RESET.** 
The existing migration history is polluted by the SQLite-to-PostgreSQL transition, containing `CHAR(32)` vs `UUID` workarounds and `DATETIME` vs `TIMESTAMP WITH TIME ZONE` confusion. Since the new Supabase database is completely empty and fresh, generating a single, clean `001_initial_postgresql.py` migration natively against the PostgreSQL dialect is the safest and most reproducible path.

## 5. Exact new database architecture
- **Database**: The new Supabase PostgreSQL instance.
- **Connection**: SQLAlchemy connecting via `psycopg2` (`postgresql+psycopg2://...`) strictly configured through the `DATABASE_URL` environment variable.
- **Local Dev**: We will fully drop SQLite. Local development will connect to the new Supabase instance (or a local PostgreSQL container if requested, but for now, the new Supabase is the single source of truth).
- **Schema Management**: Exclusively handled by Alembic. `create_all()` will be strictly forbidden.

## 6. Risks
- **Testing Dependencies**: Dropping SQLite means local tests or runs will now depend on the remote Supabase database connection. We must ensure the `DATABASE_URL` is securely provided before attempting to boot the app.
- **Supabase Default Schemas**: Supabase includes managed schemas (like `auth`, `storage`, `public`). We must ensure Alembic only manages the `public` schema and does not attempt to drop Supabase's internal tables.
