from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    mobile: str
    password: str
    role: str