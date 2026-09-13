from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse,
)
from app.services.user_service import register_user


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    request: UserCreate,
    db: Session = Depends(get_db),
):
    user = register_user(
        db=db,
        name=request.name,
        mobile=request.mobile,
        password=request.password,
        role="RESIDENT",
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this mobile number already exists",
        )

    return user