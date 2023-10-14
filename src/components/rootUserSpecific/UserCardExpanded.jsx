import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import ConformModal from "components/modals/ConformModal";
import UserRequests from "./UserRequests";
import UserTravellers from "./UserTravellers";

const UserCardExpanded = ({ bookingData, fetchUserBookings }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // handlers

  const DeleteBooking = async (e) => {
    // e.stopPropagation();
    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}`,
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
    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}/accept`,
        {
          requester_email: request_email,
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
    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}/reject`,
        {
          requester_email: request_email,
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
    <div
      className="flex flex-col w-[100%]  "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
            <h3 className=" tracking-widest text-[1rem] md:text-[1.15rem] mr-auto">
              {bookingData.travellers[0].name}
            </h3>
            <p className="text-secondary border-b-2 border-secondary tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
              {bookingData.travellers[0].email}
            </p>
          </div>
          <div>
            <span className="text-secondary text-[.9rem] md:text-[1rem]">
              Note:
            </span>{" "}
            {bookingData.travellers[0].comments}
          </div>
        </div>
        <ConformModal
          modalText={"Are you sure you want to delete this booking"}
          buttonText={"Yes"}
          buttonClickFunction={DeleteBooking}
          displayText={"Delete"}
        />
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
