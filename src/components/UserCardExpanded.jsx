import React, { useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRequests from "./views/CabSharing/UserRequests";
import UserTravellers from "./views/CabSharing/UserTravellers";

const UserCardExpanded = ({ bookingData, fetchUserBookings }) => {
  const [loading, setLoading] = useState(false);

  // handlers

  const DeleteBooking = async (e) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("credential");
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:8000/bookings/${bookingData?.id}`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Succesfully Removed");
      fetchUserBookings();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const AcceptBooking = async (e, request_email) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("credential");
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8000/bookings/${bookingData?.id}/accept`,{
          requester_email:request_email
        },
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
    } finally {
      setLoading(false);
    }
  };

  const RejectBooking = async (e, request_email) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("credential");
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8000/bookings/${bookingData?.id}/reject`,{
          requester_email:request_email
        },
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col " onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-center items-center mr-auto gap-3">
            <h3 className=" tracking-widest text-[1.15rem]">
              {bookingData.travellers[0].name}
            </h3>
            <p className="text-primary tracking-wider font-medium text-[1.1rem] ">
              {bookingData.travellers[0].email}
            </p>
          </div>
          <div>
            <span className="text-primary">Note:</span>{" "}
            {bookingData.travellers[0].comments}
          </div>
        </div>
        <button
          className="btn btn-outline w-fit"
          onClick={(e) => DeleteBooking(e)}
        >
          Delete Booking
        </button>
      </div>
      <ToastContainer />
      {bookingData?.requests?.length > 0 && (
        <UserRequests
          requests={bookingData.requests}
          AcceptBooking={AcceptBooking}
          RejectBooking={RejectBooking}
          loading={loading}
        />
      )}
      {bookingData.travellers.length > 0 && (
        <UserTravellers travellers={bookingData.travellers} />
      )}
    </div>
  );
};

export default UserCardExpanded;
