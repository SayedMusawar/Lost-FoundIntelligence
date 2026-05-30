# ============================================================
# PATCH — Apply this to your backend/database.py
# Replace your hardcoded connection string with this:
# ============================================================

import os
import psycopg2

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def execute_query(query, params=None, fetch=None):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(query, params)
        conn.commit()
        if fetch == "one":
            return cur.fetchone()
        elif fetch == "all":
            return cur.fetchall()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()


# ============================================================
# PATCH — Apply this to your backend/main.py CORS section
# Replace your existing CORS origins list with this:
# ============================================================

import os
from fastapi.middleware.cors import CORSMiddleware

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

# In your app setup:
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[FRONTEND_URL, "http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
