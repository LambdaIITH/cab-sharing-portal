from datetime import datetime
from typing import Dict, List, Union

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import schemas
from utils import (
    conn,
    get_bookings,
    queries,
    send_email,
    verify_auth_token,
    verify_auth_token_with_name,
)

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


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/me")
async def check_auth(email: str = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity
    """
    phone_number = queries.get_phone_number(conn, email=email)
    return {"phone_number": phone_number}


@app.post("/me")
async def create_user(
    details: schemas.UserDetails, emailname=Depends(verify_auth_token_with_name)
):
    """
    Create a new User.
    """
    email, name = emailname
    try:
        queries.insert_user(
            conn, email=email, name=name, phone_number=details.phone_number
        )
        conn.commit()
    except Exception as e:
        print(e)
        conn.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    return {"status": "success"}


@app.post("/bookings")
async def create_booking(
    booking: schemas.Booking, email: str = Depends(verify_auth_token)
):
    """
    Create a new Booking.
    """
    # get respected ids for locations
    from_id = queries.get_loc_id(conn, place=booking.from_loc)
    to_id = queries.get_loc_id(conn, place=booking.to_loc)
    if from_id is None or to_id is None:
        raise HTTPException(status_code=400, detail="Invalid Location")

    print(booking.start_time)
    print(booking.start_time)

    try:
        booking_id = queries.create_booking(
            conn,
            start_time=booking.start_time,
            end_time=booking.end_time,
            capacity=booking.capacity,
            from_loc=from_id,
            to_loc=to_id,
            owner_email=email,
            comments=booking.comments,
        )

        queries.add_traveller(
            conn, cab_id=booking_id, user_email=email, comments=booking.comments
        )
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.patch("/bookings/{booking_id}")
async def update_booking(
    booking_id: int,
    patch: schemas.BookingUpdate,
    email: str = Depends(verify_auth_token),
):
    """
    Update a Booking Time.
    """
    try:
        res = queries.update_booking(
            conn,
            start_time=patch.start_time,
            end_time=patch.end_time,
            cab_id=booking_id,
            owner_email=email,
        )
        if res == 0:
            raise HTTPException(status_code=400, detail="Invalid Booking ID")
        conn.commit()
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.get("/me/bookings")
async def user_bookings(email: str = Depends(verify_auth_token)):
    """
    Get Bookings where the authenticated user is a traveller
    """
    res1 = queries.get_user_past_bookings(conn, email=email)
    res2 = queries.get_user_future_bookings(conn, email=email)
    user_bookings_dict = {}
    user_bookings_dict["past_bookings"] = get_bookings(res1, email)
    user_bookings_dict["future_bookings"] = get_bookings(res2, email)

    return user_bookings_dict


@app.get("/me/requests")
async def user_requests(email: str = Depends(verify_auth_token)):
    """
    Get Pending requests sent by the authenticated user
    """
    res = queries.get_user_pending_requests(conn, email=email)
    requested_bookings = get_bookings(res)

    return requested_bookings


@app.get("/bookings")
async def search_bookings(
    from_loc: Union[str, None] = None,
    to_loc: Union[str, None] = None,
    start_time: Union[datetime, None] = None,
    end_time: Union[datetime, None] = None,
    email: str = Depends(verify_auth_token),
) -> List[Dict]:
    """
    Search Bookings by locations and time
    """

    start_time = start_time or datetime.fromisoformat("1970-01-01T00:00:00+05:30")
    end_time = end_time or datetime.fromisoformat("2100-01-01T00:00:00+05:30")

    if (from_loc is None) ^ (to_loc is None):
        raise HTTPException(
            status_code=400, detail="Cannot search with only one location"
        )
    elif from_loc is None and to_loc is None:
        res = queries.filter_times(conn, start_time=start_time, end_time=end_time)
    else:
        from_id = queries.get_loc_id(conn, place=from_loc)
        to_id = queries.get_loc_id(conn, place=to_loc)

        res = queries.filter_all(
            conn,
            from_loc=from_id,
            to_loc=to_id,
            start_time=start_time,
            end_time=end_time,
        )

    bookings = get_bookings(res)

    return bookings


@app.post("/bookings/{booking_id}/request")
async def request_to_join_booking(
    booking_id: int,
    join_booking: schemas.JoinBooking,
    email: str = Depends(verify_auth_token),
):
    """
    A function for a new person to place a request to join an existing booking
    """

    try:
        queries.create_request(
            conn,
            booking_id=booking_id,
            email=email,
            comments=join_booking.comments,
        )
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.delete("/bookings/{booking_id}/request")
async def delete_request(booking_id: int, email: str = Depends(verify_auth_token)):
    """
    To delete a person's request to join booking
    """
    try:
        res = queries.delete_request(conn, cab_id=booking_id, email=email)
        if res == 0:
            raise HTTPException(status_code=400, detail="Request does not exist")
        conn.commit()
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)


@app.post("/bookings/{booking_id}/accept")
async def accept_request(
    booking_id: int,
    response: schemas.RequestResponse,
    email: str = Depends(verify_auth_token),
):
    """
    To accept a person's request to join booking
    """
    owner_email = queries.get_owner_email(conn, cab_id=booking_id)
    if owner_email is None:
        raise HTTPException(status_code=400, detail="Booking does not exist")
    elif owner_email != email:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this booking"
        )

    try:
        comments = queries.update_request(
            conn,
            booking_id=booking_id,
            request_email=response.requester_email,
            val="accepted",
        )
        if comments is None:
            raise HTTPException(status_code=400, detail="There is no request to accept")

        queries.add_traveller(
            conn,
            cab_id=booking_id,
            user_email=response.requester_email,
            comments=comments,
        )

        conn.commit()
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")

    send_email(response.requester_email, "accept", booking_id)


@app.post("/bookings/{booking_id}/reject")
async def reject_request(
    booking_id: int,
    response: schemas.RequestResponse,
    email: str = Depends(verify_auth_token),
):
    """
    To reject a person's request to join booking
    """
    owner_email = queries.get_owner_email(conn, cab_id=booking_id)
    if owner_email is None:
        raise HTTPException(status_code=400, detail="Booking does not exist")
    elif owner_email != email:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this booking"
        )

    try:
        res = queries.update_request(
            conn,
            booking_id=booking_id,
            request_email=response.requester_email,
            val="rejected",
        )
        if res is None:
            raise HTTPException(status_code=400, detail="There is no request to accept")

        conn.commit()
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")

    send_email(response.requester_email, "reject", booking_id)


@app.delete("/bookings/{booking_id}")
async def delete_existing_booking(
    booking_id: int, email: str = Depends(verify_auth_token)
):
    """
    Delete a Particular booking
    """
    owner_email = queries.get_owner_email(conn, cab_id=booking_id)
    if owner_email is None:
        raise HTTPException(status_code=400, detail="Booking does not exist")
    elif owner_email != email:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this booking"
        )

    try:
        queries.delete_booking(conn, cab_id=booking_id)
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()
        raise HTTPException(status_code=500, detail="Some Error Occured")


@app.delete("/bookings/{booking_id}/self")
async def delete_user_from_booking(
    booking_id: int, email: str = Depends(verify_auth_token)
):
    """
    For a user to delete himself from a booking (owner cannot delete himself)
    """
    owner_email = queries.get_owner_email(conn, cab_id=booking_id)
    if owner_email is None:
        raise HTTPException(status_code=400, detail="Booking does not exist")
    elif owner_email == email:
        raise HTTPException(status_code=400, detail="You are the owner of this booking")

    queries.delete_particular_traveller(
        conn, cab_id=booking_id, user_email=email, owner_email=owner_email
    )

    try:
        conn.commit()
    except Exception as e:
        print(e)  # TODO: Replace with logger
        conn.rollback()

    # TODO: Send email to owner that someone has left the booking
    send_email(owner_email, "exit", booking_id, email)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # noqa: F821
