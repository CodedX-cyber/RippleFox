import sqlite3
import os

def test_connection():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db.sqlite3')
    print(f"Testing database at: {db_path}")
    
    if not os.path.exists(db_path):
        print("Error: Database file does not exist!")
        return
        
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get SQLite version
        cursor.execute("SELECT sqlite_version()")
        version = cursor.fetchone()[0]
        print(f"SQLite version: {version}")
        
        # List all tables
        print("\n=== Database Tables ===")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        if not tables:
            print("No tables found in the database.")
        else:
            for table in tables:
                print(f"- {table[0]}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    test_connection()
