# Model Forensic Audit (Phase 1 & 2)

## Phase 1: Model Inventory
The following SQLAlchemy model files were inspected in `backend/app/models/`:

1. **`user.py`**:
   - `User` (SQLAlchemy 2.0 `Mapped` style)
   - `UserPreference` (SQLAlchemy 2.0 `Mapped` style)
   - `UserPortfolio` (SQLAlchemy 1.4 `Column` style)
2. **`cache_models.py`** (all SQLAlchemy 1.4 `Column` style):
   - `MarketDataCache`
   - `NewsArticle`
   - `SentimentScore`
   - `AIReport`
   - `SourceLog`
   - `ApiHealthLog`
   - `UserWatchlist`
3. **`stock.py`** (all SQLAlchemy 1.4 `Column` style):
   - `CompanyProfile`
   - `OHLCVCache`
   - `TechnicalIndicator`
4. **`system.py`**:
   - `APIHealthLog` (SQLAlchemy 2.0 `Mapped` style)
5. **`base.py`**: Standard `DeclarativeBase`.
6. **`__init__.py`**: Imports all models except `APIHealthLog`.

## Phase 2: Single Source of Truth
- **Duplicate Detection**: Both `system.py` (`APIHealthLog`) and `cache_models.py` (`ApiHealthLog`) define a table mapping to `api_health_logs`. 
- **Resolution**: A search across the repository shows that `system.py` is an orphan file; it is never imported in `__init__.py` or used anywhere in the application code. `ApiHealthLog` from `cache_models.py` is actively used in `cache_service.py`. 
- **Action**: `system.py` will be safely deleted to enforce the Single Source of Truth rule.

All other tables map 1:1 to unique model definitions.
