from typing import Union
import psycopg2
from fastapi import FastAPI, Request
import aiosql
import os
from dotenv import load_dotenv

load_dotenv()

SQL_PATH = os.getenv('SQL_PATH')
DATABASE = os.getenv('DATABASE')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASS = os.getenv('POSTGRES_PASS')
POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

app = FastAPI()
queries = aiosql.from_path(SQL_PATH,"psycopg2")
conn = psycopg2.connect(database=DATABASE, user=POSTGRES_USER, password=POSTGRES_PASS, host=POSTGRES_HOST, port=POSTGRES_PORT)
# print("Opened database successfully!")


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/user")
async def new_user(info : Request):
    details = await info.json()
    email = "cs20btech11056@iith.ac.in"
    queries.insert_user(conn,user_email=email,phone_number=details['phone_number'])
    conn.commit()
    # print (details)

@app.post("/book")
async def cab_booking(info: Request):
    details = await info.json()
    email = "cs20btech11059@iith.ac.in"
    from_id = queries.get_loc_id(conn, place=details['from'])
    to_id = queries.get_loc_id(conn, place=details['to'])
    from_id = int(from_id[0])
    to_id = int(to_id[0])
    booking_id, start_time, end_time = queries.cab_booking(conn, date=details['date'], start_time=details['start_time'], 
                                    end_time=details['end_time'], comments=details['comments'],
                                    capacity=details['capacity'], from_loc=from_id, to_loc=to_id)
    
    queries.add_traveller(conn, id=booking_id, user_email=email)
    start_time = start_time.strftime("%Y-%m-%d %H:%M:%S")
    end_time = end_time.strftime("%Y-%m-%d %H:%M:%S")
    conn.commit()
    # code to find matching slots and send notification
    matches = queries.match_booking(conn, from_loc=from_id, to_loc=to_id, start_time=start_time, end_time=end_time, id=booking_id)
    print(matches)


@app.get("/user")
async def same_user_details():
    email = "cs20btech11056@iith.ac.in"
    res = queries.get_user_bookings(conn, email=email)
    user_bookings_dict = {}
    user_bookings_list = []
    for tup in res:
        booking = {"date": tup[0],
                   "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
                   "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
                   "from": tup[3],
                   "to": tup[4],
                   "capacity": tup[5],
                   "comments": tup[6],}
        user_bookings_list.append(booking)
    user_bookings_dict["user_bookings"] = user_bookings_list
    return user_bookings_dict

@app.get("/alluser")
async def all_user_details():
    a = queries.get_all_user_bookings(conn)
    user_bookings_dict = {}
    user_bookings_list = []
    for tup in a:
        booking = {"date": tup[0],
                   "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
                   "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
                   "from": tup[3],
                   "to": tup[4],
                   "capacity": tup[5],
                   "comments": tup[6],}
        user_bookings_list.append(booking)
    user_bookings_dict["user_bookings"] = user_bookings_list
    return user_bookings_dict
    # need to trim details and add list of users for each booking