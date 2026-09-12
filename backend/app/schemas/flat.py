from pydantic import BaseModel

class FlatCreate(BaseModel):
    flat_number: str
    resident_id: int