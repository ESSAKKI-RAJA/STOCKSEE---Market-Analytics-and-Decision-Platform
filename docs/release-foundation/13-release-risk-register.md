# 13 - Release Risk Register

## Remaining Risks (Accepted)
- **Supabase Connectivity**: We have not verified if Render can establish a successful TLS connection to Supabase via the `postgresql://` string. The connection string might require `?sslmode=require`.
- **Alembic Timestamp Sync**: Running Alembic SQL manually in Supabase bypasses Alembic's `alembic_version` table tracking if not explicitly included in the SQL script.