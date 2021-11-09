import pydantic as pd
from typing import Optional, List
from pydantic import BaseModel




class TransactionBase(pd.BaseModel):
    ticker: str
    amount: float
    value: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    portfolio_id: int
    
    class Config:
        orm_mode = True


class PortfolioBase(pd.BaseModel):
    portfolio_type: str
    user_id: int

class PortfolioCreate(PortfolioBase):
    pass


class Portfolio(PortfolioBase):
    id: Optional[int]
    transactions: List[Transaction] = []


    class Config:
        orm_mode = True

class PortfolioUpdate(BaseModel):
    portfolio_type: Optional[str] = None
    user_id: Optional[int] = None

class UserBase(pd.BaseModel):
    username: str
    firstName: str
    lastName: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: Optional[int]
    portfolios: List[Portfolio] = []

    class Config:
        orm_mode=True


class UserUpdate(BaseModel):
    username: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None

