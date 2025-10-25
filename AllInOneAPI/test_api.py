#!/usr/bin/env python3
"""
Test script to demonstrate API requests to your backend
Run this after starting your FastAPI server with: python main.py
"""

import httpx
import asyncio
import json

BASE_URL = "http://localhost:8000"

async def test_nessie_api():
    """Test Nessie API endpoints"""
    print("🏦 Testing Nessie API...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Get all accounts
            response = await client.get(f"{BASE_URL}/api/v1/accounts/")
            if response.status_code == 200:
                accounts = response.json()
                print(f"✅ Found {len(accounts)} accounts")
                if accounts:
                    print(f"   First account: {accounts[0].get('nickname', 'N/A')}")
            else:
                print(f"❌ Error getting accounts: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Nessie API error: {e}")

async def test_gemini_api():
    """Test Gemini AI endpoints"""
    print("\n🤖 Testing Gemini AI...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Get financial analysis
            response = await client.get(f"{BASE_URL}/api/v1/analytics/spending-analysis")
            if response.status_code == 200:
                analysis = response.json()
                print(f"✅ Financial analysis completed")
                print(f"   Total spending: ${analysis.get('total_spending', 0):.2f}")
            else:
                print(f"❌ Error getting analysis: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Gemini API error: {e}")

async def test_alpaca_api():
    """Test Alpaca API endpoints"""
    print("\n📈 Testing Alpaca API...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Get account info
            response = await client.get(f"{BASE_URL}/api/v1/stocks/account")
            if response.status_code == 200:
                account = response.json()
                print(f"✅ Trading account connected")
                print(f"   Portfolio value: ${account.get('portfolio_value', 0):.2f}")
            else:
                print(f"❌ Error getting account: {response.status_code}")
                
            # Get positions
            response = await client.get(f"{BASE_URL}/api/v1/stocks/positions")
            if response.status_code == 200:
                positions = response.json()
                print(f"✅ Found {len(positions)} positions")
                
        except Exception as e:
            print(f"❌ Alpaca API error: {e}")

async def test_dashboard():
    """Test comprehensive dashboard"""
    print("\n📊 Testing Dashboard...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_URL}/api/v1/analytics/dashboard")
            if response.status_code == 200:
                dashboard = response.json()
                print(f"✅ Dashboard data retrieved")
                print(f"   Net worth: ${dashboard.get('summary', {}).get('net_worth', 0):.2f}")
            else:
                print(f"❌ Error getting dashboard: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Dashboard error: {e}")

async def test_health():
    """Test basic health endpoint"""
    print("🏥 Testing Health Check...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                health = response.json()
                print(f"✅ Server is healthy: {health.get('status')}")
            else:
                print(f"❌ Health check failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Health check error: {e}")

async def main():
    """Run all tests"""
    print("🚀 Testing AllInOne Financial API")
    print("=" * 50)
    
    # Test basic connectivity first
    await test_health()
    
    # Test individual APIs
    await test_nessie_api()
    await test_gemini_api()
    await test_alpaca_api()
    
    # Test combined dashboard
    await test_dashboard()
    
    print("\n" + "=" * 50)
    print("✅ Testing completed!")
    print("\n💡 Tips:")
    print("- Make sure your .env file has valid API keys")
    print("- Visit http://localhost:8000/docs for interactive API docs")
    print("- Check the API_USAGE_GUIDE.md for detailed examples")

if __name__ == "__main__":
    asyncio.run(main())
