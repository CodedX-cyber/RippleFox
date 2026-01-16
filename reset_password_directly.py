import sqlite3
import os
from django.contrib.auth.hashers import make_password

def reset_password():
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    print(f"Database path: {db_path}")
    
    # Generate a new password hash
    password = 'testpass123'
    password_hash = make_password(password)
    print(f"Generated password hash: {password_hash}")
    
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if the user exists
        cursor.execute("SELECT id, email, is_active FROM users_user WHERE email = ?", ('kingalale@gmail.com',))
        user = cursor.fetchone()
        
        if user:
            print(f"\nFound user: {user[1]} (ID: {user[0]}, Active: {bool(user[2])})")
            
            # Update the password and ensure the user is active
            cursor.execute(
                "UPDATE users_user SET password = ?, is_active = 1 WHERE email = ?",
                (password_hash, 'kingalale@gmail.com')
            )
            conn.commit()
            print("Password updated successfully!")
            
            # Verify the update
            cursor.execute("SELECT email, is_active FROM users_user WHERE email = ?", ('kingalale@gmail.com',))
            updated_user = cursor.fetchone()
            print(f"Updated user status - Email: {updated_user[0]}, Active: {bool(updated_user[1])}")
            
            print("\nYou can now log in with:")
            print(f"Email: kingalale@gmail.com")
            print(f"Password: {password}")
            
        else:
            print("\nUser not found in the database.")
            
    except sqlite3.Error as e:
        print(f"\nDatabase error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    reset_password()
