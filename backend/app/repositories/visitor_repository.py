from sqlalchemy.orm import Session

from app.models.visitor import VisitorRequest


def get_visitor_by_id(
    db: Session,
    visitor_id: int,
) -> VisitorRequest | None:
    return (
        db.query(VisitorRequest)
        .filter(VisitorRequest.id == visitor_id)
        .first()
    )


def get_visitors_by_flat_id(
    db: Session,
    flat_id: int,
):
    return (
        db.query(VisitorRequest)
        .filter(VisitorRequest.flat_id == flat_id)
        .order_by(VisitorRequest.id.desc())
        .all()
    )


def create_visitor(
    db: Session,
    visitor: VisitorRequest,
) -> VisitorRequest:
    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    return visitor


def update_visitor(
    db: Session,
    visitor: VisitorRequest,
) -> VisitorRequest:
    db.commit()
    db.refresh(visitor)

    return visitor

def get_all_visitors(
    db: Session,
):
    return (
        db.query(VisitorRequest)
        .order_by(VisitorRequest.id.desc())
        .all()
    )