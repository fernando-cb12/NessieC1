import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import uvicorn


# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AllInOne Financial API",
    description="API for financial data aggregation and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def root():
    return {"message": "AllInOne Financial API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
