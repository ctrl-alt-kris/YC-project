import pydantic as pd
# from typing import Optional

class UserBase(pd.BaseModel):
    username: str
    firstName: str
    lastName: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int