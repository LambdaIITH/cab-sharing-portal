import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from functools import wraps
from typing import Union

import aiosql
import psycopg2
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from auth import authn_user

load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

app = FastAPI()

origins = [
    "https://iith.dev",
    "https://iithdashboard.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


queries = aiosql.from_path("sql", "psycopg2")

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
)
# print("Opened database successfully!")


def verify_auth_token(Authorization: str = Header()):
    email = authn_user(Authorization)
    if email is None:
        raise HTTPException(
            status_code=401, detail="We are not able to authenticate you."
        )
    return email

def get_bookings(a):
    
    user_bookings_dict = {}
    user_bookings_list = []
    for tup in a:
        travellers = queries.get_booking_users(conn, id=tup[0])
        travellers_list = []
        for people in travellers:
            travellers_list.append(people[0])
        booking = {
            "id": tup[0],
            "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "from": tup[3],
            "to": tup[4],
            "capacity": tup[5],
            "travellers": travellers_list
        }
        user_bookings_list.append(booking)
    user_bookings_dict["user_bookings"] = user_bookings_list
    return user_bookings_dict

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/auth")
async def auth(email: str = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity
    """
    return {"email": email}

@app.post("/book")
async def new_booking(info: Request, email: str = Depends(verify_auth_token)):
    """
    Create a new Booking.
    """
    details = await info.json()
    # email = "cs19btech11034@iith.ac.in"
    from_id = queries.get_loc_id(conn, place=details["from"])
    to_id = queries.get_loc_id(conn, place=details["to"])
    from_id = int(from_id[0])
    to_id = int(to_id[0])
    booking_id, start_time, end_time = queries.cab_booking(
        conn,
        date=details["date"],
        start_time=details["start_time"],
        end_time=details["end_time"],
        # comments=details["comments"],
        capacity=details["capacity"],
        from_loc=from_id,
        to_loc=to_id,
    )

    queries.add_traveller(
        conn, id=booking_id, user_email=email, comments=details["comments"]
    )
    start_time = start_time.strftime("%Y-%m-%d %H:%M:%S")
    end_time = end_time.strftime("%Y-%m-%d %H:%M:%S")
    try:
        conn.commit()
    except:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")
    # code to find matching slots and send notification
    matches = queries.match_booking(
        conn,
        from_loc=from_id,
        to_loc=to_id,
        start_time=start_time,
        end_time=end_time,
        id=booking_id,
    )
    print(matches)

    gmail_user = "cs20btech11056@iith.ac.in"
    gmail_password = os.getenv("APP_PASSWORD")

    for match in matches:
        receiver = match[0]
        message = MIMEMultipart("alternative")
        message["Subject"] = "Cab sharing match!"
        message["From"] = gmail_user
        message["To"] = receiver
        text = """
Hello there :)
Cab sharing test email from backend.    
        """
        # need to compose a proper email with accept and reject options
        part1 = MIMEText(text, "plain")
        message.attach(part1)

        try:
            smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
            smtp_server.ehlo()
            smtp_server.login(gmail_user, gmail_password)
            smtp_server.sendmail(gmail_user, receiver, message.as_string())
            smtp_server.close()
            # print ("Email sent successfully!")
        except Exception as ex:
            print("Something went wrong", ex)


@app.get("/user")
async def user_bookings(info: Request, email: str = Depends(verify_auth_token)):
    """
    Get Bookings for the authenticated user
    """
    # email = "cs19btech11034@iith.ac.in"
    res = queries.get_user_bookings(conn, email=email)
    user_bookings_dict = {}
    user_bookings_list = []
    for tup in res:
        booking = {
            "id": tup[0],
            "date": tup[1],
            "start_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[3].strftime("%Y-%m-%d %H:%M:%S"),
            "from": tup[4],
            "to": tup[5],
            "capacity": tup[6],
            # "comments": tup[6],
        }
        user_bookings_list.append(booking)
    user_bookings_dict["user_bookings"] = user_bookings_list
    return user_bookings_dict

@app.post("/user")
async def new_user(info: Request):
    details = await info.json()
    email = "cs20btech11056@iith.ac.in"
    queries.insert_user(conn, user_email=email, phone_number=details["phone_number"])
    try:
        conn.commit()
    except Exception as err:
        conn.rollback()
        print(err)
        raise HTTPException(status_code=500, detail="Some Error Occured")

@app.get("/allbookings")
async def all_bookings(info: Request):
    """
    Get All Bookings
    """
    a = queries.get_all_bookings(conn)
    bookings_dict = get_bookings(a)
    return bookings_dict
    

@app.get("/allbookings/loc")
async def all_bookings_loc(info: Request):
    """
    Get All Bookings filtered only on from and to locations
    """
    details = await info.json()
    from_id = queries.get_loc_id(conn, place=details["from"])
    to_id = queries.get_loc_id(conn, place=details["to"])
    
    a = queries.filter_locations(conn, from_loc=from_id, to_loc=to_id)
    bookings_dict = get_bookings(a)
    return bookings_dict

@app.get("/allbookings/time")
async def all_bookings_time(info: Request):
    """
    Get All Bookings filtered on from location, to location, start time and end time
    """
    details = await info.json()
    from_id = queries.get_loc_id(conn, place=details["from"])
    to_id = queries.get_loc_id(conn, place=details["to"])
    start_time = details["start_time"]
    end_time = details["end_time"]
    
    a = queries.filter_times(conn, from_loc=from_id, to_loc=to_id, start_time=start_time, end_time=end_time)
    bookings_dict = get_bookings(a)
    return bookings_dict

@app.delete("/deletebooking/{booking_id}")
async def delete_existing_booking(booking_id: int):
    """
    Delete a Particular booking
    """
    print(booking_id)
    queries.delete_booking_associated_traveller(conn, id=booking_id)
    queries.delete_booking(conn, id=booking_id)
    conn.commit()


@app.delete("/deleteuser/{booking_id}")
async def delete_user_from_booking(booking_id: int):
    """
    Delete a particular user from a particular booking
    """
    email = "cs20btech11056@iith.ac.in"
    queries.delete_particular_traveller(conn, id=booking_id, email=email)
    try:
        conn.commit()
    except:
        conn.rollback()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
