import sqlite3
import os

def list_tables(db_path):
    """List all tables in the SQLite database."""
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
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
                    
                    # Show row count
                    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                    count = cursor.fetchone()[0]
                    print(f"  Rows: {count}")
                    
                    # Show first few rows if any
                    if count > 0:
                        cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                        rows = cursor.fetchall()
                        print("  Sample data:")
                        for row in rows[:3]:  # Show max 3 rows
                            print(f"    {row}")
                except sqlite3.Error as e:
                    print(f"  Error reading table: {e}")
                    
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    print(f"Checking database: {db_path}")
    list_tables(db_path)
