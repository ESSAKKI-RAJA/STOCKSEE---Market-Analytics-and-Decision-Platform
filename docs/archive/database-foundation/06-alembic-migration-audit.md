# 06 - ALEMBIC MIGRATION AUDIT

## 1. Configuration Review
- **`alembic.ini`**: Configured standardly. Uses the local SQLite database for development migrations.
- **`env.py`**: Properly configured to target `Base.metadata`. However, previously, `Base.metadata` only contained the models imported in `app/models/__init__.py`.

## 2. Missing Models Discrepancy
Because `user.py` and `stock.py` were not imported into `__init__.py`, Alembic's `target_metadata` was blind to `users`, `user_preferences`, `user_portfolio`, `company_profiles`, `ohlcv_cache`, and `technical_indicators`.

## 3. The Auto-Generation Solution
By re-exporting all models in `__init__.py`, the `alembic revision --autogenerate` command successfully detected the delta. 
- It did **not** attempt to recreate `market_data_cache` or `user_watchlists`.
- It dynamically mapped the remaining tables into `74fbeece7800_sync_models.py`.

## 4. SQLAlchemy 1.4 vs 2.0 Compatibility
Alembic successfully generated schema migrations for both `user_portfolio` (SA 1.4 `Column` syntax) and `company_profiles` (SA 2.0 `Mapped` syntax). The final database structures are identical and fully compatible.
