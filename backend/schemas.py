from datetime import datetime

from pydantic import BaseModel


class Email(BaseModel):
    email: str


class UserDetails(BaseModel):
    phone_number: int


class Booking(BaseModel):
    start_time: datetime
    end_time: datetime
    capacity: int
    from_loc: str
    to_loc: str
    comments: str


class JoinBooking(BaseModel):
    comments: str


class RequestResponse(BaseModel):
    booking_id: int
    requester_email: str
