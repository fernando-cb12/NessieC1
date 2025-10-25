# AllInOne Financial API

A comprehensive backend API for financial data aggregation and analysis, integrating Nessie, Gemini AI, and Alpaca APIs.

## Features

- **Account Management**: Fetch and manage financial accounts from Nessie API
- **Group Management**: Handle shared accounts and group finances
- **Investment Tracking**: Real-time stock data and portfolio management via Alpaca
- **AI Analysis**: Financial insights and recommendations using Gemini AI
- **Analytics**: Comprehensive spending analysis and financial reports
- **Caching**: Redis-based caching for improved performance

## API Endpoints

### Accounts

- `GET /api/v1/accounts/` - Get all accounts
- `GET /api/v1/accounts/{account_id}` - Get specific account
- `POST /api/v1/accounts/` - Create new account
- `GET /api/v1/accounts/{account_id}/transactions` - Get account transactions

### Groups

- `GET /api/v1/groups/` - Get all groups
- `GET /api/v1/groups/{group_id}` - Get specific group
- `POST /api/v1/groups/` - Create new group
- `PUT /api/v1/groups/{group_id}` - Update group
- `DELETE /api/v1/groups/{group_id}` - Delete group

### Analytics

- `GET /api/v1/analytics/dashboard` - Comprehensive dashboard data
- `GET /api/v1/analytics/spending-analysis` - Spending pattern analysis
- `GET /api/v1/analytics/investment-analysis` - Investment portfolio analysis
- `GET /api/v1/analytics/financial-report` - AI-generated financial report

### Stocks

- `GET /api/v1/stocks/positions` - Get current positions
- `GET /api/v1/stocks/account` - Get trading account info
- `GET /api/v1/stocks/market-data/{symbol}` - Get market data
- `GET /api/v1/stocks/historical/{symbol}` - Get historical data
- `POST /api/v1/stocks/orders` - Place trading order
- `GET /api/v1/stocks/orders` - Get trading orders

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Copy environment variables:

```bash
cp env.example .env
```

3. Update `.env` with your API keys:

   - Nessie API key
   - Gemini AI API key
   - Alpaca API keys

4. Start Redis server (for caching)

5. Run the application:

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Architecture

### Services

- **NessieService**: Handles banking data from Nessie API
- **GeminiService**: AI analysis and insights
- **AlpacaService**: Stock trading and market data

### Database

- SQLite for local development
- Models for accounts, groups, transactions, and analytics cache

### Caching

- Redis for API response caching
- Configurable cache expiration times

## Security Notes

- All API keys are stored securely in environment variables
- External API calls are rate-limited
- Data is cached to reduce API calls
- CORS is configured for frontend integration
