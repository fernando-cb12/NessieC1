from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccountBase(BaseModel):
    type: str
    nickname: str
    rewards: int = 0
    balance: float
    account_number: str
    customer_id: str

class AccountCreate(AccountBase):
    pass

class AccountResponse(AccountBase):
    _id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    amount: float
    description: str
    transaction_type: str
    merchant_name: Optional[str] = None

class TransactionCreate(TransactionBase):
    account_id: str

class TransactionResponse(TransactionBase):
    _id: str
    account_id: str
    transaction_date: datetime
    
    class Config:
        from_attributes = True
