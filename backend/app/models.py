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
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    mobile = Column(
        String(10),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=True
    )

    role = Column(
        String(20),
        nullable=False
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    flat = relationship(
        "Flat",
        back_populates="resident"
    )


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