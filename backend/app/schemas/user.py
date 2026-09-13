from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    mobile: str = Field(pattern=r"^\d{10}$")
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: int
    name: str
    mobile: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True