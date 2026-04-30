import psycopg2
import psycopg2.extras

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "lost_found",    # ← your DB name in pgAdmin
    "user": "postgres",
    "password": "12345"  # ← your pgAdmin password
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

def execute_query(query, params=None, fetch=None):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cursor.execute(query, params)
        if fetch == "one":
            return cursor.fetchone()
        elif fetch == "all":
            return cursor.fetchall()
        else:
            conn.commit()
    finally:
        cursor.close()
        conn.close()