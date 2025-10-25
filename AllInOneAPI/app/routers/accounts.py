from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import httpx
import json
from datetime import datetime, timedelta

from app.core.database import get_db, Account, redis_client
from app.core.config import settings
from app.schemas.account import AccountResponse, AccountCreate
from app.services.nessie_service import NessieService

router = APIRouter()

@router.get("/", response_model=List[AccountResponse])
async def get_accounts(db: Session = Depends(get_db)):
    """Get all accounts for the user"""
    try:
        # Check cache first
        cache_key = "accounts:all"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        # Fetch from Nessie API
        nessie_service = NessieService()
        accounts_data = await nessie_service.get_accounts()
        
        # Store in database
        for account_data in accounts_data:
            existing_account = db.query(Account).filter(
                Account.account_id == account_data["_id"]
            ).first()
            
            if not existing_account:
                new_account = Account(
                    account_id=account_data["_id"],
                    type=account_data["type"],
                    nickname=account_data["nickname"],
                    rewards=account_data["rewards"],
                    balance=account_data["balance"],
                    account_number=account_data["account_number"],
                    customer_id=account_data["customer_id"]
                )
                db.add(new_account)
            else:
                # Update existing account
                existing_account.balance = account_data["balance"]
                existing_account.rewards = account_data["rewards"]
                existing_account.updated_at = datetime.utcnow()
        
        db.commit()
        
        # Cache the results for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(accounts_data))
        
        return accounts_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching accounts: {str(e)}")

@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(account_id: str, db: Session = Depends(get_db)):
    """Get a specific account by ID"""
    try:
        # Check cache first
        cache_key = f"account:{account_id}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        # Fetch from Nessie API
        nessie_service = NessieService()
        account_data = await nessie_service.get_account(account_id)
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(account_data))
        
        return account_data
        
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Account not found: {str(e)}")

@router.post("/", response_model=AccountResponse)
async def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    """Create a new account"""
    try:
        nessie_service = NessieService()
        new_account = await nessie_service.create_account(account.dict())
        
        # Store in database
        db_account = Account(
            account_id=new_account["_id"],
            type=new_account["type"],
            nickname=new_account["nickname"],
            rewards=new_account["rewards"],
            balance=new_account["balance"],
            account_number=new_account["account_number"],
            customer_id=new_account["customer_id"]
        )
        db.add(db_account)
        db.commit()
        
        # Clear cache
        redis_client.delete("accounts:all")
        
        return new_account
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating account: {str(e)}")

@router.get("/{account_id}/transactions")
async def get_account_transactions(account_id: str, db: Session = Depends(get_db)):
    """Get transactions for a specific account"""
    try:
        cache_key = f"transactions:{account_id}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        nessie_service = NessieService()
        transactions = await nessie_service.get_account_transactions(account_id)
        
        # Cache for 2 minutes
        redis_client.setex(cache_key, 120, json.dumps(transactions))
        
        return transactions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transactions: {str(e)}")
