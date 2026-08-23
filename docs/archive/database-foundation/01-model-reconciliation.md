# 01 - MODEL RECONCILIATION

## 1. The Core Divergence
During the Bin 2 audit, a major discrepancy was identified between the SQLAlchemy models and the Alembic history. Bin 3 physically verified the actual database schema and confirmed the exact state of the divergence.

## 2. Reconciliation Matrix

| Entity | Python Model | Alembic Generated? | Exists in DB? | Used by API | Status |
|---|---|---|---|---|---|
| `users` | `user.py` (SA 2.0) | No | Yes (via `create_all`) | Active | Orphaned in Alembic |
| `user_preferences` | `user.py` (SA 2.0) | No | Yes (via `create_all`) | Active | Orphaned in Alembic |
| `user_watchlists` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `user_portfolio` | `user.py` (SA 1.4 newly added)| No | No | Planned | Missing - Added in Bin 3 |
| `company_profiles` | `stock.py` (SA 2.0) | No | No | API Fallback | Missing - Added in Bin 3 |
| `market_data_cache` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `news_articles` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `sentiment_scores` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `ai_reports` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `source_logs` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `api_health_logs` | `cache_models.py` (SA 1.4) | Yes | Yes | Active | Synchronized |
| `technical_indicators` | `stock.py` (SA 2.0) | No | No | Active (pandas) | Missing - Added in Bin 3 |
| `ohlcv_cache` | `stock.py` (SA 2.0) | No | No | Active (pandas) | Missing - Added in Bin 3 |

## 3. Duplicate Models Deletion
`cache_models.py` previously had duplicate definitions (in SA 1.4 syntax) of models also found in `stock.py` and `intelligence.py` (in SA 2.0 syntax). Because `cache_models.py` was the basis of the existing production database, **the duplicate SA 2.0 definitions in `stock.py` and `intelligence.py` were safely deleted** to establish `cache_models.py` as the single source of truth for caching logic.

## 4. Remediation
`app/models/__init__.py` was updated to import all active models. Alembic successfully generated `74fbeece7800_sync_models.py` mapping the remaining missing tables, achieving 100% synchronization.
