from typing import Union
import psycopg2
from fastapi import FastAPI, Request

app = FastAPI()
conn = psycopg2.connect(database="cabsharing", user="vik", password="1234", host="127.0.0.1", port="5432")
# print("Opened database successfully!")
cur = conn.cursor()


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/signup")
async def new_user(info : Request):
    details = await info.json()
    email = "cs20btech11056@iith.ac.in"
    cur.execute("INSERT INTO users (user_email, phone_number) VALUES ('cs20btech11057@iith.ac.in', {})".format(details["phone_number"]))
    conn.commit()
    # print ("Record added successfully")