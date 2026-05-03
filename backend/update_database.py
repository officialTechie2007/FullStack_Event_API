import sqlite3

conn = sqlite3.connect("event.db")
cursor = conn.cursor()
try:
    
    cursor.execute("ALTER TABLE registrations ADD COLUMN attended BOOLEAN DEFAULT 0")
except:
    pass
try:
    cursor.execute("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0")
except:
    pass
try:
    
    cursor.execute("ALTER TABLE users ADD COLUMN otp TEXT")
except:
    pass
try:
    
    cursor.execute("ALTER TABLE users ADD COLUMN otp_expiry DATETIME")
except:
    pass
try:
    
    cursor.execute("ALTER TABLE users ADD COLUMN reset_token TEXT")
except:
    pass
try:
    
    cursor.execute("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME")
except:
    pass
conn.commit()
conn.close()

print("Column added successfully!")