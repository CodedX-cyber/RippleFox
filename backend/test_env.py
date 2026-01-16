import os
import sys
from pathlib import Path
import environ

# Set up the environment
BASE_DIR = Path(__file__).resolve().parent
env = environ.Env()

# Try to read .env file
env_file = os.path.join(BASE_DIR, '.env')
print(f"Looking for .env file at: {env_file}")
print(f".env file exists: {os.path.exists(env_file)}")

if os.path.exists(env_file):
    print("Reading .env file...")
    env.read_env(env_file)
    print("Environment variables loaded from .env file")
    
    # Try to get values
    try:
        print(f"DEBUG: {env('DEBUG')}")
        print(f"SECRET_KEY: {'*' * len(env('SECRET_KEY')) if env('SECRET_KEY') else 'NOT SET'}")
        print(f"ALLOWED_HOSTS: {env('ALLOWED_HOSTS')}")
    except Exception as e:
        print(f"Error reading environment variables: {e}")
        print(f"Current environment: {os.environ}")
else:
    print("No .env file found")
