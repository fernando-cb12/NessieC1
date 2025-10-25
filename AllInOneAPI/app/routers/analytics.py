from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
from datetime import datetime, timedelta

from app.core.database import get_db, redis_client
from app.services.nessie_service import NessieService
from app.services.gemini_service import GeminiService
from app.services.alpaca_service import AlpacaService

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data(db: Session = Depends(get_db)):
    """Get comprehensive dashboard data combining all APIs"""
    try:
        cache_key = "dashboard:comprehensive"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        # Fetch data from all services
        nessie_service = NessieService()
        gemini_service = GeminiService()
        alpaca_service = AlpacaService()
        
        # Get accounts and transactions
        accounts = await nessie_service.get_accounts()
        all_transactions = []
        
        for account in accounts:
            transactions = await nessie_service.get_account_transactions(account["_id"])
            all_transactions.extend(transactions)
        
        # Get investment data
        alpaca_account = await alpaca_service.get_account_info()
        positions = await alpaca_service.get_positions()
        
        # Generate AI analysis
        ai_analysis = await gemini_service.analyze_financial_data(accounts, all_transactions)
        
        # Calculate summary metrics
        total_balance = sum(account["balance"] for account in accounts)
        total_investments = alpaca_account["portfolio_value"]
        net_worth = total_balance + total_investments
        
        dashboard_data = {
            "summary": {
                "total_balance": total_balance,
                "total_investments": total_investments,
                "net_worth": net_worth,
                "buying_power": alpaca_account["buying_power"],
                "last_updated": datetime.utcnow().isoformat()
            },
            "accounts": accounts,
            "investments": {
                "account_info": alpaca_account,
                "positions": positions
            },
            "ai_analysis": ai_analysis,
            "recent_transactions": all_transactions[-20:]  # Last 20 transactions
        }
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(dashboard_data, default=str))
        
        return dashboard_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard data: {str(e)}")

@router.get("/spending-analysis")
async def get_spending_analysis(db: Session = Depends(get_db)):
    """Get detailed spending analysis"""
    try:
        cache_key = "analytics:spending"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        nessie_service = NessieService()
        accounts = await nessie_service.get_accounts()
        
        # Get transactions for the last 90 days
        all_transactions = []
        for account in accounts:
            transactions = await nessie_service.get_account_transactions(account["_id"])
            all_transactions.extend(transactions)
        
        # Analyze spending patterns
        spending_by_category = {}
        spending_by_month = {}
        
        for transaction in all_transactions:
            if transaction.get("amount", 0) < 0:  # Only expenses
                category = transaction.get("merchant", {}).get("category", "Other")
                spending_by_category[category] = spending_by_category.get(category, 0) + abs(transaction["amount"])
                
                # Group by month
                month = transaction.get("transaction_date", "")[:7]  # YYYY-MM
                spending_by_month[month] = spending_by_month.get(month, 0) + abs(transaction["amount"])
        
        analysis = {
            "spending_by_category": spending_by_category,
            "spending_by_month": spending_by_month,
            "total_spending": sum(spending_by_category.values()),
            "average_monthly_spending": sum(spending_by_month.values()) / max(len(spending_by_month), 1),
            "top_categories": sorted(spending_by_category.items(), key=lambda x: x[1], reverse=True)[:5]
        }
        
        # Cache for 10 minutes
        redis_client.setex(cache_key, 600, json.dumps(analysis))
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing spending: {str(e)}")

@router.get("/investment-analysis")
async def get_investment_analysis(db: Session = Depends(get_db)):
    """Get investment portfolio analysis"""
    try:
        cache_key = "analytics:investment"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        alpaca_service = AlpacaService()
        gemini_service = GeminiService()
        
        # Get portfolio data
        account_info = await alpaca_service.get_account_info()
        positions = await alpaca_service.get_positions()
        
        # Get historical data for analysis
        symbols = [pos["symbol"] for pos in positions]
        historical_data = {}
        
        for symbol in symbols:
            try:
                df = await alpaca_service.get_historical_data(symbol, 30)
                historical_data[symbol] = df.to_dict('records')
            except:
                continue
        
        # Generate AI analysis
        portfolio_data = {
            "account_info": account_info,
            "positions": positions,
            "historical_data": historical_data
        }
        
        ai_advice = await gemini_service.get_investment_advice(portfolio_data)
        
        analysis = {
            "portfolio_summary": {
                "total_value": account_info["portfolio_value"],
                "cash": account_info["cash"],
                "buying_power": account_info["buying_power"],
                "positions_count": len(positions)
            },
            "positions": positions,
            "ai_advice": ai_advice,
            "historical_data": historical_data
        }
        
        # Cache for 15 minutes
        redis_client.setex(cache_key, 900, json.dumps(analysis, default=str))
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing investments: {str(e)}")

@router.get("/financial-report")
async def generate_financial_report(db: Session = Depends(get_db)):
    """Generate comprehensive financial report"""
    try:
        cache_key = "report:comprehensive"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return {"report": cached_data.decode()}
        
        nessie_service = NessieService()
        gemini_service = GeminiService()
        
        accounts = await nessie_service.get_accounts()
        
        # Generate AI report
        report = await gemini_service.generate_financial_report("user_001", accounts)
        
        # Cache for 1 hour
        redis_client.setex(cache_key, 3600, report)
        
        return {"report": report}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")
