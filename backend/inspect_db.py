import sqlite3
import json
import os

db_path = 'stocksee_dev.db'
if not os.path.exists(db_path):
    print(f"Database {db_path} does not exist.")
    exit(0)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
res = {}
for table in tables:
    table_name = table[0]
    cursor.execute(f"PRAGMA table_info({table_name});")
    cols = cursor.fetchall()
    res[table_name] = [{"name": c[1], "type": c[2], "pk": c[5]} for c in cols]

print(json.dumps(res, indent=2))
