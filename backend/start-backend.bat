@echo off
echo Starting STOCKSEE Backend...
cd /d "C:\Users\ESSAKKI RAJA T  EV\Desktop\STOCKSEE\backend"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
