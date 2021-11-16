import sqlalchemy as sa
from sqlalchemy.orm import Session, relationship
from sqlalchemy.sql import schema
from sqlalchemy.sql.schema import ForeignKey
from pydantic import BaseModel
from typing import Optional
from . import schemas
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

SECRET = "c6a912d7cb7244f16e2cd99a0cdc95b4618a5604046b32816a88e7d40430f16a"

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
    email = sa.Column(sa.String, unique=True, index=True)
    username = sa.Column(sa.String)
    firstName = sa.Column(sa.String)
    lastName = sa.Column(sa.String)
    hashed_password = sa.Column(sa.String, nullable=False)
    token = sa.Column(sa.String)

    portfolios = sa.orm.relationship("Portfolio", back_populates="users")

    @staticmethod
    def hash_password(password: str) -> str:
        return password + " not really hashed"

    @classmethod
    def login(cls, session: sa.orm.Session, username: str, password: str) -> schemas.Token:
        user: User = (
            session.query(cls)
            .filter_by(username=username)
            .filter_by(hashed_password=cls.hash_password(password))
            .one()
        )  # raise exception if none are found

        user.token = jwt.encode(
            dict(exp=datetime.utcnow() + timedelta(minutes=60)),
            SECRET,
            algorithm="HS256",
        )
        session.commit()

        return schemas.Token(access_token=user.token, token_type="bearer")

    @classmethod
    def find_by_token(cls, session: sa.orm.Session, token: str) -> "User":
        user = (
            session.query(cls).filter_by(token=token).one()
        )  # raises exception if none are found
        payload = jwt.decode(
            token, SECRET, algorithms=["HS256"]
        )  # raises exception when decode fails
        if datetime.fromtimestamp(payload["exp"]) < datetime.now():
            raise Exception("expired")
        return user

    @classmethod
    def create(cls, session: sa.orm.Session, **kwargs):
        kwargs["hashed_password"] = cls.hash_password(kwargs.pop("password"))
        new_user = super(User, cls).create(session, **kwargs)
        return new_user


class Portfolio(Base):
    portfolio_type = sa.Column(sa.String, nullable=False)
    user_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"), nullable=False)
    
    users = relationship("User", back_populates="portfolios")
    transactions = relationship("Transaction", back_populates="portfolio")

    def get_value(self):
        return sum(t.amount for t in self.transactions)


class Transaction(Base):
    ticker = sa.Column(sa.String, nullable=False)
    amount = sa.Column(sa.Float, nullable=False)
    value = sa.Column(sa.Float, nullable=False)

    portfolio_id = sa.Column(sa.Integer, ForeignKey("portfolios.id"))

    portfolio = relationship("Portfolio", back_populates="transactions")