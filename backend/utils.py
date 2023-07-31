import os

import aiosql
import psycopg2
from fastapi import Header, HTTPException
from google.auth import exceptions
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

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

        for traveller in travellers:
            travellers_list.append({
                "email": traveller[0],
                "comments": traveller[1],
                "name": traveller[2],
                "phone_number": traveller[3],
            })

        booking = {
            "id": tup[0],
            "start_time": tup[1].strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": tup[2].strftime("%Y-%m-%d %H:%M:%S"),
            "capacity": tup[3],
            "from_": tup[4],
            "to": tup[5],
            "owner": tup[6],
            "travellers": travellers_list,
        }

        if owner_email == tup[6]:
            requests = queries.show_requests(conn, id=tup[0])
            requests_list = []
            for request in requests:
                requests_list.append({
                    "email": request[0],
                    "comments": request[1],
                    "name": request[2],
                    "phone_number": request[3],
                })
            booking["requests"] = requests_list

        bookings.append(booking)
    return bookings


smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
smtp_server.ehlo()
smtp_server.login(GMAIL_USER, GMAIL_PASSWORD)


def send_email(receiver: str, accepted: bool, booking_id: int):
    global smtp_server
    message = MIMEMultipart("alternative")
    message["From"] = GMAIL_USER
    message["To"] = receiver
    if accepted:
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
    else:
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
        smtp_server.sendmail(GMAIL_USER, receiver, message.as_string())
        # print ("Email sent successfully!")
    except Exception as ex:
        print("Something went wrong", ex)
