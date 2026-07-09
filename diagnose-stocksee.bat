@echo off
echo ===================================================
echo   STOCKSEE Local Environment Diagnostics
echo ===================================================
echo.

echo [1/6] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   [FAIL] Node.js not found. Install from https://nodejs.org
) else (
    for /f "tokens=*" %%v in ('node --version') do echo   [PASS] Node.js %%v
)

echo [2/6] Checking Python...
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   [FAIL] Python not found.
) else (
    for /f "tokens=*" %%v in ('python --version') do echo   [PASS] %%v
)

echo [3/6] Checking Frontend node_modules...
if exist "%~dp0frontend\node_modules" (
    echo   [PASS] node_modules exists
) else (
    echo   [FAIL] node_modules missing. Run: cd frontend ^&^& npm install
)

echo [4/6] Checking Backend .venv...
if exist "%~dp0backend\.venv\Scripts\python.exe" (
    echo   [PASS] .venv exists
) else (
    echo   [FAIL] .venv missing. Run: cd backend ^&^& python -m venv .venv ^&^& .venv\Scripts\pip install -r requirements.txt
)

echo [5/6] Checking port 5173 (Frontend)...
netstat -ano | findstr ":5173 " | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [INFO] Port 5173 is OCCUPIED (frontend running or stale process)
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " ^| findstr "LISTENING"') do echo          PID: %%a
) else (
    echo   [INFO] Port 5173 is FREE
)

echo [6/6] Checking port 8000 (Backend)...
netstat -ano | findstr ":8000 " | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [INFO] Port 8000 is OCCUPIED (backend running or stale process)
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 " ^| findstr "LISTENING"') do echo          PID: %%a
) else (
    echo   [INFO] Port 8000 is FREE
)

echo.
echo --- Backend Health Check ---
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/health' -UseBasicParsing -TimeoutSec 5; Write-Output ('  [PASS] Backend responded: HTTP ' + $r.StatusCode) } catch { Write-Output '  [FAIL] Backend not reachable at http://127.0.0.1:8000/health' }"

echo --- Frontend HTML Check ---
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5173' -UseBasicParsing -TimeoutSec 5; if ($r.Content.Length -gt 100) { Write-Output ('  [PASS] Frontend HTML loaded (' + $r.Content.Length + ' bytes)') } else { Write-Output '  [WARN] Frontend HTML is very small -- may be blank' } } catch { Write-Output '  [FAIL] Frontend not reachable at http://127.0.0.1:5173' }"

echo.
echo ===================================================
echo   If backend or frontend are not running:
echo     start-stocksee-dev.bat
echo   If ports are stuck:
echo     stop-stocksee-dev.bat
echo   If UI is blank in browser:
echo     Check browser console (F12) for errors
echo     Verify frontend/.env has VITE_API_BASE_URL set
echo ===================================================
pause
