from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_mobile(
    db: Session,
    mobile: str,
) -> User | None:
    return (
        db.query(User)
        .filter(User.mobile == mobile)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def create_user(
    db: Session,
    user: User,
) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)

    return user