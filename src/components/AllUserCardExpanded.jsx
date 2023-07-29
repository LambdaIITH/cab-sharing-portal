import { TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserTravellers from "./views/CabSharing/UserTravellers";
import { comment } from "postcss";

const AllUserCardExpanded = ({ bookingData, email, fetchFilteredBookings }) => {
  const [isValidToJoin, setIsValidToJoin] = useState(false);
  const [joinComment, setJoinComment] = useState("I am intrested to join.");

  // handlers
  const JoinBooking = async () => {
    const authToken = localStorage.getItem("credential");
    try {
      const data = await axios.post(
        `http://localhost:8000/join`,
        { booking_id: bookingData.id, comment: joinComment },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        `successfully requested the user booking of id ${bookingData?.id}`
      );
    } catch (err) {
      console.log(err);
    } finally {
      fetchFilteredBookings();
    }
  };

  const travellers_email_list = [];
  bookingData.travellers.map((item) => travellers_email_list.push(item.email));

  const request_email_list = [];
  bookingData.requests.map((item) => request_email_list.push(item.email));

  const isInRequest = request_email_list.indexOf(email);
  let ownerIndex = 0;

  useEffect(() => {
    if (travellers_email_list.indexOf(email) === -1 && isInRequest === -1)
      setIsValidToJoin(true);
    else ownerIndex = travellers_email_list.indexOf(email);
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-5">
      <div className="flex flex-col justify-center my-5">
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
      {
        <div className="flex flex-row justify-between items-center">
          {isValidToJoin && isInRequest == -1 ? (
            <input
              disabled={!isValidToJoin}
              onClick={(e) => e.stopPropagation()}
              value={joinComment}
              name="comment"
              onChange={(e) => setJoinComment(e.target.value)}
              className="bg-transparent w-[60%] txt-black text-[1.1rem] py-3 pl-2 rounded-sm border-b border-white"
            />
          ) : (
            <p></p>
          )}
          <div>
            {isValidToJoin && isInRequest == -1 && (
              <button
                disabled={!(joinComment.length > 0)}
                className="btn btn-outline"
                onClick={() => JoinBooking()}
              >
                Join Booking
              </button>
            )}
            {isInRequest != -1 && (
              <button disabled={true} className="btn btn-outline">
                Reqest Pending
              </button>
            )}
          </div>
        </div>
      }

      <div className="mt-5">
        {bookingData.travellers.length > 0 && (
          <UserTravellers
            travellers={bookingData.travellers}
            hidePhoneNumber={true}
          />
        )}
      </div>
    </div>
  );
};

export default AllUserCardExpanded;
