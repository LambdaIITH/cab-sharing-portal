import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Literal, Union

import aiosql
import psycopg2
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from google.auth import exceptions

from auth import authn_user

load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

GMAIL_USER = os.getenv("GMAIL") or ""
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD") or ""

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
)
print("Opened database successfully!")
queries = aiosql.from_path("sql", "psycopg2")


# ------------------ AUTH ----------------------


def try_details(Authorization: str):
    try:
        details = authn_user(Authorization)
        if details is None:
            raise HTTPException(
                status_code=401, detail="We are not able to authenticate you."
            )
    except exceptions.InvalidValue:
        raise HTTPException(
            status_code=498, detail="Invalid Token, please login again."
        )
    return details


def verify_auth_token(Authorization: str = Header()):
    email, name = try_details(Authorization)
    return email


def verify_auth_token_with_name(Authorization: str = Header()):
    email, name = try_details(Authorization)
    return email, name


# ------------------ AUTH END ------------------


def get_bookings(res, owner_email=None):

    bookings = []
    for tup in res:
        travellers = queries.get_travellers(conn, cab_id=tup[0])
        print("get_bookings", travellers)
        travellers_list = []

        owner_email = tup[6]

        for traveller in travellers:
            traveller_dict = {
                "email": traveller[0],
                "comments": traveller[1],
                "name": traveller[2],
                "phone_number": traveller[3],
            }
            if owner_email == traveller_dict["email"]:
                travellers_list.insert(0, traveller_dict)
            else:
                travellers_list.append(traveller_dict)

        booking = {
            "id": tup[0],
            "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "capacity": tup[3],
            "from_": tup[4],
            "to": tup[5],
            "owner_email": owner_email,
            "travellers": travellers_list,
        }

        if owner_email == tup[6]:
            requests = queries.show_requests(conn, cab_id=tup[0])
            requests_list = []
            for request in requests:
                requests_list.append(
                    {
                        "email": request[0],
                        "comments": request[1],
                        "name": request[2],
                        "phone_number": request[3],
                    }
                )
            booking["requests"] = requests_list

        bookings.append(booking)
    return bookings


print("Connecting to SMTP server")
smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
smtp_server.ehlo()
smtp_server.login(GMAIL_USER, GMAIL_PASSWORD)
print("Connected to SMTP server")


def send_email(
    receiver: str,
    mail_type: Literal["accept", "reject", "exit"],
    booking_id: int,
    exited_email: Union[str, None] = None,
):
    global smtp_server
    message = MIMEMultipart("alternative")
    message["From"] = GMAIL_USER
    message["To"] = receiver
    booking_info = queries.get_booking_details(conn, cab_id=booking_id)

    if mail_type == "accept":
        subject = (
            f"Accepted Cab sharing request from {booking_info[3]} to {booking_info[4]}"
        )
        text = "Yayy, your request has been accepted"
        html = f"""\
        <html>
            <body>
                <h2> Your request has been accepted by {booking_info[6]} ( {booking_info[7]},{booking_info[5]} )</h2>
                <p>
                    <b>From:</b> {booking_info[3]}<br>
                    <b>To:</b> {booking_info[4]}<br>
                    <b>Cab Window:</b> {booking_info[1]} - {booking_info[2]}<br>
                </p>
            </body>
        </html>
        """
    elif mail_type == "reject":
        subject = (
            f"Rejected Cab sharing request from {booking_info[3]} to {booking_info[4]}"
        )
        text = "Sorry, your request has been rejected"
        html = """
        <html>
            <body>
                <h2> Sorry, your request has been rejected </h2>
            </body>
        </html>
        """
    elif mail_type == "exit":
        assert exited_email is not None
        subject = f"{exited_email} exited your cab from {booking_info[3]} to {booking_info[4]}"
        text = "They have exited your cab"
        html = """
        <html>
            <body>
                <h2> Sorry, they have exited your cab. </h2>
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
        smtp_server.sendmail(GMAIL_USER, receiver, message.as_string())
        # print ("Email sent successfully!")
    except Exception as ex:
        print("Something went wrong", ex)
