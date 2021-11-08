import pydantic as pd
from typing import Optional
from pydantic import BaseModel


class UserBase(pd.BaseModel):
    username: str
    firstName: str
    lastName: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: Optional[int]


class UserUpdate(BaseModel):
    username: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None


class PortfolioBase(pd.BaseModel):
    portfolio_type: str
    user_id: int


class PortfolioCreate(PortfolioBase):
    pass


class Portfolio(PortfolioBase):
    id: Optional[int]


class PortfolioUpdate(BaseModel):
    portfolio_type: Optional[str] = None
    user_id: Optional[int] = None