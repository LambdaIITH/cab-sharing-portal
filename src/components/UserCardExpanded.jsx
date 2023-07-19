import React from "react";
import axios from "axios";

const UserCardExpanded = ({ bookingData }) => {
  // handlers
  const DeleteBooking = async () => {
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

  return (
    <div className="flex flex-col">
      <button
        className="btn btn-outline flex-start w-fit"
        onClick={() => DeleteBooking()}
      >
        Delete Booking
      </button>
    </div>
  );
};

export default UserCardExpanded;
