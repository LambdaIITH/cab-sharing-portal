from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    phone: int


class Booking(BaseModel):
    from_: str
    to: str
    start_time: datetime
    end_time: datetime
    capacity: int
    comments: str
    date: datetime


class JoinBooking(BaseModel):
    booking_id: int
    comment: str


class AcceptRejectBooking(BaseModel):
    booking_id: int
    request_email: str
