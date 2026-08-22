import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def check_health():
    try:
        r = requests.get(f"{BASE_URL}/health")
        return r.status_code, r.json()
    except Exception as e:
        return 500, str(e)

def get_report(symbol):
    try:
        r = requests.get(f"{BASE_URL}/api/report/{symbol}")
        return r.status_code, r.json()
    except Exception as e:
        return 500, str(e)

def post_batch(symbols):
    try:
        r = requests.post(f"{BASE_URL}/api/report/batch", json={"symbols": symbols})
        return r.status_code, r.json()
    except Exception as e:
        return 500, str(e)

if __name__ == "__main__":
    print("Testing Health Endpoint...")
    st, data = check_health()
    print(f"Health: {st} | {data}")

    print("\nTesting single report AAPL...")
    st, data = get_report("AAPL")
    print(f"Report AAPL: {st} | Mode: {data.get('mode', 'err')}")

    print("\nTesting Batch (5 symbols)...")
    start = time.time()
    st, data = post_batch(["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA"])
    duration = time.time() - start
    print(f"Batch 5: {st} in {duration:.2f}s | Mode: {data.get('mode', 'err')}")

    print("\nTesting Batch (10 symbols)...")
    symbols_10 = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "META", "AMZN", "NFLX", "AMD", "INTC"]
    start = time.time()
    st, data = post_batch(symbols_10)
    duration = time.time() - start
    print(f"Batch 10: {st} in {duration:.2f}s | Mode: {data.get('mode', 'err')}")

    print("\nTesting Batch Cache Hit (10 symbols)...")
    start = time.time()
    st, data = post_batch(symbols_10)
    duration = time.time() - start
    print(f"Batch 10 (Cache): {st} in {duration:.2f}s | Mode: {data.get('mode', 'err')}")
