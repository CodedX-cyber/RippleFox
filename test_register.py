import requests
import json

# Test registration
def test_registration():
    url = "http://localhost:8000/api/v1/auth/register/"
    data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "password2": "testpassword123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_registration()
