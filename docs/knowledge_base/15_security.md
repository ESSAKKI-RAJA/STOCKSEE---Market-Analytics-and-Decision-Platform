# 15 - SECURITY

## Authentication & Authorization
- **Provider**: Supabase Auth (with Clerk fallback support in `.env`).
- **Flow**: Frontend uses Supabase JS client to authenticate (Email/Password or Google OAuth PKCE). The resulting JWT is stored securely in local storage / cookies.
- **Backend Validation**: The FastAPI backend intercepts requests to protected routes via a dependency (e.g., `get_current_user` in `api/deps.py`). It decodes the JWT using `PyJWT` and validates it against the Supabase JWKS (JSON Web Key Set).

## Database Security (Row Level Security)
- Instead of complex backend authorization logic, Supabase PostgreSQL utilizes **Row Level Security (RLS)**.
- Policies ensure that `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on tables like `watchlist` and `user_portfolio` can only be executed where `auth.uid() = user_id`.

## Secrets & Environment Variables
- All API keys (`FINNHUB_API_KEY`, `SUPABASE_SECRET_KEY`) are stored in `.env` files and never committed to source control (ignored in `.gitignore`).
- Frontend env vars (`VITE_*`) expose only the anon/public keys, never the service role key.

## Protections
- **CORS**: Enforced by FastAPI `CORSMiddleware`. Only `localhost:5173` and the Vercel production domain are permitted.
- **Rate Limiting**: Currently absent on the FastAPI side, relying entirely on the hosting provider (Render/Cloudflare). *Security Roadmap: Implement `slowapi` for endpoint-level rate limiting.*
- **SQL Injection**: SQLAlchemy ORM inherently parameterizes queries, preventing SQL injection.

## Security Roadmap
- Implement strict JWT expiration and refresh token rotation.
- Add 2FA (Two-Factor Authentication) via Supabase.
- Add API rate limiting via `slowapi` to prevent malicious actors from burning the Finnhub API quota.
