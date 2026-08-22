import sys
from datetime import datetime, timezone
import json

# Add backend to path
sys.path.append(r"d:\PROJECTS\STOCKSEE\backend")

from app.services.signal_service import generate_signal

def make_ind(mode="real", trend="Bullish", rsi=55, macd_hist=1.0, sma20=100, sma50=90, available=True, vol=1.0):
    return {
        "available": available,
        "trend": trend,
        "rsi": rsi,
        "macd": {"histogram": macd_hist},
        "moving_averages": {"sma_20": sma20, "sma_50": sma50},
        "volatility": vol,
        "_meta": {"mode": mode}
    }

def make_sent(mode="real", score=0.5, model="VADER"):
    return {
        "sentiment_score": score,
        "overall_sentiment": "Positive" if score > 0 else ("Negative" if score < 0 else "Neutral"),
        "model_used": model,
        "_meta": {"mode": mode, "news_mode": mode}
    }

def make_pred(mode="real"):
    return {"_meta": {"mode": mode}}

def run_test(name, ind, sent, pred):
    print(f"--- {name} ---")
    res = generate_signal(ind, sent, pred)
    print(f"Label: {res['signal_label']}")
    print(f"Confidence: {res['confidence']}")
    print(f"Risk: {res['risk_level']}")
    if res.get('conflicts'):
        print(f"Conflicts: {res['conflicts']}")
    print(f"Bullish Evidence: {res.get('bullish_evidence', [])}")
    print(f"Bearish Evidence: {res.get('bearish_evidence', [])}")
    print()

# CASE 1: Strong bullish alignment
run_test("CASE 1 - Strong Bullish", make_ind("real", "Bullish", 55, 1.0, 100, 90), make_sent("real", 0.5), make_pred("real"))

# CASE 2: Strong bearish alignment
run_test("CASE 2 - Strong Bearish", make_ind("real", "Bearish", 45, -1.0, 90, 100), make_sent("real", -0.5), make_pred("real"))

# CASE 3: Bullish trend + overbought RSI
run_test("CASE 3 - Bullish + Overbought", make_ind("real", "Bullish", 80, 1.0, 100, 90), make_sent("real", 0.5), make_pred("real"))

# CASE 4: Bearish technical + positive sentiment
run_test("CASE 4 - Bearish Tech + Positive Sent", make_ind("real", "Bearish", 45, -1.0, 90, 100), make_sent("real", 0.5), make_pred("real"))

# CASE 5: Poor data quality
run_test("CASE 5 - Poor Data Quality (Demo)", make_ind("demo", "Bullish", 55, 1.0, 100, 90), make_sent("demo", 0.5), make_pred("demo"))

# CASE 6: Insufficient history
run_test("CASE 6 - Insufficient History", make_ind(available=False), make_sent("real", 0.5), make_pred("real"))

# CASE 7: Missing sentiment
run_test("CASE 7 - Missing Sentiment", make_ind("real", "Bullish", 55, 1.0, 100, 90), make_sent("unavailable", 0.0, "None"), make_pred("real"))

# CASE 8: Extreme volatility
run_test("CASE 8 - Extreme Volatility", make_ind("real", "Bullish", 55, 1.0, 100, 90, vol=20.0), make_sent("real", 0.5), make_pred("real"))
