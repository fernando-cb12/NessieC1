from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from app.core.database import get_db, redis_client
from app.services.alpaca_service import AlpacaService

router = APIRouter()

@router.get("/positions")
async def get_positions(db: Session = Depends(get_db)):
    """Get current stock positions"""
    try:
        cache_key = "stocks:positions"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        alpaca_service = AlpacaService()
        positions = await alpaca_service.get_positions()
        
        # Cache for 2 minutes
        redis_client.setex(cache_key, 120, json.dumps(positions))
        
        return positions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching positions: {str(e)}")

@router.get("/account")
async def get_trading_account(db: Session = Depends(get_db)):
    """Get trading account information"""
    try:
        cache_key = "stocks:account"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        alpaca_service = AlpacaService()
        account_info = await alpaca_service.get_account_info()
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(account_info))
        
        return account_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching account info: {str(e)}")

@router.get("/market-data/{symbol}")
async def get_market_data(symbol: str, db: Session = Depends(get_db)):
    """Get market data for a specific symbol"""
    try:
        cache_key = f"stocks:market:{symbol}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        alpaca_service = AlpacaService()
        market_data = await alpaca_service.get_market_data([symbol])
        
        # Cache for 1 minute
        redis_client.setex(cache_key, 60, json.dumps(market_data))
        
        return market_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market data: {str(e)}")

@router.get("/historical/{symbol}")
async def get_historical_data(symbol: str, days: int = 30, db: Session = Depends(get_db)):
    """Get historical data for a symbol"""
    try:
        cache_key = f"stocks:historical:{symbol}:{days}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        alpaca_service = AlpacaService()
        historical_data = await alpaca_service.get_historical_data(symbol, days)
        
        # Convert DataFrame to dict for JSON serialization
        data_dict = historical_data.to_dict('records')
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(data_dict, default=str))
        
        return data_dict
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")

@router.post("/orders")
async def place_order(order_data: Dict[str, Any], db: Session = Depends(get_db)):
    """Place a trading order"""
    try:
        alpaca_service = AlpacaService()
        
        order = await alpaca_service.place_order(
            symbol=order_data["symbol"],
            qty=order_data["qty"],
            side=order_data["side"],
            order_type=order_data.get("type", "market")
        )
        
        # Clear relevant caches
        redis_client.delete("stocks:positions")
        redis_client.delete("stocks:account")
        
        return order
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error placing order: {str(e)}")

@router.get("/orders")
async def get_orders(status: str = None, db: Session = Depends(get_db)):
    """Get trading orders"""
    try:
        cache_key = f"stocks:orders:{status or 'all'}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        alpaca_service = AlpacaService()
        orders = await alpaca_service.get_orders(status)
        
        # Cache for 1 minute
        redis_client.setex(cache_key, 60, json.dumps(orders, default=str))
        
        return orders
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")
