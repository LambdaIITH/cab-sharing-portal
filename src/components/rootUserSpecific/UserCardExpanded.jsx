import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import ConfirmModal from "components/modals/ConfirmModal";
import UserRequests from "./UserRequests";
import UserTravellers from "./UserTravellers";
import toastError from "components/utils/toastError";
import logout from "components/utils/logout";

const UserCardExpanded = ({ bookingData, fetchUserBookings }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [clicked_delete, setClickedDelete] = useState(false);
  // handlers

  const DeleteBooking = async (e) => {
    // e.stopPropagation();
    setClickedDelete(true);

    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios
        .delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}`,
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          toast("Succesfully Deleted", { type: "success" });
        })
        .catch((err) => {
          toastError(err.response.data.detail);
          if (err.response.status == 498) {
            logout(router);
            return;
          }
          toast("Some Error Occured", { type: "error" });
        });
      fetchUserBookings();
    } finally {
      setLoading(false);
    }
    setClickedDelete(false);
  };

  const AcceptBooking = async (e, request_email) => {
    e.stopPropagation();

    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios
        .post(
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
        )
        .then(() => {
          toast("Succesfully Accepted", { type: "success" });
        })
        .catch((err) => {
          toastError(err.response.data.detail);
          if (err.response.status == 498) {
            logout(router);
            return;
          }
          toast("Some Error Occured", { type: "error" });
        });

      fetchUserBookings();
    } finally {
      setLoading(false);
    }
  };

  const RejectBooking = async (e, request_email) => {
    e.stopPropagation();

    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios
        .post(
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
        )
        .then(() => {
          toast("Succesfully Rejected", { type: "success" });
        })
        .catch((err) => {
          toastError(err.response.data.detail);
          if (err.response.status == 498) {
            logout(router);
            return;
          }
          toast("Some Error Occured", { type: "error" });
        });
      fetchUserBookings();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col w-[100%]  "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row justify-between items-center mb-5">
        <div className="flex flex-row gap-3 pl-2 justify-between w-[100%]">
          <div className="break-words text-[.8rem] sm:text-[.9rem]">
            <span className="text-secondary text-[.9rem] md:text-[1rem]">
              Note:
            </span>{" "}
            {bookingData.travellers[0].comments}
          </div>
          <div className="">
            {!clicked_delete ? (
              <ConfirmModal
                modalText={"Are you sure you want to delete this ride"}
                buttonText={"Yes"}
                buttonClickFunction={DeleteBooking}
                displayText={"Delete Ride"}
              />
            ) : (
              <span className="loading loading-spinner text-black"></span>
            )}
          </div>
        </div>
      </div>
      {bookingData?.requests?.length > 0 && (
        <UserRequests
          requests={bookingData.requests}
          AcceptBooking={AcceptBooking}
          RejectBooking={RejectBooking}
          loading={loading}
        />
      )}
      {bookingData.travellers.length > 0 && (
        <UserTravellers
          travellers={bookingData.travellers}
          owner_email={bookingData.owner_email}
          DeleteBooking={DeleteBooking}
          clicked_delete={clicked_delete}
        />
      )}
    </div>
  );
};

export default UserCardExpanded;
