import os
import sys
import sqlite3

def check_database():
    """Check database connection and list tables."""
    # Try to find the database file
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    if not os.path.exists(db_path):
        db_path = os.path.join(os.path.dirname(__file__), 'backend', 'db.sqlite3')
    
    print(f"Checking database at: {db_path}")
    
    if not os.path.exists(db_path):
        print("Error: Database file not found!")
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
                table_name = table[0]
                print(f"\nTable: {table_name}")
                
                # Get table info
                try:
                    cursor.execute(f"PRAGMA table_info({table_name})")
                    columns = cursor.fetchall()
                    print("  Columns:")
                    for col in columns:
                        print(f"    {col[1]} ({col[2]})")
                except sqlite3.Error as e:
                    print(f"  Error reading table info: {e}")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_database()
