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
class VisitorRequest(Base):
    __tablename__ = "visitor_requests"

    id = Column(Integer, primary_key=True, index=True)

    visitor_name = Column(
        String(100),
        nullable=False
    )

    visitor_mobile = Column(
        String(10),
        nullable=False
    )

    purpose = Column(
        String(200),
        nullable=False
    )

    flat_id = Column(
        Integer,
        ForeignKey("flats.id"),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="PENDING"
    )

    flat = relationship(
        "Flat",
        back_populates="visitor_requests"
    )