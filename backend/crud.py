import sqlalchemy as sa

from . import models, schemas

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