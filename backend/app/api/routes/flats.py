from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.flat import (
    FlatCreate,
    FlatResponse,
)
from app.services.flat_service import register_flat,get_my_flats
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.flat import Flat


router = APIRouter(
    prefix="/flats",
    tags=["Flats"],
)


@router.post(
    "",
    response_model=FlatResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_flat(
    request: FlatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "RESIDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only residents can create a flat",
        )

    flat, error = register_flat(
        db=db,
        flat_number=request.flat_number,
        resident_id=current_user.id,
    )

    if error == "FLAT_ALREADY_EXISTS":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Flat already exists",
        )

    return flat

@router.get(
    "/my",
    response_model=list[FlatResponse],
)
def get_my_flats_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "RESIDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only residents can view their flats",
        )

    return get_my_flats(
        db=db,
        resident_id=current_user.id,
    )

@router.get(
    "/for-visitor",
    response_model=list[FlatResponse],
)
def get_flats_for_visitor(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "SECURITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only security can view flats for visitor requests",
        )

    return (
        db.query(Flat)
        .order_by(Flat.flat_number)
        .all()
    )