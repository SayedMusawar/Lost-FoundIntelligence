# main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, items, claims, receipts, notifications

app = FastAPI(title="FAST Lost & Found API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://lost-found-intelligence.vercel.app",
        "https://lost-found-intelligence-1e93b94q7-p240619-9725s-projects.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(claims.router)
app.include_router(receipts.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"message": "Lost & Found API is running"}
