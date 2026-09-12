from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    DateTime
)
from sqlalchemy.orm import relationship
from app.db.base import Base

class Flat(Base):
    __tablename__ = "flats"

    id = Column(Integer, primary_key=True, index=True)
    flat_number = Column(
        String(20),
        unique=True,
        nullable=False
    )

    resident_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    resident = relationship(
        "User",
        back_populates="flat"
    )

    visitor_requests = relationship(
        "VisitorRequest",
        back_populates="flat"
    )
