from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from typing import List
from sqlalchemy.orm import Session
import finnhub
from .database import get_db, engine
from . import schemas, models
from . import crud
from fastapi.middleware.cors import CORSMiddleware
import aiofiles
import os 
import pandas as pd
dir_path = os.path.dirname(os.path.realpath(__file__))

models.Base.metadata.create_all(engine)
from dotenv import load_dotenv
load_dotenv('.env')
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


### USERS ####
@app.post("/post_user", tags=['user'])
async def add_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.add(user, models.User, db)


@app.get("/get_user", tags=['user'], response_model=schemas.User)
async def get_user(id: int, db: Session = Depends(get_db)):
    return crud.get(id, models.User, db)


@app.patch('/edit_user', response_model=schemas.User, tags=['user'])
async def edit_user(id: int, request: schemas.UserUpdate, db: Session = Depends(get_db)):
    return crud.edit(id, request, models.User, db)


@app.delete('/delete_user', tags=['user'])
async def delete_user(id: int, db: Session = Depends(get_db)):
    return crud.delete(id, models.User, db).dict()



# @app.post("/post_user", tags=['user'])
# async def add_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     return models.User.create(db, **user.dict())


# @app.get("/get_user", tags=['user'])
# async def get_user(id: int, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.id == id).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found.")
#     return user


# @app.put('/edit_user', tags=['user'])
# async def edit_user(request: schemas.User, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.id == request.id).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail=f'User with id {request.id} not found.')
#     user.update(request.dict(), synchronize_session=False)
#     db.commit()
#     return 'User updated.'


# @app.delete('/delete_user', tags=['user'])
# async def delete_user(id: int, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.id == id).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found.")
#     db.delete(user)
#     db.commit()
#     return 'User deleted.'

@app.post("/post_portfolio", tags=['portfolio'])
async def add_new_portfolio(portfolio: schemas.PortfolioCreate, db: Session = Depends(get_db)):
    return crud.add(schema=portfolio, model=models.Portfolio, db=db)

@app.get("/get_portfolio", tags=['portfolio'])
async def get_portfolio(id: int, db: Session = Depends(get_db)):
    return crud.get(id, models.Portfolio, db)

@app.patch('/edit_portfolio', response_model=schemas.Portfolio, tags=['portfolio'])
async def edit_portfolio(id: int, request: schemas.PortfolioUpdate, db: Session = Depends(get_db)):
    return crud.edit(id, request, models.Portfolio, db)

@app.delete('/delete_portfolio', tags=['portfolio'])
async def delete_portfolio(id: int, db: Session = Depends(get_db)):
    return crud.delete(id, models.Portfolio, db)

@app.get('/portfolio/{portfolio_id}/transactions',tags=['transaction'],response_model=List[schemas.Transaction])
async def get_transactions_by_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    transactions = crud.get_transactions_from_portfolio(db=db, portfolio_id=portfolio_id)
    return transactions

@app.post('/portfolio/{portfolio_id}/add-transaction',tags=['transaction'], response_model=schemas.Transaction)
async def add_transaction(portfolio_id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    transaction = crud.add(db=db, schema=transaction, model=models.Transaction, portfolio_id=portfolio_id)
    return transaction


@app.delete('/transaction/{transaction_id}',tags=['transaction'])
async def remove_transaction(transaction_id: int,  db: Session = Depends(get_db)):
    transaction = crud.delete(db=db, id=transaction_id, model=models.Transaction)
    return transaction

@app.post("/upload-csv/{portfolio_id}")
async def transactions_from_csv(portfolio_id:int,file: UploadFile = File(...),  db: Session = Depends(get_db)):
    async with aiofiles.open(os.path.join(dir_path,"tmp",file.filename), 'wb') as out_file:
        content = await file.read()  # async read
        await out_file.write(content)  # async write
        df = pd.read_csv(file.filename, sep=";")
        formatted_data = df.to_dict('records')
        for transaction in formatted_data:
            amount = transaction['Volume'].replace('.','').replace(',','.')
            value = transaction['Cost Price'].replace('.','').replace(',','.')
            kwargs = {'ticker': transaction['Symbol'], 'amount': amount, 'value': value, 'portfolio_id':portfolio_id}
            crud.add(schema=None, model=models.Transaction, db=db, **kwargs)
    return {"transactions":formatted_data}
