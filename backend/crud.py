import sqlalchemy as sa

from . import models, schemas
from fastapi import HTTPException, status
from .database import get_db

def get_transactions_from_portfolio(db: sa.orm.Session, portfolio_id:int):
    transactions = db.query(models.Transaction).filter_by(portfolio_id=portfolio_id).all()
    return transactions

def create_transaction(db: sa.orm.Session, transaction: schemas.TransactionCreate, portfolio_id:int):
    transaction = models.Transaction.create(db,**transaction.dict(), portfolio_id=portfolio_id)
    return transaction
    
def remove_transaction(db: sa.orm.Session, transaction_id: int):
    transaction = db.query(models.Transaction).filter_by(id=transaction_id).first()
    db.delete(transaction)
    db.commit()
    return transaction


def add(schema, model, db):
    return model.create(db, **schema.dict())


def get(id, model, db):
    data = db.query(model).filter(model.id == id).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id} not found.")
    return data


def edit(id, request, model, db):
    data = db.query(model).filter(model.id == id).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail=f'{id} not found.')
    new_data = request.dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(data, key, value)
    db.commit()
    db.refresh(data)
    return data.__dict__ # FIX THIS LATER! 


def delete(id, model, db):
    data = db.query(model).filter(model.id == id).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id} not found.")
    db.delete(data)
    db.commit()
    return 'Deleted.'
