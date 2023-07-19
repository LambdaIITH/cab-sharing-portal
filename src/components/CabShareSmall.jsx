import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserCardExpanded from "./UserCardExpanded";
import AllUserCardExpanded from "./AllUserCardExpanded";

const CabShareSmall = ({
  userSpecific,
  bookingData,
  username,
  email,
  index,
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
      } collapse-close border bg-[#E6E6FA] p-5 mx-auto mt-3  rounded-md`}
      onClick={() => setExpand((prev) => !prev)}
    >
      <div className="collapse-title font-medium flex flex-col  rounded-md bg-[#E6E6FA] cursor-pointer">
        <div className="flex flex-row justify-between  items-center text-gray-800">
          <div className="flex flex-row justify-center items-center gap-3">
            <h3 className=" tracking-widest text-[1.15rem]">{username}</h3>
            <p className="text-secondary-pink text-[1rem] ">{email}</p>
          </div>
        </div>
        <div className="flex flex-row mt-2 gap-10 ">
          <p className=" tracking-wider text-[1rem] truncate">
            From: {bookingData.from_}
          </p>
          <p className=" tracking-wider text-[1rem] truncate">
            To: {bookingData.to}
          </p>
          <p className=" tracking-wider text-[1rem] truncate">
            Capacity: {bookingData.capacity}
          </p>
        </div>
        <div className="flex flex-row mt-2 gap-10 ">
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
        {userSpecific ? (
          <UserCardExpanded bookingData={bookingData} />
        ) : (
          <AllUserCardExpanded bookingData={bookingData} email={email} />
        )}
      </div>
    </div>
  );
};

export default CabShareSmall;
