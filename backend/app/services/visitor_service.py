from sqlalchemy.orm import Session
from app.repositories.flat_repository import (
    get_flat_by_id,
    get_flat_owned_by_resident,
    )
from app.models.visitor import VisitorRequest
from app.repositories.visitor_repository import (
    get_visitor_by_id,
    get_visitors_by_flat_id,
    create_visitor,
    update_visitor,
)


def create_visitor_request(
    db: Session,
    flat_id: int,
    visitor_name: str,
    visitor_mobile: str,
    purpose: str,
):
    flat = get_flat_by_id(db, flat_id)

    if flat is None:
        return None, "FLAT_NOT_FOUND"

    visitor = VisitorRequest(
        flat_id=flat_id,
        visitor_name=visitor_name,
        visitor_mobile=visitor_mobile,
        purpose=purpose,
        status="PENDING",
    )

    visitor = create_visitor(db, visitor)

    return visitor, None


def get_flat_visitors(
    db: Session,
    flat_id: int,
    resident_id: int,
):
    flat = get_flat_owned_by_resident(
        db=db,
        flat_id=flat_id,
        resident_id=resident_id,
    )

    if flat is None:
        return None, "ACCESS_DENIED"

    visitors = get_visitors_by_flat_id(
        db=db,
        flat_id=flat_id,
    )

    return visitors, None


def approve_visitor(
    db: Session,
    visitor_id: int,
    resident_id: int,
):
    visitor = get_visitor_by_id(
        db,
        visitor_id,
    )

    if visitor is None:
        return None, "VISITOR_NOT_FOUND"

    flat = get_flat_owned_by_resident(
        db,
        visitor.flat_id,
        resident_id,
    )

    if flat is None:
        return None, "ACCESS_DENIED"

    if visitor.status != "PENDING":
        return None, "VISITOR_ALREADY_PROCESSED"

    visitor.status = "APPROVED"

    visitor = update_visitor(
        db,
        visitor,
    )

    return visitor, None


def decline_visitor(
    db: Session,
    visitor_id: int,
    resident_id: int,
):
    visitor = get_visitor_by_id(
        db,
        visitor_id,
    )

    if visitor is None:
        return None, "VISITOR_NOT_FOUND"

    flat = get_flat_owned_by_resident(
        db,
        visitor.flat_id,
        resident_id,
    )

    if flat is None:
        return None, "ACCESS_DENIED"

    if visitor.status != "PENDING":
        return None, "VISITOR_ALREADY_PROCESSED"

    visitor.status = "DECLINED"

    visitor = update_visitor(
        db,
        visitor,
    )

    return visitor, None