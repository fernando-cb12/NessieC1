from alpaca.trading.client import TradingClient
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime, timedelta
from typing import List, Dict, Any
import pandas as pd

from app.core.config import settings

class AlpacaService:
    def __init__(self):
        self.trading_client = TradingClient(
            api_key=settings.ALPACA_API_KEY,
            secret_key=settings.ALPACA_SECRET_KEY,
            paper=True  # Use paper trading for development
        )
        self.data_client = StockHistoricalDataClient(
            api_key=settings.ALPACA_API_KEY,
            secret_key=settings.ALPACA_SECRET_KEY
        )
    
    async def get_account_info(self) -> Dict[str, Any]:
        """Get Alpaca account information"""
        try:
            account = self.trading_client.get_account()
            return {
                "account_id": account.id,
                "buying_power": float(account.buying_power),
                "cash": float(account.cash),
                "portfolio_value": float(account.portfolio_value),
                "equity": float(account.equity),
                "day_trade_count": account.day_trade_count,
                "pattern_day_trader": account.pattern_day_trader
            }
        except Exception as e:
            raise Exception(f"Alpaca API error: {str(e)}")
    
    async def get_positions(self) -> List[Dict[str, Any]]:
        """Get current positions"""
        try:
            positions = self.trading_client.get_all_positions()
            return [
                {
                    "symbol": pos.symbol,
                    "qty": float(pos.qty),
                    "side": pos.side,
                    "market_value": float(pos.market_value),
                    "cost_basis": float(pos.cost_basis),
                    "unrealized_pl": float(pos.unrealized_pl),
                    "unrealized_plpc": float(pos.unrealized_plpc),
                    "current_price": float(pos.current_price)
                }
                for pos in positions
            ]
        except Exception as e:
            raise Exception(f"Alpaca API error: {str(e)}")
    
    async def get_historical_data(self, symbol: str, days: int = 30) -> pd.DataFrame:
        """Get historical stock data"""
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            request_params = StockBarsRequest(
                symbol_or_symbols=symbol,
                timeframe=TimeFrame.Day,
                start=start_date,
                end=end_date
            )
            
            bars = self.data_client.get_stock_bars(request_params)
            
            # Convert to DataFrame
            data = []
            for bar in bars.data[symbol]:
                data.append({
                    'timestamp': bar.timestamp,
                    'open': float(bar.open),
                    'high': float(bar.high),
                    'low': float(bar.low),
                    'close': float(bar.close),
                    'volume': int(bar.volume)
                })
            
            return pd.DataFrame(data)
            
        except Exception as e:
            raise Exception(f"Alpaca API error: {str(e)}")
    
    async def get_market_data(self, symbols: List[str]) -> Dict[str, Any]:
        """Get current market data for symbols"""
        try:
            # This would typically use real-time data
            # For now, we'll use historical data as a proxy
            market_data = {}
            
            for symbol in symbols:
                df = await self.get_historical_data(symbol, 1)
                if not df.empty:
                    latest = df.iloc[-1]
                    market_data[symbol] = {
                        "price": latest['close'],
                        "change": latest['close'] - latest['open'],
                        "change_percent": ((latest['close'] - latest['open']) / latest['open']) * 100,
                        "volume": latest['volume'],
                        "high": latest['high'],
                        "low": latest['low']
                    }
            
            return market_data
            
        except Exception as e:
            raise Exception(f"Alpaca API error: {str(e)}")
    
    async def place_order(self, symbol: str, qty: int, side: str, 
                         order_type: str = "market") -> Dict[str, Any]:
        """Place a trading order"""
        try:
            order = self.trading_client.submit_order(
                symbol=symbol,
                qty=qty,
                side=side,
                type=order_type
            )
            
            return {
                "order_id": order.id,
                "symbol": order.symbol,
                "qty": order.qty,
                "side": order.side,
                "type": order.type,
                "status": order.status,
                "submitted_at": order.submitted_at.isoformat() if order.submitted_at else None
            }
            
        except Exception as e:
            raise Exception(f"Alpaca API error: {str(e)}")
    
    async def get_orders(self, status: str = None) -> List[Dict[str, Any]]:
        """Get trading orders"""
        try:
            orders = self.trading_client.get_orders(status=status)
            return [
                {
                    "order_id": order.id,
                    "symbol": order.symbol,
                    "qty": order.qty,
                    "side": order.side,
                    "type": order.type,
                    "status": order.status,
                    "submitted_at": order.submitted_at.isoformat() if order.submitted_at else None,
                    "filled_at": order.filled_at.isoformat() if order.filled_at else None
                }
                for order in orders
            ]
        except Exception as e:
            raise Exception(f"Alpaca API error: {str(e)}")
