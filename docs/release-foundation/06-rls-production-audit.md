# 06 - RLS Production Audit

## Supabase Row Level Security
Currently, the application accesses the database directly via standard SQLAlchemy using the `DATABASE_URL` pooling connection. 

Row Level Security (RLS) is currently **bypassed** because the application uses standard SQL CRUD operations behind the FastAPI server. FastAPI enforces tenant isolation via the `get_current_user` dependency (Clerk JWT), which restricts queries to `WHERE user_id = :user_id`.

**Recommendation**: Enable Supabase RLS only if you plan to expose the Supabase Data API directly to the frontend. Since we use a dedicated FastAPI backend, backend-enforced isolation is secure.