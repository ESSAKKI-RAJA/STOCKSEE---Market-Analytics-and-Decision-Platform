# 05 - Authentication Security Audit

## Clerk Integration
- Frontend JWT generation verified.
- Backend `get_current_user` dependency requires valid JWT.
- User ID isolation enforced via `current_user.id` on all database operations (e.g., Portfolio, Watchlist).
- **Fixed**: `PyJWT` dependency ensures token verification succeeds in production.