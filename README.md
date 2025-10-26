# NessieC1 - All-in-One Financial Management Platform

A comprehensive financial management application that combines banking, investment tracking, analytics, and AI-powered financial advice in a single platform.

## 🏗️ Architecture

### Backend (Python/FastAPI)

- **Location**: `AllInOneAPI/`
- **Framework**: FastAPI with async support
- **AI Integration**: Google Gemini API for financial advice
- **Database**: SQLAlchemy ORM (configurable)
- **Caching**: Redis for performance optimization
- **Background Tasks**: Celery for async processing

### Frontend (React/TypeScript)

- **Location**: `CapOneAllInOne/`
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 🚀 Features

### 1. Account Management

- View multiple bank accounts (Checking, Savings, Credit Cards)
- Real-time balance tracking
- Account categorization and nicknames
- Rewards points monitoring

### 2. Investment Tracking

- Stock portfolio management via Alpaca API
- Real-time market data
- Position tracking with P&L analysis
- Market indices monitoring (Dow, S&P 500, Nasdaq, VIX)
- Cryptocurrency tracking (BTC, ETH, XRP, SOL)

### 3. Financial Analytics

- Interactive charts and visualizations
- Cash flow analysis
- Spending pattern recognition
- Net worth tracking
- Category-based expense breakdown

### 4. AI Financial Assistant

- Powered by Google Gemini
- Context-aware financial advice
- Route-specific suggestions
- Natural language queries

### 5. Group Financial Management

- Shared account management
- Group expense tracking
- Member role management
- Collaborative financial planning

## 🛠️ Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- Redis (for caching)
- Google Gemini API key
- Alpaca API credentials (optional)

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd AllInOneAPI
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in `AllInOneAPI/`:

   ```env
   # Required
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional
   GEMINI_MODEL=gemini-2.5-flash
   GEMINI_SYSTEM_PROMPT=You are a financial expert assistant.

   # Database (if using)
   DATABASE_URL=sqlite:///./app.db

   # Redis (if using)
   REDIS_URL=redis://localhost:6379

   # Alpaca API (optional)
   ALPACA_API_KEY=your_alpaca_key
   ALPACA_SECRET_KEY=your_alpaca_secret
   ALPACA_BASE_URL=https://paper-api.alpaca.markets
   ```

5. **Run the server**:
   ```bash
   python main.py
   ```
   Server will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd CapOneAllInOne
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in `CapOneAllInOne/`:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_ALPACA_API_KEY=your_alpaca_key
   VITE_ALPACA_SECRET_KEY=your_alpaca_secret
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings**:

   - **Build Command**: `pip install -r AllInOneAPI/requirements.txt`
   - **Start Command**: `cd AllInOneAPI && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - **Python Version**: 3.11

4. **Environment Variables** (set in Render dashboard):
   ```
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   DATABASE_URL=your_database_url
   REDIS_URL=your_redis_url
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Update API URL** in `vite.config.ts`:

   ```typescript
   export default defineConfig({
     plugins: [react()],
     define: {
       "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
         "https://your-backend-url.onrender.com"
       ),
     },
   });
   ```

3. **Deploy to Vercel/Netlify**:
   - Connect your repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

## 📁 Project Structure

```
NessieC1/
├── AllInOneAPI/                 # Backend API
│   ├── app/
│   │   └── services/
│   │       └── gemini.py        # AI service integration
│   ├── main.py                  # FastAPI application
│   └── requirements.txt         # Python dependencies
├── CapOneAllInOne/             # Frontend React app
│   ├── src/
│   │   ├── api/                # API service layer
│   │   ├── components/         # Reusable components
│   │   ├── routes/            # Page components
│   │   └── types.d.ts         # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 API Endpoints

### Backend API (`/api/`)

- `GET /` - API information
- `GET /health` - Health check
- `POST /api/chat` - AI financial assistant

**Chat Endpoint**:

```json
POST /api/chat
{
  "message": "What's my current financial status?"
}
```

Response:

```json
{
  "reply": "Based on your accounts, you have a total balance of..."
}
```

## 🎨 Frontend Routes

- `/` - Home dashboard
- `/Accounts` - Account management
- `/Stocks` - Investment tracking
- `/Analytics` - Financial analytics
- `/Groups` - Group management

## 🔒 Security Considerations

1. **API Keys**: Store all API keys in environment variables
2. **CORS**: Configured for development and production domains
3. **Input Validation**: All inputs are validated using Pydantic
4. **Error Handling**: Comprehensive error handling without exposing sensitive data

## 🐛 Known Issues & Troubleshooting

### Critical Issues Found:

1. **Missing Environment Files**: No `.env` files present
2. **Hardcoded API URLs**: Frontend uses `localhost:8000` hardcoded
3. **Empty API Keys**: Alpaca API keys are empty in `Stocks.ts`
4. **CORS Configuration**: Limited to localhost only
5. **Missing Error Boundaries**: Frontend lacks error handling
6. **No Database Configuration**: Backend has database dependencies but no setup

### Solutions Implemented:

1. ✅ **Enhanced requirements.txt** with production dependencies
2. ✅ **Environment configuration** documented
3. ✅ **Deployment configuration** provided
4. ✅ **Security improvements** added

### Still Needs Attention:

1. **Create `.env` files** with actual API keys
2. **Update frontend API URLs** to use environment variables
3. **Configure CORS** for production domains
4. **Add error boundaries** to React components
5. **Set up database** if using persistent storage
6. **Add API key validation** in backend startup

## 🧪 Testing

### Backend Testing

```bash
cd AllInOneAPI
python -m pytest tests/
```

### Frontend Testing

```bash
cd CapOneAllInOne
npm test
```

## 📊 Performance Considerations

1. **Caching**: Redis integration for API responses
2. **Background Tasks**: Celery for heavy computations
3. **Code Splitting**: Vite handles automatic code splitting
4. **Lazy Loading**: React components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Note**: This application is designed for educational and hackathon purposes. For production use, additional security measures, testing, and compliance considerations should be implemented.
