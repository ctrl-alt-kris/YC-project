from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
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
from io import StringIO
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

async def get_current_user(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl="login")),
    session: Session = Depends(get_db),
):
    try:
        return models.User.find_by_token(session, token)
    except Exception as e:
        # print(" #### %s" % e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def login(session: Session, username: str, password: str):
    try:
        return models.User.login(session, username, password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post(
    "/login",
    summary="Get a token for your credentials",
    tags=["Users"],
    response_model=schemas.Token,
)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db),
):
    return login(session, form_data.username, form_data.password)


@app.post("/login_json", tags=["Users"], response_model=schemas.Token)
async def login_json(
    data: schemas.UserLogin,
    session: Session = Depends(get_db),
):
    return login(session, data.username, data.password)

@app.get("/users/me", tags=["Users"], response_model=schemas.User)
async def read_users_me(
    current_user: schemas.User = Depends(get_current_user),
):
    return current_user

@app.post("/post_user", tags=['user'])
async def add_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user =  crud.add(user, models.User, db)
    portfolio_details = [schemas.PortfolioCreate(portfolio_type='Stocks', user_id=new_user.id),schemas.PortfolioCreate(portfolio_type='Crypto', user_id=new_user.id)]
    for portfolio in portfolio_details:
        crud.add(portfolio, models.Portfolio, db)
    return new_user


@app.get("/get_user", tags=['user'], response_model=schemas.User)
async def get_user(id: int, db: Session = Depends(get_db)):
    return crud.get(id, models.User, db)


@app.patch('/edit_user', response_model=schemas.User, tags=['user'])
async def edit_user(id: int, request: schemas.UserUpdate, db: Session = Depends(get_db)):
    return crud.edit(id, request, models.User, db)


@app.delete('/delete_user', tags=['user'])
async def delete_user(id: int, db: Session = Depends(get_db)):
    return crud.delete(id, models.User, db)


### PORTFOLIO ###

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

@app.get('/portfolio/{portfolio_id}/transactions',tags=['transaction'])
async def get_transactions_by_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    portfolio_type = crud.get(db=db, model=models.Portfolio, id=portfolio_id).portfolio_type
    transactions = crud.get_transactions_from_portfolio(db=db, portfolio_id=portfolio_id)
    new_transactions = []
    for transaction in transactions:
        ticker_key = 'Symbol'
        new_transactions.append({
            'Volume': transaction.amount,
            ticker_key: transaction.ticker,
            'CostPrice': transaction.value
        })
    return new_transactions

@app.get('/portfolio/{portfolio_id}/positions', tags=['position'])
async def get_positions(portfolio_id:int, db: Session = Depends(get_db)):
    positions = crud.get_positions(db=db, portfolio_id=portfolio_id)
    print(positions)
    return positions

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
    portfolio = crud.get(portfolio_id, models.Portfolio, db)
    for transaction in portfolio.transactions:
        crud.delete(transaction.id, models.Transaction, db)
    async with aiofiles.open(file.filename, 'wb') as out_file:
        content = await file.read()  # async read
        await out_file.write(content)  # async write
    df = pd.read_csv(file.filename, sep=";")
    formatted_data = df.to_dict('records')
    print(formatted_data)
    for transaction in formatted_data:
        amount = str(transaction['Volume']).replace('.','').replace(',','.')
        value = str(transaction['Cost Price']).replace('.','').replace(',','.')
        kwargs = {'ticker': transaction['Symbol'], 'amount': amount, 'value': value, 'portfolio_id':portfolio_id}
        crud.add(schema=None, model=models.Transaction, db=db, **kwargs)
    os.remove(file.filename)
    return {"transactions":formatted_data}