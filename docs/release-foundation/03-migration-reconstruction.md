# 03 - Migration Reconstruction

## The Flaw
The initial `sync_models` Alembic migration contained a foreign key (`user_portfolio.user_id`) pointing to `users.id`, but the `users` table was never tracked by Alembic. 

## The Fix
A new manual migration (`500000000000_add_users.py`) was spliced into the historical timeline:
`d75fd313a675` (init) -> `500000000000` (users) -> `74fbeece7800` (sync_models).

This guarantees that a fresh `alembic upgrade head` execution on a clean PostgreSQL database will successfully build the entire schema in dependency order.