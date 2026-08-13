# 09 - Production Migration Runbook

> [!CAUTION]
> **Production Safety Warning**
> You must execute this runbook manually. Automated CI/CD execution of Alembic is disabled until Supabase is verified.

## Step 1: Backup Supabase
1. Go to your Supabase Dashboard.
2. Navigate to Database -> Backups.
3. Trigger a manual snapshot.

## Step 2: Generate the SQL (Dry Run)
Run this locally to generate the PostgreSQL dialect SQL without applying it:
```bash
alembic upgrade head --sql > postgres_migration.sql
```

## Step 3: Apply the Schema
1. Open the Supabase Dashboard -> SQL Editor.
2. Paste the contents of `postgres_migration.sql`.
3. Review to ensure no `DROP TABLE` statements exist.
4. Execute the SQL.

## Step 4: Verify
1. Navigate to the Table Editor in Supabase.
2. Verify all 10 tables are created (including `users` and `user_portfolio`).
3. Deploy the Render backend.