import sqlite3

table_name = input("Enter table name: ")

conn = sqlite3.connect("event.db")
cursor = conn.cursor()

try:
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    column_names = [description[0] for description in cursor.description]
    print(" | ".join(column_names))
    print("-" * 50)

    for row in rows:
        print(" | ".join(str(value) for value in row))

except Exception as e:
    print("Error:", e)

conn.close()