import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserTravellers from "../rootUserSpecific/UserTravellers";
import retrieveAuthToken from "components/utils/retrieveAuthToken";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      await axios.delete(
        `http://localhost:8000/bookings/${bookingData?.id}/self`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Succesfully exited cab");
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
      } collapse-close bg-secondary p-5 mx-auto mt-3  rounded-md lg:w-[60rem]`}
      onClick={() => setExpand((prev) => !prev)}
    >
      <div className="collapse-title font-medium flex flex-col  rounded-md bg-secondary cursor-pointer">
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
        <div className="flex flex-row mt-2 items-center  gap-10 ">
          <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate mt-2 md:mt-0 ">
            <span className="hidden sm:inline">
              <BoldedHeading text="Window:" />
            </span>{" "}
            <span className="sm:inline mt-1 md:mt-0">
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
      <div className="collapse-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col justify-center mt-8">
          <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
            <h3 className=" tracking-widest text-[1rem] md:text-[1.15rem] mr-auto">
              {bookingData.travellers[0].name}
            </h3>
            <p className="text-primary tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
              {bookingData.travellers[0].email}
            </p>
          </div>
          <div>
            <span className="text-primary text-[.9rem] md:text-[1.1rem]">
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
          />
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

const BoldedHeading = ({ text }) => (
  <span className=" text-primary tracking-widest text-[1.15rem]">{text}</span>
);

export default TravellerCard;
