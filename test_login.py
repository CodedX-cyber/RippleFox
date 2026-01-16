import requests
import json
import sys

# Test login with a known user
BASE_URL = 'http://localhost:8000/api/v1/auth/'

def test_login(email, password):
    url = f"{BASE_URL}login/"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    # Prepare the request data
    data = {
        'email': email,
        'password': password  # Send the password as-is, let requests handle the encoding
    }
    
    try:
        print(f"\n=== Testing login with email: {email} ===")
        print(f"Sending POST request to: {url}")
        print(f"Request data: {json.dumps(data, indent=2)}")
        
        # Print the raw request being sent
        print("\nSending request to:", url)
        print("Headers:", json.dumps(headers, indent=2))
        print("Data (raw):", data)
        
        try:
            response = requests.post(url, json=data, headers=headers)
        except requests.exceptions.RequestException as e:
            print("\nRequest failed:", str(e))
            print("If this is a connection error, make sure the Django server is running.")
            raise
        
        print(f"\nStatus Code: {response.status_code}")
        print("Response Headers:", json.dumps(dict(response.headers), indent=2))
        
        try:
            response_data = response.json()
            print("Response Body:", json.dumps(response_data, indent=2))
        except ValueError:
            print("Response Body (raw):", response.text)
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return True
        else:
            print(f"❌ Login failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Request failed: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response status: {e.response.status_code}")
            try:
                print("Response:", e.response.json())
            except:
                print("Response:", e.response.text)
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_registration():
    """Test user registration"""
    url = f"{BASE_URL}register/"
    data = {
        'email': 'testuser@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User',
        'password2': 'testpass123',
        'marketing_consent': False
    }
    
    try:
        print(f"\n=== Testing registration ===")
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print("Response:", response.json())
        return response.status_code == 201
    except Exception as e:
        print(f"Registration failed: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 2:
        # Test with provided credentials
        email = sys.argv[1]
        password = sys.argv[2]
        test_login(email, password)
    else:
        print("Usage: python test_login.py <email> <password>")
        print("Example: python test_login.py test@example.com password123")
        
        # Test with empty credentials (should fail with 400)
        print("\nTesting with empty credentials:")
        test_login("", "")
        
        # Test with invalid email format (should fail with 400)
        print("\nTesting with invalid email format:")
        test_login("invalid-email", "password")
        
        # Test with non-existent user (should fail with 400)
        print("\nTesting with non-existent user:")
        test_login("nonexistent@example.com", "password123")
