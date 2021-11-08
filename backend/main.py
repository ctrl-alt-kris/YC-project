from fastapi import FastAPI
from dotenv import load_dotenv
import os
import finnhub
load_dotenv('.env')

app = FastAPI()
API_KEY = os.getenv('API_KEY')
finnhub_client = finnhub.Client(api_key=API_KEY)


@app.get("/")
async def root():
    print(finnhub_client.quote('AAPL'))
    return {"message": "Hello World"}