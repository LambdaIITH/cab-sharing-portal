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
from requests import request
from soupsieve import comments

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

def get_user_bookings(res, email):
    
    user_bookings_list = []
    for tup in res:
        travellers = queries.get_booking_users(conn, id=tup[0])
        
        travellers_list = []
        index = 0
        rank = -1
        for people in travellers:
            person_dict= {}
            person_dict["email"] = people[0]
            person_dict["comments"] = people[1]
            travellers_list.append(person_dict)
            if(people[0] == email):
                rank = index
            index += 1

        if(rank == 0):
            requests = queries.show_requests(conn, id=tup[0])

        booking = {
            "id": tup[0],
            "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "from": tup[3],
            "to": tup[4],
            "capacity": tup[5],
            "travellers": travellers_list,
            "requests": requests
        }
        user_bookings_list.append(booking)
        
    return user_bookings_list

def send_email(email, status):
    gmail_user = "cs20btech11056@iith.ac.in"
    gmail_password = os.getenv("APP_PASSWORD")

    
    receiver = email
    message = MIMEMultipart("alternative")
    message["Subject"] = "Cab sharing update"
    message["From"] = gmail_user
    message["To"] = receiver
    if(status == 1):

        text = """
Join request accepted :)  
        """
    
    elif(status == 0):
        text = """
Join request rejected :(  
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
    email = "cs20btech11028@iith.ac.in"
    from_id = queries.get_loc_id(conn, place=details["from"])
    to_id = queries.get_loc_id(conn, place=details["to"])
    booking_id = queries.cab_booking(
        conn,
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
    # start_time = start_time.strftime("%Y-%m-%d %H:%M:%S")
    # end_time = end_time.strftime("%Y-%m-%d %H:%M:%S")
    try:
        conn.commit()
    except:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.get("/user")
async def user_bookings(info: Request, email: str = Depends(verify_auth_token)):
    """
    Get Bookings for the authenticated user
    """
    email = "cs20btech11056@iith.ac.in"
    res1 = queries.get_user_past_bookings(conn, email=email)
    res2 = queries.get_user_future_bookings(conn, email=email)
    user_bookings_dict = {}
    user_bookings_dict["past_bookings"] = get_user_bookings(res1, email)
    user_bookings_dict["future_bookings"] = get_user_bookings(res2, email)

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
    

@app.get("/allbookings/loc/{from_loc}/{to_loc}")
async def all_bookings_loc(info: Request, from_loc: str, to_loc: str):
    """
    Get All Bookings filtered only on from and to locations
    """
    from_id = queries.get_loc_id(conn, place=from_loc)
    to_id = queries.get_loc_id(conn, place=to_loc)
    
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

@app.post("/join")
async def join_booking(info: Request):
    """
    A function for a new person to place a request to join an existing booking
    """
    details = await info.json()
    email = "cs20btech11017@iith.ac.in"
    booking_id = details["id"]
    queries.join_booking(conn, booking_id=booking_id, email=email)
    
    try:
        conn.commit()
    except:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")

@app.post("/accept")
async def accept_request(info: Request):
    """
    To accept a person's request to join booking
    """
    details = await info.json()
    booking_id = details["id"]
    request_email = details["email"]
    queries.modify_booking(conn, booking_id=booking_id, request_email=request_email, val=1)
    queries.add_traveller(conn, id=booking_id, user_email=request_email, comments="")
    
    try:
        conn.commit()
    except:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")

    send_email(request_email, 1)

@app.post("/reject")
async def reject_request(info: Request):
    """
    To accept a person's request to join booking
    """
    details = await info.json()
    booking_id = details["id"]
    request_email = details["email"]
    queries.modify_booking(conn, booking_id=booking_id, request_email=request_email, val=0)
    
    try:
        conn.commit()
    except:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")

    send_email(request_email, 0)

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
