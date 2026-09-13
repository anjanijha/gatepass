from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


from app.db.session import get_db
from app.schemas.visitor import (
    VisitorCreate,
    VisitorResponse,
)
from app.models.user import User
from app.core.dependencies import get_current_user

from app.services.visitor_service import (
    create_visitor_request,
    get_flat_visitors,
    get_security_visitors,
    approve_visitor,
    decline_visitor,
    check_in_visitor,
    check_out_visitor,
)


router = APIRouter(
    prefix="/visitors",
    tags=["Visitors"],
)


@router.post(
    "",
    response_model=VisitorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_visitor(
    request: VisitorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "SECURITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only security personnel can create visitor requests",
        )

    visitor, error = create_visitor_request(
        db=db,
        flat_id=request.flat_id,
        visitor_name=request.visitor_name,
        visitor_mobile=request.visitor_mobile,
        purpose=request.purpose,
    )

    if error == "FLAT_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flat not found",
        )

    return visitor

@router.get(
    "/flat/{flat_id}",
    response_model=list[VisitorResponse],
)
def get_visitors(
    flat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "RESIDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only residents can view visitor requests",
        )

    visitors, error = get_flat_visitors(
        db=db,
        flat_id=flat_id,
        resident_id=current_user.id,
    )

    if error == "ACCESS_DENIED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view visitors for this flat",
        )

    return visitors

@router.get(
    "/security",
    response_model=list[VisitorResponse],
)
def get_security_visitor_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "SECURITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only security personnel can view visitor requests",
        )

    return get_security_visitors(db)

@router.put(
    "/{visitor_id}/approve",
    response_model=VisitorResponse,
)
def approve(
    visitor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "RESIDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only residents can approve visitors",
        )

    visitor, error = approve_visitor(
        db=db,
        visitor_id=visitor_id,
        resident_id=current_user.id,
    )

    if error == "VISITOR_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found",
        )

    if error == "ACCESS_DENIED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to approve this visitor",
        )

    if error == "VISITOR_ALREADY_PROCESSED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Visitor request has already been processed",
        )

    return visitor

@router.put(
    "/{visitor_id}/decline",
    response_model=VisitorResponse,
)
def decline(
    visitor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "RESIDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only residents can decline visitors",
        )

    visitor, error = decline_visitor(
        db=db,
        visitor_id=visitor_id,
        resident_id=current_user.id,
    )

    if error == "VISITOR_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found",
        )

    if error == "ACCESS_DENIED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to decline this visitor",
        )

    if error == "VISITOR_ALREADY_PROCESSED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Visitor request has already been processed",
        )

    return visitor

@router.put(
    "/{visitor_id}/check-in",
    response_model=VisitorResponse,
)
def check_in(
    visitor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "SECURITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only security personnel can check in visitors",
        )

    visitor, error = check_in_visitor(
        db=db,
        visitor_id=visitor_id,
    )

    if error == "VISITOR_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found",
        )

    if error == "VISITOR_NOT_APPROVED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Visitor must be approved before check-in",
        )

    if error == "VISITOR_ALREADY_CHECKED_IN":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Visitor is already checked in",
        )

    return visitor

@router.put(
    "/{visitor_id}/check-out",
    response_model=VisitorResponse,
)
def check_out(
    visitor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "SECURITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only security personnel can check out visitors",
        )

    visitor, error = check_out_visitor(
        db=db,
        visitor_id=visitor_id,
    )

    if error == "VISITOR_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found",
        )

    if error == "VISITOR_NOT_CHECKED_IN":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Visitor must be checked in before check-out",
        )

    if error == "VISITOR_ALREADY_CHECKED_OUT":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Visitor is already checked out",
        )

    return visitor