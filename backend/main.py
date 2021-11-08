from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import finnhub
from .database import get_db, engine
from . import schemas, models
from . import crud

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


### USERS ####
@app.post("/post_user", tags=['user'])
async def add_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.add(user, models.User, db)


@app.get("/get_user", tags=['user'])
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
    return crud.add(portfolio, models.Portfolio, db)


@app.get("/get_portfolio", tags=['portfolio'])
async def get_portfolio(id: int, db: Session = Depends(get_db)):
    return crud.get(id, models.Portfolio, db)


@app.patch('/edit_portfolio', response_model=schemas.Portfolio, tags=['portfolio'])
async def edit_portfolio(id: int, request: schemas.PortfolioUpdate, db: Session = Depends(get_db)):
    return crud.edit(id, request, models.Portfolio, db)


@app.delete('/delete_portfolio', tags=['portfolio'])
async def delete_portfolio(id: int, db: Session = Depends(get_db)):
    return crud.delete(id, models.Portfolio, db)
