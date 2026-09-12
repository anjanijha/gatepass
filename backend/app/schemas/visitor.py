from pydantic import BaseModel

class VisitorCreate(BaseModel):
    visitor_name: str
    visitor_mobile: str
    purpose: str
    flat_id: int