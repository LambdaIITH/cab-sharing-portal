import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserTravellers from "./UserTravellers";

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

  useEffect(() => {
    if (index === 0) setExpand(true);
  }, []);

  return (
    <div
      tabIndex={0}
      className={`collapse collapse-arrow ${
        index === 0 && expand && "collapse-open"
      }  ${
        expand ? "collapse-open" : "collapse-close"
      } collapse-close bg-secondary p-5 mx-auto mt-3  rounded-md`}
      onClick={() => setExpand((prev) => !prev)}
    >
      <div className="collapse-title font-medium flex flex-col  rounded-md bg-secondary cursor-pointer">
        <div className="flex flex-row justify-center items-center mr-auto gap-3">
          <h3 className=" tracking-widest text-[1.15rem]">
            {userSpecific
              ? bookingData.travellers[0].name
              : bookingData.travellers[0]}
          </h3>
          <p className="text-primary text-[1rem] ">
            {userSpecific
              ? bookingData.travellers[0].email
              : bookingData.travellers[0]}
          </p>
        </div>
        <div className="flex flex-row mt-2 gap-10 ">
          <p className=" tracking-wider text-[1rem] truncate">
            From: {bookingData.from_}
          </p>
          <p className=" tracking-wider text-[1rem] truncate">
            To: {bookingData.to}
          </p>
          <p className=" tracking-wider text-[1rem] truncate">
            Need: {bookingData.travellers?.length - 1}/{bookingData.capacity}
          </p>
        </div>
        <div className="flex flex-row mt-2 items-center  gap-10 ">
          <div className="flex flex-row gap-5">
            <div className="flex flex-row gap-2">
              <p className=" text-[1.1rem]">Booking Date:</p>
              <p className=" text-[1.15rem]">
                {bookingData.start_time.slice(0, 10)}
              </p>
            </div>
          </div>
          <p className=" tracking-wider text-[1rem] truncate">
            Waiting Time:{" "}
            {new Date(bookingData.start_time).toLocaleTimeString() +
              " - " +
              new Date(bookingData.end_time).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="collapse-content">
        {bookingData.travellers.length > 0 && (
          <UserTravellers travellers={bookingData.travellers} />
        )}
      </div>
    </div>
  );
};

export default TravellerCard;
