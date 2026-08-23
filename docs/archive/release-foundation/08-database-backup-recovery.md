# 08 - Database Backup & Recovery

## Recovery Strategy
If the migration fails in production:
1. **Supabase PITR (Point in Time Recovery)**: Ensure PITR is enabled in your Supabase dashboard settings before running the migration.
2. **Alembic Downgrade**: DO NOT attempt to run `alembic downgrade`. The `user_portfolio` table drops foreign keys.
3. **Rollback**: Restore the Supabase PITR snapshot.