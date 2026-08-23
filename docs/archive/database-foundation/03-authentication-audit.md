# 03 - AUTHENTICATION AUDIT

## 1. Actual Identity Flow
The frontend contains dependencies for both Clerk and Supabase, but the backend is definitively configured to validate **Clerk JWTs**.

**The Authenticated Flow**:
1. Frontend uses `@clerk/clerk-react` to authenticate.
2. The user's Bearer token (JWT) is sent in the `Authorization` header.
3. FastAPI's `get_token_from_request` intercepts it.
4. `verify_clerk_token` fetches the JWKS from Clerk (`api.clerk.com/v1/jwks`) and validates the RSA signature.
5. `get_current_user` matches the `sub` claim to the `User` model, dynamically inserting a new row in SQLite/PostgreSQL if it is their first login.

## 2. The Critical Security Flaw (Repaired)
**Finding**: Despite `deps.py` being perfectly configured, the `get_current_user` dependency was **never used** on any API routes in `main.py`.
**Consequence**: The `/api/watchlist` endpoints were entirely public. Because the `GET` route did not filter by `user_id`, it was returning *every user's watchlist* to the public internet. 

## 3. The Repair
- Injected `user: User = Depends(get_current_user)` into `get_watchlist_api`, `post_watchlist`, and `del_watchlist`.
- Enforced strict filtering (`.filter(UserWatchlist.user_id == user.id)`) on all CRUD queries in `watchlist_service.py`.

## 4. Single Source of Truth
**Clerk** is the verified identity provider for STOCKSEE. Supabase Auth is currently unused by the backend and can be safely considered a legacy or hybrid artifact.
