# 05 - USER DATA SCHEMA

## 1. Application Identity Model
STOCKSEE separates application profile data from authentication data. Clerk holds passwords, emails, and MFA. STOCKSEE holds a normalized `users` table synced via JWT claims.

## 2. The `users` Table
- `id`: Primary Key (matches Clerk `sub`).
- `full_name`: Extracted from JWT on first login.
- `email`: Extracted from JWT.
- **Purpose**: Serves as the strict Foreign Key target for all user-owned data, preventing Orphan Data risks.

## 3. User Ownership Entities
1. **UserPreference**
   - 1:1 relationship with `User`.
   - Stores `theme`, `default_view`, `risk_tolerance`.
2. **UserWatchlist**
   - 1:N relationship with `User`.
   - Stores `symbol`.
3. **UserPortfolio** (Newly Created)
   - 1:N relationship with `User`.
   - Stores `symbol`, `quantity`, `average_price`.

## 4. The Orphan Data Risk (Resolved)
Bin 2 raised a concern that `user_watchlists.user_id` was just a string without an FK constraint. Because `users` is now formally modeled and integrated into the SQLAlchemy schema, future migrations will enforce strict `ondelete="CASCADE"` constraints, tying `user_watchlists` and `user_portfolio` directly to the `users` table.
