from pydantic import BaseModel, Field
from datetime import datetime

class VisitorCreate(BaseModel):
    flat_id: int

    visitor_name: str = Field(
        min_length=2,
        max_length=100,
    )

    visitor_mobile: str = Field(
        pattern=r"^\d{10}$",
    )

    purpose: str = Field(
        min_length=2,
        max_length=255,
    )


class VisitorResponse(BaseModel):
    id: int
    flat_id: int
    flat_number: str
    visitor_name: str
    visitor_mobile: str
    purpose: str
    status: str

    approved_at: datetime | None = None
    checked_in_at: datetime | None = None
    checked_out_at: datetime | None = None

    class Config:
        from_attributes = True