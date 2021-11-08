import pydantic as pd
from typing import List

class UserBase(pd.BaseModel):
    username: str
    firstName: str
    lastName: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class PortfolioBase(pd.BaseModel):
    portfolio_type: str
    user_id: int


class PortfolioCreate(PortfolioBase):
    pass


class Portfolio(PortfolioBase):
    id: int
    transactions: List["Transaction"] = []

    class Config:
        orm_mode = True

class TransactionBase(pd.BaseModel):
    ticker: str
    amount: int
    value: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    portfolio_id: int
    
    class Config:
        orm_mode = True