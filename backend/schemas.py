from datetime import datetime

from pydantic import BaseModel


class Email(BaseModel):
    email: str


class UserDetails(BaseModel):
    phone_number: str


class Booking(BaseModel):
    start_time: datetime
    end_time: datetime
    capacity: int
    from_loc: str
    to_loc: str
    comments: str


class BookingUpdate(BaseModel):
    start_time: datetime
    end_time: datetime


class JoinBooking(BaseModel):
    comments: str


class RequestResponse(BaseModel):
    requester_email: str
