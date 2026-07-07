@echo off
echo Stopping STOCKSEE Local Development Environment...
echo ===================================================

echo Finding process on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Killing PID %%a...
    taskkill /F /PID %%a
)

echo Finding process on port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing PID %%a...
    taskkill /F /PID %%a
)

echo Done. STOCKSEE should be stopped now.
pause
