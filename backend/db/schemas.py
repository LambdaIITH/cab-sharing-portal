from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    phone: int


class Booking(BaseModel):
    from_: int
    to: int
    start_time: datetime
    end_time: datetime
    capacity: int
    comment: str


class JoinBooking(BaseModel):
    booking_id: int
    comment: str


class AcceptRejectBooking(BaseModel):
    booking_id: int
    request_email: str
