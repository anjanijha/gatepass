from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest
from app.services.auth_service import login_user
from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    result = login_user(
        db=db,
        mobile=request.mobile,
        password=request.password,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number or password",
        )

    user = result["user"]

    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user": {
            "id": user.id,
            "name": user.name,
            "mobile": user.mobile,
            "role": user.role,
        },
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "mobile": current_user.mobile,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }