from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Keys
    NESSIE_API_KEY: str
    GEMINI_API_KEY: str
    ALPACA_API_KEY: str
    ALPACA_SECRET_KEY: str
    
    # Database
    DATABASE_URL: str = "sqlite:///./financial_data.db"
    
    # Redis for caching
    REDIS_URL: str = "redis://localhost:6379"
    
    # External API URLs
    NESSIE_BASE_URL: str = "http://api.nessieisreal.com"
    ALPACA_BASE_URL: str = "https://paper-api.alpaca.markets"
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"

settings = Settings()
