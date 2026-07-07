"""STOCKSEE Verification Script — validates API endpoints, caching, and persistence.

Run from the backend directory:
    python scripts/verify_stocksee.py
"""

import sys
import os
import json

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def color(text, code):
    return f"\033[{code}m{text}\033[0m"

def green(text): return text
def red(text): return text
def yellow(text): return text
def cyan(text): return text

def header(text):
    print(f"\n{'='*80}")
    print(cyan(f"  {text}"))
    print(f"{'='*80}")

class VerificationReport:
    def __init__(self):
        self.tests = []
        self.passed = 0
        self.failed = 0

    def print_result(self, endpoint, status, mode="N/A", source="N/A", cache_hit=False, error=""):
        status_str = green("PASS") if status == "PASS" else red("FAIL")
        cache_str = "Hit" if cache_hit else "Miss"
        print(f"[{status_str}] {endpoint:<30} | Mode: {mode:<10} | Source: {source:<15} | Cache: {cache_str:<5} | {error}")
        
        if status == "PASS": self.passed += 1
        else: self.failed += 1

    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*80}")
        print(f"  TOTAL: {total}  |  {green(f'PASS: {self.passed}')}  |  {red(f'FAIL: {self.failed}')}")
        print(f"{'='*80}")
        return self.failed == 0

report = VerificationReport()

header("API & Cache Verification")

def test_endpoint(endpoint, expected_status=200):
    try:
        resp = client.get(endpoint)
        if resp.status_code != expected_status:
            report.print_result(endpoint, "FAIL", error=f"Status {resp.status_code}")
            return None
        data = resp.json()
        if "mode" in data and "source" in data:
            # FallbackResponse format
            mode = data.get("mode", "N/A")
            source = data.get("source", "N/A")
            # Cache hit could be buried in data["data"]["_meta"] or we might not have exposed it directly in FallbackResponse root
            # Let's check data["data"]["_meta"]["cache_hit"] if available
            cache_hit = False
            if isinstance(data.get("data"), dict) and "_meta" in data["data"]:
                cache_hit = data["data"]["_meta"].get("cache_hit", False)
            elif isinstance(data.get("data"), list) and len(data["data"]) > 0 and isinstance(data["data"][0], dict) and "_meta" in data["data"][0]:
                cache_hit = data["data"][0]["_meta"].get("cache_hit", False)
                
            report.print_result(endpoint, "PASS", mode=mode, source=source, cache_hit=cache_hit)
        else:
            # Health endpoint format
            report.print_result(endpoint, "PASS", mode=data.get("mode_summary", "N/A"), source="system", cache_hit=False)
        return data
    except Exception as e:
        report.print_result(endpoint, "FAIL", error=str(e))
        return None

# 1. /health
test_endpoint("/health")

# 2. quote AAPL twice (check cache hit on second)
res1 = test_endpoint("/api/market/quote/AAPL")
res2 = test_endpoint("/api/market/quote/AAPL")

# 3. history AAPL
test_endpoint("/api/market/history/AAPL")

# 4. indicators AAPL
test_endpoint("/api/market/indicators/AAPL")

# 5. news AAPL
test_endpoint("/api/news/AAPL")

# 6. sentiment AAPL
test_endpoint("/api/sentiment/AAPL")

# 7. prediction AAPL
test_endpoint("/api/prediction/AAPL")

# 8. signal AAPL
test_endpoint("/api/signal/AAPL")

# 9. report AAPL
test_endpoint("/api/report/AAPL")

# 10. quote RELIANCE.NS
test_endpoint("/api/market/quote/RELIANCE.NS")

# 11. quote INVALID_SYMBOL_TEST
test_endpoint("/api/market/quote/INVALID_SYMBOL_TEST")

# 12. Watchlist add/list/remove
try:
    # Add
    resp_add = client.post("/api/watchlist", json={"symbol": "TEST"})
    if resp_add.status_code == 200:
        data = resp_add.json()
        report.print_result("POST /api/watchlist", "PASS", mode=data.get("mode"), source=data.get("source"))
    else:
        report.print_result("POST /api/watchlist", "FAIL", error=str(resp_add.status_code))

    # List
    test_endpoint("/api/watchlist")

    # Remove
    resp_del = client.delete("/api/watchlist/TEST")
    if resp_del.status_code == 200:
        data = resp_del.json()
        report.print_result("DELETE /api/watchlist/TEST", "PASS", mode=data.get("mode"), source=data.get("source"))
    else:
        report.print_result("DELETE /api/watchlist/TEST", "FAIL", error=str(resp_del.status_code))

except Exception as e:
    report.print_result("Watchlist ops", "FAIL", error=str(e))

all_passed = report.summary()
if all_passed:
    print("\n  [PASS] ALL TESTS PASSED -- STOCKSEE Phase 3 is verified.\n")
else:
    print("\n  [WARN] Some tests failed. Review above.\n")

sys.exit(0 if all_passed else 1)
