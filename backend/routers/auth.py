from fastapi import APIRouter, HTTPException
from models.user import UserLogin
from database import execute_query
import hashlib

router = APIRouter(prefix="/auth", tags=["Auth"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/login")
def login(credentials: UserLogin):
    user = execute_query(
        'SELECT * FROM "USER" WHERE email = %s',
        params=(credentials.email,),
        fetch="one",
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user["password_hash"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "message": "Login successful",
        "user_id": user["user_id"],
        "name": user["name"],
        "role": user["role"],
        "email": user["email"],
    }
