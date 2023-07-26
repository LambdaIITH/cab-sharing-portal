import React from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRequests from "./views/CabSharing/UserRequests";
import UserTravellers from "./views/CabSharing/UserTravellers";

const UserCardExpanded = ({ bookingData, fetchUserBookings }) => {
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
      fetchUserBookings();
      toast("Succesfully Removed");
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
      toast("Succesfully Accepted");
      fetchUserBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const RejectBooking = async (e, request_email) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("credential");
    try {
      const data = await axios.post(
        `http://localhost:8000/reject`,
        { booking_id: bookingData?.id, request_email },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Succesfully Rejected");
      fetchUserBookings();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        className="btn btn-outline ml-auto mr-[2rem] w-fit"
        onClick={(e) => DeleteBooking(e)}
      >
        Delete Booking
      </button>
      <ToastContainer />
      {bookingData.requests.length > 0 && (
        <UserRequests
          requests={bookingData.requests}
          AcceptBooking={AcceptBooking}
          RejectBooking={RejectBooking}
        />
      )}
      {bookingData.travellers.length > 0 && (
        <UserTravellers travellers={bookingData.travellers} />
      )}
    </div>
  );
};

export default UserCardExpanded;
