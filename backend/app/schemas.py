from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    mobile: str
    password: str
    role: str


class LoginRequest(BaseModel):
    mobile: str
    password: str


class FlatCreate(BaseModel):
    flat_number: str
    resident_id: int


class VisitorCreate(BaseModel):
    visitor_name: str
    visitor_mobile: str
    purpose: str
    flat_id: int