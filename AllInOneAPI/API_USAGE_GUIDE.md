# API Request Guide - How to Use Your Backend APIs

## Overview

Your backend acts as a centralized gateway to three external APIs:

- **Nessie API** → Banking data (accounts, transactions)
- **Gemini AI** → Financial analysis and insights
- **Alpaca API** → Stock trading and market data

## 1. NESSIE API REQUESTS

### Get All Accounts

```bash
GET http://localhost:8000/api/v1/accounts/
```

### Get Specific Account

```bash
GET http://localhost:8000/api/v1/accounts/{account_id}
```

### Get Account Transactions

```bash
GET http://localhost:8000/api/v1/accounts/{account_id}/transactions
```

### Create New Account

```bash
POST http://localhost:8000/api/v1/accounts/
Content-Type: application/json

{
  "type": "Checking",
  "nickname": "My New Account",
  "rewards": 0,
  "balance": 1000.00,
  "account_number": "1234567890",
  "customer_id": "cust_001"
}
```

## 2. GEMINI AI REQUESTS

### Get Financial Analysis

```bash
GET http://localhost:8000/api/v1/analytics/spending-analysis
```

### Get Investment Analysis

```bash
GET http://localhost:8000/api/v1/analytics/investment-analysis
```

### Generate Financial Report

```bash
GET http://localhost:8000/api/v1/analytics/financial-report
```

### Get Comprehensive Dashboard (All APIs Combined)

```bash
GET http://localhost:8000/api/v1/analytics/dashboard
```

## 3. ALPACA API REQUESTS

### Get Trading Account Info

```bash
GET http://localhost:8000/api/v1/stocks/account
```

### Get Current Positions

```bash
GET http://localhost:8000/api/v1/stocks/positions
```

### Get Market Data for Symbol

```bash
GET http://localhost:8000/api/v1/stocks/market-data/AAPL
```

### Get Historical Data

```bash
GET http://localhost:8000/api/v1/stocks/historical/AAPL?days=30
```

### Place Trading Order

```bash
POST http://localhost:8000/api/v1/stocks/orders
Content-Type: application/json

{
  "symbol": "AAPL",
  "qty": 10,
  "side": "buy",
  "type": "market"
}
```

### Get Trading Orders

```bash
GET http://localhost:8000/api/v1/stocks/orders
GET http://localhost:8000/api/v1/stocks/orders?status=filled
```

## 4. GROUPS MANAGEMENT

### Get All Groups

```bash
GET http://localhost:8000/api/v1/groups/
```

### Get Specific Group

```bash
GET http://localhost:8000/api/v1/groups/{group_id}
```

### Create New Group

```bash
POST http://localhost:8000/api/v1/groups/
Content-Type: application/json

{
  "id": "group_001",
  "name": "Family Fund",
  "description": "Shared family expenses",
  "type": "family",
  "icon": "👨‍👩‍👧‍👦",
  "color": "#D32F2F",
  "members": [
    {
      "id": "member_001",
      "name": "John Doe",
      "email": "john@email.com",
      "role": "admin"
    }
  ],
  "sharedAccounts": [],
  "totalBalance": 0
}
```

## 5. FRONTEND INTEGRATION EXAMPLES

### JavaScript/TypeScript Examples

```javascript
// Fetch accounts from Nessie
const fetchAccounts = async () => {
  const response = await fetch("http://localhost:8000/api/v1/accounts/");
  const accounts = await response.json();
  return accounts;
};

// Get AI analysis
const getFinancialAnalysis = async () => {
  const response = await fetch(
    "http://localhost:8000/api/v1/analytics/dashboard"
  );
  const analysis = await response.json();
  return analysis;
};

// Get stock positions from Alpaca
const getStockPositions = async () => {
  const response = await fetch("http://localhost:8000/api/v1/stocks/positions");
  const positions = await response.json();
  return positions;
};

// Place a stock order
const placeOrder = async (symbol, qty, side) => {
  const response = await fetch("http://localhost:8000/api/v1/stocks/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: symbol,
      qty: qty,
      side: side,
      type: "market",
    }),
  });
  return await response.json();
};
```

### Python Examples

```python
import httpx

# Fetch accounts
async def get_accounts():
    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8000/api/v1/accounts/')
        return response.json()

# Get AI analysis
async def get_analysis():
    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8000/api/v1/analytics/dashboard')
        return response.json()

# Place stock order
async def place_order(symbol, qty, side):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/api/v1/stocks/orders',
            json={
                'symbol': symbol,
                'qty': qty,
                'side': side,
                'type': 'market'
            }
        )
        return response.json()
```

## 6. ERROR HANDLING

All endpoints return consistent error responses:

```json
{
  "detail": "Error message here"
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 7. CACHING

- **Accounts**: Cached for 5 minutes
- **Transactions**: Cached for 2 minutes
- **Market Data**: Cached for 1 minute
- **Analytics**: Cached for 5-15 minutes

## 8. SETUP REQUIREMENTS

1. **Environment Variables** (in `.env` file):

```bash
NESSIE_API_KEY=your_nessie_key
GEMINI_API_KEY=your_gemini_key
ALPACA_API_KEY=your_alpaca_key
ALPACA_SECRET_KEY=your_alpaca_secret
```

2. **Start the server**:

```bash
python main.py
```

3. **Test endpoints**:
   Visit `http://localhost:8000/docs` for interactive API documentation
