# How to Run STOCKSEE Locally

This guide explains how to reliably start and stop the STOCKSEE application on your local Windows machine.

## One-Click Start Method
1. Double-click the `start-stocksee-dev.bat` script located in the project root folder.
2. This script automatically starts the backend server in one terminal and the frontend in another.
3. The browser should be manually opened to **http://127.0.0.1:5173**.

## One-Click Stop Method
1. Double-click the `stop-stocksee-dev.bat` script located in the project root.
2. This script cleanly kills any running Node.js or Python processes holding the application ports (5173 and 8000).

## Expected URLs
- **Frontend App:** http://127.0.0.1:5173
- **Backend API:** http://127.0.0.1:8000
- **Backend Health Check:** http://127.0.0.1:8000/health

## Local Doctor Diagnostics
If you experience any issues, double-click `diagnose-stocksee.bat`. This will verify node, python, node_modules, .venv, and whether the required ports are occupied by stale processes.

## Manual Start Commands
If you prefer not to use the `.bat` scripts, you can run the commands manually:
**Backend:**
```cmd
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
**Frontend:**
```cmd
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

## Troubleshooting "Localhost Refused to Connect"
- **Issue:** The browser displays "localhost refused to connect".
- **Cause:** The port (5173 or 8000) was stuck from a previous crashed run, or Windows resolved "localhost" to IPv6 `::1` while the server was bound to IPv4 `127.0.0.1`.
- **Fix:** Always use the `stop-stocksee-dev.bat` script to clear out dead processes. Always visit the application via `127.0.0.1:5173` instead of `localhost:5173`. If you just restarted your laptop, just run the `start-stocksee-dev.bat` script again.
