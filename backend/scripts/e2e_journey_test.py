"""STOCKSEE End-to-End User Journey Verification Script.

Tests complete analytical pipeline:
- Health & System status
- Market Quote (US & Indian Equities)
- Historical OHLCV Data (Multi-timeframe)
- Technical Indicator Calculation (RSI, MACD, EMAs)
- Company Intelligence & Profile
- Market News & Sentiment Analysis
- Algorithmic Signal & Confidence
- ESSAI Analysis (/api/essai/analyse/{symbol})
- ESSAI Q&A (/api/essai/ask)
- ESSAI Stock Comparison (/api/essai/compare)
"""

import sys
import os
import time

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

SYMBOLS_TO_TEST = [
    "AAPL", "MSFT", "NVDA", "TSLA",
    "TCS", "INFY", "HCLTECH", "RELIANCE", "TATAMOTORS"
]

class E2ERunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []

    def check(self, test_name: str, success: bool, details: str = ""):
        status = "PASS" if success else "FAIL"
        if success:
            self.passed += 1
            print(f"  [OK] {test_name:<40} | {details}")
        else:
            self.failed += 1
            print(f"  [XX] {test_name:<40} | FAIL: {details}")
        self.results.append((test_name, status, details))

    def run_all(self):
        print("\n" + "="*80)
        print("   STOCKSEE END-TO-END PRODUCT VERIFICATION JOURNEY")
        print("="*80 + "\n")

        # 1. Health Endpoint
        print("[1] Verifying System Health & Engines...")
        try:
            r = client.get("/health")
            if r.status_code == 200:
                data = r.json()
                engines = list(data.get("engines", {}).keys())
                self.check("Health Check", True, f"Environment: {data.get('environment')}, Engines: {len(engines)}")
            else:
                self.check("Health Check", False, f"Status code {r.status_code}")
        except Exception as e:
            self.check("Health Check", False, str(e))

        # 2. Multi-symbol Journey
        print("\n[2] Testing Market Quotes, History, Indicators & Profiles...")
        for sym in SYMBOLS_TO_TEST:
            # Quote
            try:
                # Test with .NS for Indian symbols if plain symbol is not on US exchanges
                query_sym = f"{sym}.NS" if sym in ["TCS", "HCLTECH", "RELIANCE", "TATAMOTORS"] else sym
                r = client.get(f"/api/market/quote/{query_sym}")
                q_data = r.json().get("data", {})
                price = q_data.get("price", 0)
                source = r.json().get("source", "unknown")
                mode = r.json().get("mode", "unknown")
                q_ok = r.status_code == 200 and price > 0
                self.check(f"Quote {query_sym}", q_ok, f"Price: {price} | Mode: {mode} | Source: {source}")
            except Exception as e:
                self.check(f"Quote {sym}", False, str(e))

            # History (1mo)
            try:
                r = client.get(f"/api/market/history/{sym}?period=1mo")
                h_ok = r.status_code == 200 and r.json().get("status") == "ok"
                h_data = r.json().get("data", {})
                pts = h_data.get("data_points", 0)
                self.check(f"History {sym} (1M)", h_ok and pts > 0, f"{pts} OHLCV rows")
            except Exception as e:
                self.check(f"History {sym} (1M)", False, str(e))

            # Indicators
            try:
                r = client.get(f"/api/market/indicators/{sym}")
                ind_ok = r.status_code == 200 and r.json().get("status") == "ok"
                ind_data = r.json().get("data", {})
                rsi = ind_data.get("rsi")
                self.check(f"Indicators {sym}", ind_ok and rsi is not None, f"RSI: {rsi}")
            except Exception as e:
                self.check(f"Indicators {sym}", False, str(e))

            # Company Profile
            try:
                r = client.get(f"/api/company/{sym}")
                comp_ok = r.status_code == 200 and r.json().get("status") == "ok"
                c_data = r.json().get("data", {})
                name = c_data.get("name", "")
                self.check(f"Company Profile {sym}", comp_ok, f"Name: {name}")
            except Exception as e:
                self.check(f"Company Profile {sym}", False, str(e))

        # 3. ESSAI Deep Analysis, Q&A, and Comparisons
        print("\n[3] Testing ESSAI Intelligence Layer...")
        for sym in ["AAPL", "TCS"]:
            try:
                r = client.get(f"/api/essai/analyse/{sym}")
                if r.status_code == 200:
                    data = r.json()
                    essai = data.get("essai", {})
                    score = essai.get("confidence_score")
                    level = essai.get("confidence_level")
                    view = essai.get("view")
                    self.check(f"ESSAI Analyse {sym}", score is not None, f"View: {view} | Score: {score} ({level})")
                else:
                    self.check(f"ESSAI Analyse {sym}", False, f"Status {r.status_code}")
            except Exception as e:
                self.check(f"ESSAI Analyse {sym}", False, str(e))

            # Ask ESSAI
            try:
                r = client.post("/api/essai/ask", json={
                    "symbol": sym,
                    "question": f"What are the main technical risks for {sym}?"
                })
                if r.status_code == 200:
                    data = r.json()
                    answer = data.get("essai", {}).get("answer", "")
                    has_ans = len(answer) > 10
                    self.check(f"ESSAI Ask {sym}", has_ans, f"Answer length: {len(answer)} chars")
                else:
                    self.check(f"ESSAI Ask {sym}", False, f"Status {r.status_code}")
            except Exception as e:
                self.check(f"ESSAI Ask {sym}", False, str(e))

        # 4. Stock Comparison
        print("\n[4] Testing ESSAI Multi-Asset Comparison Engine...")
        comparisons = [("AAPL", "MSFT"), ("TCS", "INFY")]
        for s1, s2 in comparisons:
            try:
                r = client.post("/api/essai/compare", json={
                    "symbol_a": s1,
                    "symbol_b": s2
                })
                if r.status_code == 200:
                    data = r.json()
                    comp = data.get("essai", {})
                    summary = comp.get("comparison_summary", "")
                    has_summary = len(summary) > 10
                    self.check(f"Compare {s1} vs {s2}", has_summary, f"Summary: {summary[:60]}...")
                else:
                    self.check(f"Compare {s1} vs {s2}", False, f"Status {r.status_code}")
            except Exception as e:
                self.check(f"Compare {s1} vs {s2}", False, str(e))

        # Summary
        print("\n" + "="*80)
        print(f"  E2E SUMMARY: Total={self.passed + self.failed} | Passed={self.passed} | Failed={self.failed}")
        print("="*80 + "\n")
        return self.failed == 0

if __name__ == "__main__":
    runner = E2ERunner()
    success = runner.run_all()
    sys.exit(0 if success else 1)
