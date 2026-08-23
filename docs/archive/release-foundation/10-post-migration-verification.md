# 10 - Post-Migration Verification

## To Be Executed by User
Once the runbook is complete, verify the following:
1. Hit `GET https://stocksee.onrender.com/health`.
2. Ensure `"database_configured": true` is returned.
3. Check Supabase dashboard for any new `api_health_logs` inserts.