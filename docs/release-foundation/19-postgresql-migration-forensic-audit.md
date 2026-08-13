# 19 - PostgreSQL Migration Forensic Audit

## A. Actual Alembic Dialect
**SQLite**. The `.env` file currently configures `DATABASE_URL=sqlite:///./stocksee_dev.db`. Because Alembic reads this URL to construct its dialect engine during offline generation (`env.py`), it generated the SQL using the SQLite dialect metadata.

## B. Target Production Dialect
**PostgreSQL** (Supabase).

## C. SQL Dialect Verification
**FAILED**. The generated `postgres_migration.sql` is heavily polluted with SQLite-specific types:
- Employs `DATETIME` instead of PostgreSQL's `TIMESTAMP WITH TIME ZONE`.
- Translates SQLAlchemy's `Uuid` to `CHAR(32)` instead of PostgreSQL's native `UUID` type.
- Translates `JSON` to standard `JSON` (acceptable, but lacks PostgreSQL `JSONB` optimizations).

Applying this SQL directly to Supabase would permanently lock the production database into sub-optimal SQLite emulated types.

## D. Migration History
**VERIFIED**. The migration chain (`init` -> `add_users` -> `sync_models`) is strictly linear, forward-only, and explicitly respects foreign key dependencies (i.e., `users` is created before `user_portfolio` references it).

## E. Schema Comparison
The SQLAlchemy models precisely define all 13 core tables. However, due to the dialect mismatch, the *emitted migration SQL* does not match the optimal PostgreSQL types intended by the SQLAlchemy models (e.g., `sa.Uuid()` -> `CHAR(32)` mismatch).

## F. Destructive Operation Audit
**NONE FOUND**. The generated SQL strictly consists of `CREATE TABLE`, `CREATE INDEX`, and `INSERT/UPDATE` for `alembic_version`. The only `CASCADE` operations are safe `ON DELETE CASCADE` foreign-key behaviors on child tables (`user_preferences` and `user_portfolio`).

## G. Dependency Order
**VERIFIED**. `users` table creation strictly precedes the `user_portfolio` and `user_preferences` tables.

## H. PostgreSQL Execution Test
**UNVERIFIED**. We cannot safely test PostgreSQL execution locally without a running Postgres instance or a valid connection string. 

## I. Empty vs Existing Database Analysis
**UNKNOWN PRODUCTION STATE**. Because Supabase credentials are not provided, we cannot guarantee Supabase is actually empty. If Supabase already contains standard tables (e.g., from an earlier tutorial or template), executing this full `CREATE TABLE` initialization script will cause fatal conflicts.

## J. RLS/Auth Boundary
**UNVERIFIED AT DB**. API-level isolation (`get_current_user`) is robust, but the actual database Row Level Security (RLS) policies on Supabase remain completely unverified.

## K. Findings
1. The generated SQL is SQLite-flavored, NOT PostgreSQL-flavored.
2. The production Supabase schema state is completely unverified.

## L. Blockers
1. Dialect mismatch (SQLite SQL vs Postgres DB).
2. Unknown production database state.

## M. Required Manual Verification
You MUST generate the SQL using a PostgreSQL dialect string. 
Run: `DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" alembic upgrade head --sql > postgres_migration.sql`
This forces Alembic to use the `psycopg2` / PostgreSQL dialect to emit true `UUID` and `TIMESTAMP WITH TIME ZONE` types.

## N. Final Verdict
**YELLOW — MANUAL VERIFICATION REQUIRED**. The codebase is safe, but the migration asset currently generated is incompatible with production PostgreSQL.
