import sqlite3
import os

def check_schema():
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    print(f"Database path: {db_path}")
    
    if not os.path.exists(db_path):
        print("Error: Database file does not exist!")
        return
        
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List all tables
        print("\n=== Database Tables ===")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        for table in tables:
            print(f"\nTable: {table[0]}")
            try:
                cursor.execute(f"PRAGMA table_info({table[0]})")
                columns = cursor.fetchall()
                for col in columns:
                    print(f"  {col[1]} ({col[2]}) {'PRIMARY KEY' if col[5] else ''}")
            except:
                print("  (Could not get schema)")
        
        # Check users table
        print("\n=== Users Table Data ===")
        try:
            cursor.execute("SELECT * FROM users_user LIMIT 1")
            columns = [description[0] for description in cursor.description]
            print("Columns:", ", ".join(columns))
            
            cursor.execute("SELECT email, is_active, last_login FROM users_user")
            users = cursor.fetchall()
            print(f"\nFound {len(users)} users:")
            for user in users:
                print(f"- {user[0]} (Active: {bool(user[1])}, Last Login: {user[2]})")
        except Exception as e:
            print(f"Error querying users table: {e}")
            
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    check_schema()
