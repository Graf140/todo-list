import psycopg2

params = {
    "host": "localhost",
    "database": "todo-list",
    "user": "postgres",
    "password": "admin",  # ← меняй это значение
    "port": "5432"
}

print(f"Trying to connect with: {params}")

try:
    conn = psycopg2.connect(**params)
    print("✅ SUCCESS! Database connected.")
    conn.close()
except psycopg2.OperationalError as e:
    print(f"❌ FAILED: {e}")