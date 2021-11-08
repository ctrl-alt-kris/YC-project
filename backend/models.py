import sqlalchemy as sa
from sqlalchemy.orm import Session, relationship
from sqlalchemy.sql import schema
from sqlalchemy.sql.schema import ForeignKey
from pydantic import BaseModel
from typing import Optional
from . import schemas
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Base(declarative_base()):
    # never instatiate this class directly, needed for id column
    __abstract__ = True

    # all models should have an id
    id = sa.Column(sa.Integer, primary_key=True, index=True)

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower() + "s"

    @classmethod
    def create(cls, session: Session, **kwargs):
        obj = cls(**kwargs) # make obj out of arguments
        session.add(obj)
        session.commit()
        session.refresh(obj)

        return obj # need to return the obj


class User(Base):
    username = sa.Column(sa.String, unique=True, index=True)
    firstName = sa.Column(sa.String, index=True)
    lastName = sa.Column(sa.String, index=True)
    email = sa.Column(sa.String, index=True)
    password = sa.Column(sa.String, index=True)

    portfolios = relationship("Portfolio", back_populates="users")


    @classmethod
    def create(cls, session: Session, **kwargs):
        kwargs["password"] = pwd_context.hash(kwargs["password"])
        return super(User, cls).create(session, **kwargs)


    @classmethod
    def verify_password(cls, password):
        return pwd_context.verify(password, cls.password)



class Portfolio(Base):
    portfolio_type = sa.Column(sa.String, nullable=False)
    user_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"), nullable=False)
    
    users = relationship("User", back_populates="portfolios")
    transactions = relationship("Transaction", back_populates="portfolio")

    def get_value(self):
        return sum(t.amount for t in self.transactions)


class Transaction(Base):
    ticker = sa.Column(sa.String, nullable=False)
    amount = sa.Column(sa.Integer, nullable=False)
    value = sa.Column(sa.Float, nullable=False)

    portfolio_id = sa.Column(sa.Integer, ForeignKey("portfolios.id"))

    portfolio = relationship("Portfolio", back_populates="transactions")
