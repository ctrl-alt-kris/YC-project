from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
# import finnhub
from database import get_db, engine
import schemas, models

models.Base.metadata.create_all(engine)

app = FastAPI()

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


@app.get("/get_user", tags=['user'])
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

