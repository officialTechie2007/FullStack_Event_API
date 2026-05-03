import sqlite3

conn = sqlite3.connect("event.db")
cursor = conn.cursor()

def add_column(query):
    try:
        cursor.execute(query)
        print("Added:", query)
    except Exception as e:
        print("Skipped:", query)

# Add columns safely
add_column("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0")
add_column("ALTER TABLE users ADD COLUMN otp TEXT")
add_column("ALTER TABLE users ADD COLUMN otp_expiry DATETIME")

conn.commit()
conn.close()

print("Database update completed!")