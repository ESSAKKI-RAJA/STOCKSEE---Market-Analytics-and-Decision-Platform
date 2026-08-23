# 02 - PRODUCTION MIGRATION PLAN

## 1. Pre-Migration Checks
- **Backup**: Ensure a full automated backup of the Supabase PostgreSQL database is captured before running Alembic against production.
- **Current Revision**: Production is expected to be at `d75fd313a675_init`.
- **Target Revision**: `74fbeece7800_sync_models`

## 2. SQL Operations Review
The generated migration strictly performs `CREATE TABLE` and `CREATE INDEX` operations.
- `CREATE TABLE company_profiles`
- `CREATE TABLE ohlcv_cache`
- `CREATE TABLE technical_indicators`
- `CREATE TABLE user_portfolio`
- `CREATE INDEX` on foreign keys (`symbol`, `user_id`)

**Destructive Safety Check**:
- `DROP TABLE`: None.
- `DROP COLUMN`: None.
- `ALTER COLUMN` (type changes or strict nullability): None.
- **Result**: The migration is 100% non-destructive and perfectly preserves the existing cache tables and `user_watchlists`.

## 3. Execution Strategy
1. **Local Test**: `alembic upgrade head` executed locally on SQLite. Success.
2. **Production Approval**: Ensure Render environment variables (`DATABASE_URL`) point to the authenticated Supabase connection pool.
3. **Execution**: Run `alembic upgrade head` from a secure bash instance connected to the production URL, or let the CI/CD pipeline deploy it.

## 4. Rollback Strategy
If `user_portfolio` or `company_profiles` causes unforeseen SQLAlchemy mapping errors in production:
- Command: `alembic downgrade d75fd313a675`
- Impact: Automatically drops the 4 newly created tables. Will not touch cache data.
