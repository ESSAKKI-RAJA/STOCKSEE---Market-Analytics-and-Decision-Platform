# 01 - CRUD DESIGN

## 1. Separation of Concerns
The fundamental data philosophy of STOCKSEE is a strict separation between **User-Owned Data** and **Market Data**.
- **User-Owned Data** follows traditional CRUD paradigms (Create, Read, Update, Delete). The user is the authoritative owner.
- **Market Data** is Read/Process/Analyze exclusively. Users cannot mutate historical OHLCV data, company fundamentals, or AI sentiment scores.

## 2. CRUD Matrix (User-Owned Data)

| Entity | Exists? | Create | Read | Update | Delete | Owner | DB Table | API | Frontend | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| **User** | Defined, Not Migrated | Yes | Yes | Yes | Yes | User | `users` | N/A | Auth | P0 |
| **Profile/Prefs** | Defined, Not Migrated | Yes | Yes | Yes | No | User | `user_preferences`| N/A | Settings | P1 |
| **Watchlist** | Partially | Yes | Yes | No | Yes | User | `user_watchlists`| `/api/watchlist` | Watchlist | P0 |
| **Portfolio** | Planned | Yes | Yes | Yes | Yes | User | `user_portfolio` | N/A | Portfolio | P1 |
| **Alerts** | Planned | Yes | Yes | Yes | Yes | User | `user_alerts` | N/A | Alerts | P2 |

## 3. Discrepancy Report: The Alembic Migration Gap
**CRITICAL FINDING**: An audit of `app/models/__init__.py` and the `alembic/versions/d75fd313a675_init.py` migration script reveals that the `users`, `user_preferences`, and other user-oriented models defined in `app/models/user.py` were **NOT** exported and thus **NOT** generated in the database schema.
Currently, only the `UserWatchlist` (from `cache_models.py`) actually exists in the DB. The other tables are phantom definitions in Python that do not map to actual PostgreSQL/SQLite structures.

## 4. API Contract Design (CRUD)

### Watchlist API (Existing / Required)
- **GET `/api/watchlist`**
  - **Auth**: Required (JWT).
  - **Action**: Reads the user's watchlist symbols from `user_watchlists`.
- **POST `/api/watchlist`**
  - **Auth**: Required.
  - **Schema**: `{"symbol": "AAPL"}`
  - **Action**: Creates a new record in `user_watchlists` for the user.
- **DELETE `/api/watchlist/{symbol}`**
  - **Auth**: Required.
  - **Action**: Deletes the specific symbol from the user's watchlist.

### Portfolio API (Planned)
- **GET `/api/portfolio`**
  - **Auth**: Required. Returns list of holdings.
- **POST `/api/portfolio/transaction`**
  - **Auth**: Required. 
  - **Schema**: `{"symbol": "AAPL", "quantity": 10, "price": 150.00, "type": "BUY"}`
- **DELETE `/api/portfolio/transaction/{id}`**
  - **Auth**: Required. Reverses a trade.

## 5. Security & Authorization (IDOR Prevention)
The primary security layer relies on Supabase Row Level Security (RLS) in production and JWT extraction in FastAPI. 
All CRUD operations must enforce: `SELECT * FROM table WHERE user_id = current_user_id()`. 
A user attempting to `DELETE /api/watchlist/{symbol}` without a valid session or targeting a different user's ID must receive an HTTP 401/403.
