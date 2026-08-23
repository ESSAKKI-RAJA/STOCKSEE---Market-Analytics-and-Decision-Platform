# 04 - RLS SECURITY AUDIT

## 1. Supabase RLS State
**Finding**: Supabase Row Level Security (RLS) is technically **non-functional** in the current architectural state.

## 2. Root Cause Analysis
1. **The SQLAlchemy Connection**: FastAPI connects to Supabase PostgreSQL using a standard `DATABASE_URL` via SQLAlchemy's connection pooling (`SessionLocal`).
2. **Missing JWT Passthrough**: When a user authenticates via Clerk, the backend validates the JWT in Python. However, it never passes that user context down into the PostgreSQL session (e.g., via `set_config('request.jwt.claim.sub', ...)`). 
3. **The Bypass**: Because SQLAlchemy connects using the connection-string password, it operates with full table privileges. RLS policies evaluating `auth.uid()` are bypassed or evaluate to NULL because the session context does not recognize the Clerk user.

## 3. Security Strategy (FastAPI Middleware vs RLS)
Because identity is managed by Clerk, not Supabase Auth, mapping `current_user` to PostgreSQL RLS requires a complex middleware to inject custom variables into every transaction.
- **Current Mitigation**: Strict isolation is now enforced at the application tier (Python). All user-owned data queries in `watchlist_service.py` are hard-coded to filter by `user_id`.
- **Target Ownership Model**: RLS should be deferred. The application tier acts as the definitive security boundary until a native Postgres-Clerk integration is warranted.
