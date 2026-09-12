from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas import LoginRequest
from app.core.security import (
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.mobile == login_data.mobile
        )
        .first()
    )

    if not user:
        return {
            "message": "Invalid mobile or password"
        }

    if not user.password_hash:
        return {
            "message": "Password is not configured"
        }

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        return {
            "message": "Invalid mobile or password"
        }

    access_token = create_access_token(
        user_id=user.id
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }