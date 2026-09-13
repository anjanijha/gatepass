from sqlalchemy.orm import Session

from app.models.flat import Flat
from app.repositories.flat_repository import (
    get_flat_by_number,
    get_flat_by_resident_id,
    create_flat,
    get_flats_by_resident_id,
)


def register_flat(
    db: Session,
    flat_number: str,
    resident_id: int,
):
    # Check duplicate flat number
    existing_flat = get_flat_by_number(
        db,
        flat_number,
    )

    if existing_flat:
        return None, "FLAT_ALREADY_EXISTS"

    # Check whether resident already owns a flat
    existing_resident_flat = get_flat_by_resident_id(
        db,
        resident_id,
    )

    if existing_resident_flat:
        return None, "RESIDENT_ALREADY_HAS_FLAT"

    flat = Flat(
        flat_number=flat_number,
        resident_id=resident_id,
    )

    flat = create_flat(db, flat)

    return flat, None

def get_my_flats(
    db: Session,
    resident_id: int,
):
    return get_flats_by_resident_id(
        db=db,
        resident_id=resident_id,
    )