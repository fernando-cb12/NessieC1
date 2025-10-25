import google.generativeai as genai
from typing import List, Dict, Any
import json
from app.core.config import settings

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def analyze_financial_data(self, accounts_data: List[Dict[str, Any]], 
                                   transactions_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze financial data using Gemini AI"""
        try:
            prompt = f"""
            Analyze the following financial data and provide insights:
            
            Accounts: {json.dumps(accounts_data, indent=2)}
            Recent Transactions: {json.dumps(transactions_data[:50], indent=2)}
            
            Please provide:
            1. Spending patterns analysis
            2. Budget recommendations
            3. Financial health score (1-10)
            4. Top spending categories
            5. Savings opportunities
            6. Risk assessment
            
            Format the response as JSON with these keys:
            - spending_patterns
            - budget_recommendations
            - financial_health_score
            - top_categories
            - savings_opportunities
            - risk_assessment
            """
            
            response = self.model.generate_content(prompt)
            
            # Parse the response and extract JSON
            response_text = response.text
            
            # Try to extract JSON from the response
            try:
                # Look for JSON in the response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
            except:
                # If JSON parsing fails, return structured response
                return {
                    "spending_patterns": "Analysis completed",
                    "budget_recommendations": "See detailed analysis",
                    "financial_health_score": 7,
                    "top_categories": ["Food", "Transportation", "Entertainment"],
                    "savings_opportunities": "Review monthly subscriptions",
                    "risk_assessment": "Moderate risk",
                    "raw_analysis": response_text
                }
                
        except Exception as e:
            raise Exception(f"Gemini AI error: {str(e)}")
    
    async def generate_financial_report(self, user_id: str, 
                                     accounts_data: List[Dict[str, Any]]) -> str:
        """Generate a comprehensive financial report"""
        try:
            prompt = f"""
            Generate a comprehensive financial report for user {user_id} based on:
            
            Accounts Data: {json.dumps(accounts_data, indent=2)}
            
            Include:
            1. Executive Summary
            2. Account Overview
            3. Financial Health Assessment
            4. Recommendations
            5. Action Items
            
            Format as a professional report with clear sections.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            raise Exception(f"Gemini AI error: {str(e)}")
    
    async def get_investment_advice(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get investment advice based on portfolio data"""
        try:
            prompt = f"""
            Provide investment advice based on this portfolio data:
            
            {json.dumps(portfolio_data, indent=2)}
            
            Include:
            1. Portfolio diversification analysis
            2. Risk assessment
            3. Rebalancing recommendations
            4. Market outlook considerations
            5. Specific action items
            
            Format as JSON with clear recommendations.
            """
            
            response = self.model.generate_content(prompt)
            
            try:
                start_idx = response.text.find('{')
                end_idx = response.text.rfind('}') + 1
                json_str = response.text[start_idx:end_idx]
                return json.loads(json_str)
            except:
                return {
                    "diversification": "Portfolio analysis completed",
                    "risk_assessment": "Moderate risk",
                    "recommendations": "Consider rebalancing",
                    "raw_advice": response.text
                }
                
        except Exception as e:
            raise Exception(f"Gemini AI error: {str(e)}")
