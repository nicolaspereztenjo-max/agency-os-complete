
import requests
import json
import warnings
warnings.filterwarnings("ignore")

BASE_URL = "http://127.0.0.1:8000"

def test_generate_strategy():
    print("Testing Strategy Generation...")
    payload = {
        "brand_context": "Eco-friendly coffee shop called 'Verde Brew'. Values: sustainable, organic, community.",
        "audience": "Young professionals"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/strategy/generate", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("SUCCESS: Strategy generated.")
            print(json.dumps(data, indent=2))
            return data
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        # We might not have the server running, but let's assume we can run this test locally if the server was up. 
        # Since I can't start the server successfully in background easily in this environment without blocking, 
        # I'll rely on unit test style if possible, or assume user will run server.
        # Actually, for this environment, I'll try to verify by importing the app object and using TestClient.
        print(f"Error connecting: {e}")
        return None

def test_export_pdf(strategy_data):
    if not strategy_data:
        print("Skipping export test due to missing data.")
        return

    print("\nTesting PDF Export...")
    try:
        response = requests.post(f"{BASE_URL}/strategy/export", json=strategy_data)
        if response.status_code == 200:
            with open("test_strategy.pdf", "wb") as f:
                f.write(response.content)
            print("SUCCESS: PDF saved to test_strategy.pdf")
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # In this environment, we might want to use TestClient instead of requests if server isn't running.
    # Let's try to import the app and use TestClient.
    try:
        from fastapi.testclient import TestClient
        import sys
        import os
        
        # Add backend to path
        sys.path.append(os.path.join(os.getcwd(), 'backend'))
        
        # We need to make sure we can import the app. 
        # Since we are in 'scratch/agency_os', the app is in 'backend.main'
        from backend.main import app
        
        client = TestClient(app)
        
        print("Using TestClient...")
        
        # 1. Generate
        print("Testing Strategy Generation...")
        payload = {
            "brand_context": "Eco-friendly coffee shop called 'Verde Brew'. Values: sustainable, organic, community.",
            "audience": "Young professionals"
        }
        response = client.post("/strategy/generate", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("SUCCESS: Strategy generated.")
            # print(json.dumps(data, indent=2))
            
            # 2. Export
            print("\nTesting PDF Export...")
            response_pdf = client.post("/strategy/export", json=data)
            if response_pdf.status_code == 200:
                with open("test_strategy.pdf", "wb") as f:
                    f.write(response_pdf.content)
                print("SUCCESS: PDF saved to test_strategy.pdf")
            else:
                print(f"FAILED Export: {response_pdf.status_code}")
                print(response_pdf.text)
        else:
            print(f"FAILED key generation: {response.status_code}")
            print(response.text)

    except ImportError as e:
        print(f"Could not import app for TestClient: {e}")
        print("Please ensure you are running this from the agency_os root.")
    except Exception as e:
        print(f"An error occurred: {e}")
