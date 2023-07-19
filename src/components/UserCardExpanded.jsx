import React from "react";
import axios from "axios";

const UserCardExpanded = ({ bookingData }) => {
  // handlers

  const DeleteBooking = async (e) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("credential");
    try {
      const data = await axios.delete(
        `http://localhost:8000/deletebooking/${bookingData?.id}`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        `successfully deleted the user booking of id ${bookingData?.id}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const AcceptBooking = async (e, request_email) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("credential");
    try {
      const data = await axios.post(
        `http://localhost:8000/accept`,
        { booking_id: bookingData?.id, request_email },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`successfully accepted booking of id ${bookingData?.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(bookingData.requests?.[0]);

  return (
    <div className="flex flex-col">
      <button
        className="btn btn-outline flex-start w-fit"
        onClick={(e) => DeleteBooking(e)}
      >
        Delete Booking
      </button>
      {bookingData.requests.length > 0 &&
        bookingData.requests.map((item, index) => (
          <div
            className="flex flex-col gap-3 items-center p-2 border-2 border-black"
            key={index}
          >
            <div className="flex flex-row gap-3 items-center">
              <div className="">{item.email}</div>
              <div className="">{item.comments}</div>
            </div>
            <div className="flex flex-row gap-3 items-center">
              <button
                className="btn btn-success btn-outline flex-start w-fit"
                onClick={(e) => AcceptBooking(e, item.email)}
              >
                Accept Booking
              </button>
              <button
                className="btn btn-error btn-outline flex-start w-fit"
                onClick={(e) => DeleteBooking(e)}
              >
                Reject Booking
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserCardExpanded;
