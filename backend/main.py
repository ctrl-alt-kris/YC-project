from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
# import finnhub
from database import get_db, engine
import schemas, models

models.Base.metadata.create_all(engine)

app = FastAPI()

finnhub_api = "c64eft2ad3i8bn4fjpn0"

# Setup client
# finnhub_client = finnhub.Client(api_key=finnhub_api)

# Quote
# quote = finnhub_client.quote('AAPL')
# current_price = quote["c"]
# closing_price = quote["pc"]

# print("Current Price:", current_price)
# print("Closing price: ", closing_price)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/post_user")
async def add_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return models.User.create(db, **user.dict())