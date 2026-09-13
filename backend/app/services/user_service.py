from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import (
    get_user_by_mobile,
    create_user,
)


def register_user(
    db: Session,
    name: str,
    mobile: str,
    password: str,
    role: str = "RESIDENT",
):
    # Check whether mobile already exists
    existing_user = get_user_by_mobile(
        db,
        mobile,
    )

    if existing_user:
        return None

    # Create user
    user = User(
        name=name,
        mobile=mobile,
        password_hash=hash_password(password),
        role=role,
        is_active=True,
    )

    return create_user(db, user)