import pydantic as pd

class UserBase(pd.BaseModel):
    username: str
    firstName: str
    lastName: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int


class PortfolioBase(pd.BaseModel):
    portfolio_type: str
    user_id: int


class PortfolioCreate(PortfolioBase):
    pass


class Portfolio(PortfolioBase):
    id: int