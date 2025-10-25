from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import redis

from app.core.config import settings

# Database setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup for caching (with fallback to in-memory cache)
try:
    redis_client = redis.from_url(settings.REDIS_URL)
    redis_client.ping()  # Test connection
except:
    # Fallback to in-memory cache if Redis is not available
    from app.core.cache import InMemoryCache
    redis_client = InMemoryCache()

# Database Models
class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(String, unique=True, index=True)
    type = Column(String)
    nickname = Column(String)
    rewards = Column(Integer, default=0)
    balance = Column(Float)
    account_number = Column(String)
    customer_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Group(Base):
    __tablename__ = "groups"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(Text)
    type = Column(String)
    icon = Column(String)
    color = Column(String)
    total_balance = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GroupMember(Base):
    __tablename__ = "group_members"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(String, index=True)
    member_id = Column(String, index=True)
    name = Column(String)
    email = Column(String)
    role = Column(String)  # admin, member
    joined_at = Column(DateTime, default=datetime.utcnow)

class SharedAccount(Base):
    __tablename__ = "shared_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(String, index=True)
    account_id = Column(String, index=True)
    account_type = Column(String)
    nickname = Column(String)
    balance = Column(Float)
    account_number = Column(String)
    permissions = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

class StockData(Base):
    __tablename__ = "stock_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    price = Column(Float)
    change = Column(Float)
    change_percent = Column(Float)
    volume = Column(Integer)
    market_cap = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AnalyticsCache(Base):
    __tablename__ = "analytics_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String, unique=True, index=True)
    data = Column(Text)  # JSON string
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
async def init_db():
    Base.metadata.create_all(bind=engine)
