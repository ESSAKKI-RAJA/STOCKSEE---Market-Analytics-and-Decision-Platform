# 02 - SQLite to PostgreSQL Compatibility Audit

## 1. Type Mappings
- **SQLite JSON**: Emulated via text.
- **PostgreSQL JSON**: Native JSON type. Safe for migration.
- **SQLite Uuid**: Emulated via string hex.
- **PostgreSQL UUID**: Native UUID type. Safe, provided the SQLAlchemy driver (`psycopg2`) handles the conversion cleanly.

## 2. Constraints
- **SQLite Foreign Keys**: Must be explicitly enabled with `PRAGMA foreign_keys = ON`.
- **PostgreSQL Foreign Keys**: Natively enforced. The `ON DELETE CASCADE` specified in Alembic will be strictly enforced by PostgreSQL.

## 3. ALTER TABLE Behavior
- SQLite has notoriously limited `ALTER TABLE` support (often requiring table reconstruction).
- PostgreSQL supports robust `ALTER TABLE`. Our forward-only migration strategy guarantees safe table creation without destructive ALTERs.