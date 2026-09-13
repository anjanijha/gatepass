from pydantic import BaseModel, Field


class FlatCreate(BaseModel):
    flat_number: str = Field(
        min_length=1,
        max_length=20,
    )


class FlatResponse(BaseModel):
    id: int
    flat_number: str
    resident_id: int

    class Config:
        from_attributes = True