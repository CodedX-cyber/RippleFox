import os

# Read the .env file directly
with open('.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            try:
                key, value = line.split('=', 1)
                print(f"{key}: {value}")
            except ValueError:
                print(f"Skipping malformed line: {line}")
