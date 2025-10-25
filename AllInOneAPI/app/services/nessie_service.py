import httpx
from typing import List, Dict, Any
import json
from app.core.config import settings

class NessieService:
    def __init__(self):
        self.base_url = settings.NESSIE_BASE_URL
        self.api_key = settings.NESSIE_API_KEY
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
    
    async def get_accounts(self) -> List[Dict[str, Any]]:
        """Fetch all accounts from Nessie API"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/accounts",
                    headers=self.headers,
                    params={"key": self.api_key}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise Exception(f"Nessie API error: {str(e)}")
    
    async def get_account(self, account_id: str) -> Dict[str, Any]:
        """Fetch a specific account by ID"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/accounts/{account_id}",
                    headers=self.headers,
                    params={"key": self.api_key}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise Exception(f"Nessie API error: {str(e)}")
    
    async def create_account(self, account_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new account"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/accounts",
                    headers=self.headers,
                    params={"key": self.api_key},
                    json=account_data
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise Exception(f"Nessie API error: {str(e)}")
    
    async def get_account_transactions(self, account_id: str) -> List[Dict[str, Any]]:
        """Fetch transactions for a specific account"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/accounts/{account_id}/transactions",
                    headers=self.headers,
                    params={"key": self.api_key}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise Exception(f"Nessie API error: {str(e)}")
    
    async def get_customers(self) -> List[Dict[str, Any]]:
        """Fetch all customers"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/customers",
                    headers=self.headers,
                    params={"key": self.api_key}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise Exception(f"Nessie API error: {str(e)}")
    
    async def get_merchants(self) -> List[Dict[str, Any]]:
        """Fetch all merchants"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/merchants",
                    headers=self.headers,
                    params={"key": self.api_key}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise Exception(f"Nessie API error: {str(e)}")
