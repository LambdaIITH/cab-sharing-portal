import os
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosql
import psycopg2
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pytz import timezone

from auth import authn_user
from db import schemas

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
print("Opened database successfully!")


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
        if len(travellers_list) >= int(tup[5]):
            continue
        booking = {
            "id": tup[0],
            "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "from_": tup[3],
            "to": tup[4],
            "capacity": tup[5],
            "travellers": travellers_list,
        }
        user_bookings_list.append(booking)
    user_bookings_dict["all_bookings"] = user_bookings_list
    return user_bookings_dict


def get_user_bookings(res, email):

    user_bookings_list = []
    for tup in res:
        travellers = queries.get_booking_users(conn, id=tup[0])

        travellers_list = []
        index = 0
        rank = -1
        for people in travellers:
            person_dict = {}
            person_dict["email"] = people[0]
            person_dict["comments"] = people[1]
            travellers_list.append(person_dict)
            if people[0] == email:
                rank = index
            index += 1

        if rank == 0:
            requests = queries.show_requests(conn, id=tup[0])
            requests_list = []
            for request in requests:
                request_dict = {}
                request_dict["email"] = request[0]
                request_dict["comments"] = request[1]
                requests_list.append(request_dict)

        booking = {
            "id": tup[0],
            "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "from_": tup[3],
            "to": tup[4],
            "capacity": tup[5],
            "travellers": travellers_list,
            "requests": requests_list,
        }
        user_bookings_list.append(booking)

    return user_bookings_list


def send_email(email, status, booking_id):
    gmail_user = os.getenv("GMAIL")
    gmail_password = os.getenv("GMAIL_PASSWORD")
    print(gmail_user)
    print(gmail_password)
    receiver = email
    message = MIMEMultipart("alternative")
    message["From"] = gmail_user
    message["To"] = receiver
    if status == 1:
        subject = f"Accepted Cab sharing request on booking id {booking_id}"
        text = """\
        Yayy, your request has been accepted
        """
        html = """\
        <html>
            <body>
                <h1> Yayy! &#128512;</h1>
                <h2> Your request has been accepted </h2>
            </body>
        </html>
        """
    elif status == 0:
        subject = f"Rejected Cab sharing request on booking id {booking_id}"
        text = """\
        Sorry, your request has been rehected
        """
        html = """
        <html>
            <body>
                <h1> Sorry! &#128533;</h1>
                <h2> Your request has been rejected </h2>
            </body>
        </html>
        """
    message["Subject"] = subject
    # need to compose a proper email with accept and reject options
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
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
async def new_booking(
    booking: schemas.Booking, email: str = Depends(verify_auth_token)
):
    """
    Create a new Booking.
    """
    email = email
    from_id = queries.get_loc_id(conn, place=booking.from_)
    to_id = queries.get_loc_id(conn, place=booking.to)
    booking_id = queries.cab_booking(
        conn,
        start_time=booking.start_time.astimezone(timezone("Asia/Kolkata")),
        end_time=booking.end_time.astimezone(timezone("Asia/Kolkata")),
        date=booking.date.astimezone(timezone("Asia/Kolkata")).strftime("%Y-%m-%d"),
        # comments=details["comments"],
        capacity=booking.capacity,
        from_loc=from_id,
        to_loc=to_id,
    )

    queries.add_traveller(
        conn, id=booking_id, user_email=email, comments=booking.comments
    )
    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.get("/user")
async def user_bookings(email: str = Depends(verify_auth_token)):
    """
    Get Bookings for the authenticated user
    """
    email = email
    res1 = queries.get_user_past_bookings(conn, email=email)
    res2 = queries.get_user_future_bookings(conn, email=email)
    user_bookings_dict = {}
    user_bookings_dict["past_bookings"] = get_user_bookings(res1, email)
    user_bookings_dict["future_bookings"] = get_user_bookings(res2, email)

    return user_bookings_dict


@app.post("/user")
async def new_user(user: schemas.User, email: str = Depends(verify_auth_token)):
    phone_number = user.phone_number
    email = email
    queries.insert_user(conn, user_email=email, phone_number=phone_number)
    try:
        conn.commit()
    except Exception as err:
        conn.rollback()
        print(err)
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.get("/allbookings")
async def all_bookings(email: str = Depends(verify_auth_token)):
    """
    Get All Bookings
    """
    email = email
    a = queries.get_all_bookings(conn)
    bookings_dict = get_bookings(a)
    bookings_dict["email"] = email

    return bookings_dict


@app.get("/allbookings/loc/")
async def all_bookings_loc(
    from_loc: str, to_loc: str, email: str = Depends(verify_auth_token)
):
    """
    Get All Bookings filtered only on from and to locations
    """
    from_id = queries.get_loc_id(conn, place=from_loc)
    to_id = queries.get_loc_id(conn, place=to_loc)

    a = queries.filter_locations(conn, from_loc=from_id, to_loc=to_id)
    bookings_dict = get_bookings(a)
    return bookings_dict


@app.get("/allbookings/time/")
async def all_bookings_time(
    from_loc: str,
    to_loc: str,
    start_time: datetime,
    end_time: datetime,
    email: str = Depends(verify_auth_token),
):
    """
    Get All Bookings filtered on from location, to location, start time and end time
    """
    from_id = queries.get_loc_id(conn, place=from_loc)
    to_id = queries.get_loc_id(conn, place=to_loc)
    start_time = start_time
    end_time = end_time

    a = queries.filter_times(
        conn, from_loc=from_id, to_loc=to_id, start_time=start_time, end_time=end_time
    )
    bookings_dict = get_bookings(a)
    return bookings_dict


@app.post("/join")
async def join_booking(
    join_booking: schemas.JoinBooking, email: str = Depends(verify_auth_token)
):
    """
    A function for a new person to place a request to join an existing booking
    """
    queries.join_booking(
        conn,
        booking_id=join_booking.booking_id,
        email=email,
        comment=join_booking.comment,
    )

    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.post("/accept")
async def accept_request(
    accept_booking: schemas.AcceptRejectBooking, email: str = Depends(verify_auth_token)
):
    """
    To accept a person's request to join booking
    """
    comment = queries.modify_booking(
        conn,
        booking_id=accept_booking.booking_id,
        request_email=accept_booking.request_email,
        val=1,
    )
    queries.add_traveller(
        conn,
        id=accept_booking.booking_id,
        user_email=accept_booking.booking_id,
        comments=comment,
    )

    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")

    send_email(accept_booking.request_email, 1, accept_booking.booking_id)


@app.post("/reject")
async def reject_request(
    reject_booking: schemas.AcceptRejectBooking, email: str = Depends(verify_auth_token)
):
    """
    To accept a person's request to join booking
    """
    comment = queries.modify_booking(  # noqa: F841
        conn,
        booking_id=reject_booking.booking_id,
        request_email=reject_booking.request_email,
        val=0,
    )

    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        raise HTTPException(status_code=500, detail="Some Error Occured")

    send_email(reject_booking.request_email, 0, reject_booking.booking_id)


@app.delete("/deletebooking/{booking_id}")
async def delete_existing_booking(
    booking_id: int, email: str = Depends(verify_auth_token)
):
    """
    Delete a Particular booking
    """
    travellers = queries.get_booking_users(conn, id=booking_id)
    if travellers[0][0] == email:
        queries.delete_booking_associated_request(conn, id=booking_id)
        queries.delete_booking_associated_traveller(conn, id=booking_id)
        queries.delete_booking(conn, id=booking_id)
    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.delete("/deleteuser/{booking_id}")
async def delete_user_from_booking(
    booking_id: int, email: str = Depends(verify_auth_token)
):
    """
    Delete a particular user from a particular booking
    """
    queries.delete_particular_traveller(conn, id=booking_id, email=email)
    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)  # noqa: F821
