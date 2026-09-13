from sqlalchemy.orm import Session

from app.core.security import (
    verify_password,
    create_access_token,
)
from app.repositories.user_repository import get_user_by_mobile


def login_user(
    db: Session,
    mobile: str,
    password: str,
):
    user = get_user_by_mobile(db, mobile)

    if user is None:
        return None

    if not user.is_active:
        return None

    if not user.password_hash:
        return None

    if not verify_password(password, user.password_hash):
        return None

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }