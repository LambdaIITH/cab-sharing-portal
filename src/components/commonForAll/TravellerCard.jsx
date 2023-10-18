import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserTravellers from "../rootUserSpecific/UserTravellers";
import retrieveAuthToken from "components/utils/retrieveAuthToken";

import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Traveller card in user bookings

const TravellerCard = ({
  userSpecific,
  bookingData,
  username,
  email,
  index,
  fetchUserBookings,
}) => {
  const router = useRouter();

  const [expand, setExpand] = useState(false);
  const [user_email, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (index === 0) setExpand(true);
    setUserEmail(localStorage.getItem("user_email"));
  }, []);

  const ExitBooking = async () => {
    const authToken = retrieveAuthToken(router);

    try {
      setLoading(true);
      await axios
        .delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}/self`,
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          toast("Succesfully exited cab", { type: "success" });
        })
        .catch((err) => {
          toast("Error exiting cab", { type: "error" });
        });
      fetchUserBookings();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      tabIndex={0}
      className={`collapse collapse-arrow ${
        index === 0 && expand && "collapse-open"
      }  ${
        expand ? "collapse-open" : "collapse-close"
      } collapse-close bg-secondary/10 md:p-5 mx-3 sm:mx-auto mt-5 border-2 three-d shadow-md border-black text-black rounded-md w-[90vw] lg:w-[60rem]`}
      onClick={() => setExpand((prev) => !prev)}
    >
      <div className="collapse-title p-1 md:p-2 font-medium flex flex-col  rounded-md  cursor-pointer">
        <div className="flex flex-row justify-normal mt-2 gap-2 md:gap-10 ">
          <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate">
            <BoldedHeading text="From:" /> {bookingData.from_}
          </p>

          <p className="tracking-wider text-[.9rem] md:text-[1rem] truncate">
            <BoldedHeading text="To:" /> {bookingData.to}
          </p>

          <div className="hidden 5x:inline">
            <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate">
              <BoldedHeading text="Occupied:" />{" "}
              {bookingData.travellers?.length}/{bookingData.capacity}
            </p>
          </div>
        </div>
        <div className="5x:hidden inline mt-2">
          <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate">
            <BoldedHeading text="Occupied:" /> {bookingData.travellers?.length}/
            {bookingData.capacity}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row mt-5 sm:mt-2 sm:items-start justify-start items-start   gap-1">
          <BoldedHeading text="Window:" />
          <p className="flex flex-row items-center justify-center tracking-wider text-[.9rem] md:text-[1rem] truncate md:mt-0 ">
            <span className="mt-[3px]">
              {new Date(bookingData.start_time).toLocaleDateString() +
                " " +
                new Date(bookingData.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) +
                " - " +
                new Date(bookingData.end_time).toLocaleDateString() +
                " " +
                new Date(bookingData.end_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </p>
        </div>
      </div>
      <div
        className="collapse-content p-1 md:p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center mt-8">
          <div>
            <span className="text-secondary  font-medium text-[.9rem] md:text-[1.1rem]">
              Note:
            </span>{" "}
            {bookingData.travellers[0].comments}
          </div>
        </div>

        {bookingData.travellers.length > 0 && (
          <UserTravellers
            travellers={bookingData.travellers}
            user_email={user_email}
            ExitBooking={ExitBooking}
            owner_email={bookingData.owner_email}
          />
        )}
      </div>
    </div>
  );
};

const BoldedHeading = ({ text }) => (
  <span className=" text-secondary font-semibold  tracking-wider text-[.9rem] md:text-[1.15rem]">
    {text}
  </span>
);
export default TravellerCard;
