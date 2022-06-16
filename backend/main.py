from typing import Union
import psycopg2
from fastapi import FastAPI, Request
import aiosql

app = FastAPI()
queries = aiosql.from_path("sql","psycopg2")
conn = psycopg2.connect(database="cabsharing", user="postgres", password="postgres", host="127.0.0.1", port="5432")
# print("Opened database successfully!")


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/signup")
async def new_user(info : Request):
    details = await info.json()
    email = "cs20btech11056@iith.ac.in"
    queries.insert_user(conn,user_email=email,phone_number=details['phone_number'])
    conn.commit()
    # print (details)

@app.post("/cabbooking")
async def cab_booking(info: Request):
    details = await info.json()
    # Update cabbooking table, traveller
    # queries.cab_booking(conn,)
