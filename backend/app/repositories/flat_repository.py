from sqlalchemy.orm import Session

from app.models.flat import Flat


def get_flat_by_id(
    db: Session,
    flat_id: int,
) -> Flat | None:
    return (
        db.query(Flat)
        .filter(Flat.id == flat_id)
        .first()
    )


def get_flat_by_number(
    db: Session,
    flat_number: str,
) -> Flat | None:
    return (
        db.query(Flat)
        .filter(Flat.flat_number == flat_number)
        .first()
    )


def get_flat_by_resident_id(
    db: Session,
    resident_id: int,
) -> Flat | None:
    return (
        db.query(Flat)
        .filter(Flat.resident_id == resident_id)
        .first()
    )

def get_flats_by_resident_id(
    db: Session,
    resident_id: int,
):
    return (
        db.query(Flat)
        .filter(Flat.resident_id == resident_id)
        .order_by(Flat.id)
        .all()
    )

def create_flat(
    db: Session,
    flat: Flat,
) -> Flat:
    db.add(flat)
    db.commit()
    db.refresh(flat)

    return flat

def get_flat_owned_by_resident(
    db: Session,
    flat_id: int,
    resident_id: int,
) -> Flat | None:
    return (
        db.query(Flat)
        .filter(
            Flat.id == flat_id,
            Flat.resident_id == resident_id,
        )
        .first()
    )