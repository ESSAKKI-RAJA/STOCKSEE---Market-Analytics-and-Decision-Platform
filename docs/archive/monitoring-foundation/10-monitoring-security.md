# 10 - Monitoring Security

## Watchlist Ownership
The existing `get_watchlist` API already uses `current_user.id` from Clerk. We will strictly use the JWT token to fetch the watchlist symbols. 

For the Batch Intelligence endpoint, since it only returns public market analysis (not user data), it is safe to accept an array of symbols from the frontend.