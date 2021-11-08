from fastapi import FastAPI, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
import finnhub
from .database import get_db, engine
from . import schemas, models, crud

models.Base.metadata.create_all(engine)
from dotenv import load_dotenv
load_dotenv('.env')
import os

app = FastAPI()
API_KEY = os.getenv('API_KEY')
finnhub_client = finnhub.Client(api_key=API_KEY)

# finnhub_api = "c64eft2ad3i8bn4fjpn0"

# # Setup client
# finnhub_client = finnhub.Client(api_key=finnhub_api)

# # Quote
# quote = finnhub_client.quote('AAPL')
# current_price = quote["c"]
# closing_price = quote["pc"]

# print("Current Price:", current_price)
# print("Closing price: ", closing_price)


@app.get("/")
async def root():
    return {"message": "Hello World"}


### USERS ####
@app.post("/post_user", tags=['user'])
async def add_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return models.User.create(db, **user.dict())


@app.get("/get_user", tags=['user'], response_model=schemas.User)
async def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found.")
    return user


@app.put('/edit_user', tags=['user'])
async def edit_user(request: schemas.User, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == request.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail=f'User with id {request.id} not found.')
    user.update(request.dict(), synchronize_session=False)
    db.commit()
    return 'User updated.'


@app.delete('/delete_user', tags=['user'])
async def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found.")
    db.delete(user)
    db.commit()
    return 'User deleted.'

@app.get('/portfolio/{portfolio_id}/transactions',response_model=List[schemas.Transaction])
async def get_transactions_by_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    transactions = crud.get_transactions_from_portfolio(db=db, portfolio_id=portfolio_id)
    return transactions

@app.post('/portfolio/{portfolio_id}/add-transaction', response_model=schemas.Transaction)
async def add_transaction(portfolio_id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    transaction = crud.create_transaction(db=db, transaction=transaction, portfolio_id=portfolio_id)
    return transaction

@app.delete('/transaction/{transaction_id}')
async def remove_transaction(transaction_id: int,  db: Session = Depends(get_db)):
    transaction = crud.remove_transaction(db=db, transaction_id=transaction_id)
    return transaction
