import os
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.services.gemini import generate_text
import uvicorn


# Load environment variables
load_dotenv()

# Get CORS origins from environment
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

# Initialize FastAPI app
app = FastAPI(
    title="AllInOne Financial API",
    description="API for financial data aggregation and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.post("/api/chat")
async def chat(payload: dict = Body(...)):
    """Accept a JSON payload like {"message": "..."} and return the assistant reply."""
    message = payload.get("message")
    if not message:
        raise HTTPException(status_code=400, detail="Missing 'message' in request body")

    try:
        reply = await generate_text(message)
        return JSONResponse({"reply": reply})
    except Exception as e:
        # return error details safely
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=10000,
        reload=True
    )
