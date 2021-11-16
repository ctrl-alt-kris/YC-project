import sqlalchemy as sa
from . import models
from fastapi import HTTPException, status

def get_transactions_from_portfolio(db: sa.orm.Session, portfolio_id:int):
    transactions = db.query(models.Transaction).filter_by(portfolio_id=portfolio_id).all()
    return transactions

def get_positions(db: sa.orm.Session, portfolio_type:str, user_id:int):
    portfolio = db.query(models.Portfolio).filter_by(portfolio_type=portfolio_type, user_id=user_id).first()
    if not portfolio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id} not found.")
    transactions = portfolio.transactions
    tickers = {transaction.ticker for transaction in transactions}
    
    positions = []
    for ticker in tickers:
        transactions_by_ticker = db.query(models.Transaction).filter_by(ticker=ticker).all()
        total_amount = 0
        total_value = 0
        for transaction in transactions_by_ticker:
            total_amount += transaction.amount
            total_value += transaction.value * transaction.amount
        positions.append({"Symbol":ticker,"CostPrice": total_value/total_amount, "Volume":total_amount})
    return positions


def add(schema, model, db, **kwargs):
    if schema is not None:
        return model.create(db, **schema.dict(), **kwargs)
    return model.create(db, **kwargs)


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