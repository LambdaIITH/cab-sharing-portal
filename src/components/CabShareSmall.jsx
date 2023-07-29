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
  fetchUserBookings,
  fetchFilteredBookings,
}) => {
  const router = useRouter();

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (index === 0) setExpand(true);
  }, []);

  console.log(bookingData);

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
        {/* <div className="flex flex-row justify-center items-center mr-auto gap-3">
          <h3 className="tracking-widest text-[1.15rem]">
            {bookingData.travellers[0].name}
          </h3>
          <p className="text-primary text-[1rem] ">
            {bookingData.travellers[0].email}
          </p>
        </div> */}
        <div className="flex flex-row mt-2 gap-10 ">
          <p className=" tracking-wider text-[1rem] truncate">
            <BoldedHeading text="From:" /> {bookingData.from_}
          </p>
          <p className=" tracking-wider text-[1rem] truncate">
            <BoldedHeading text="To:" /> {bookingData.to}
          </p>
          <p className=" tracking-wider text-[1rem] truncate">
            <BoldedHeading text="Occupied:" /> {bookingData.travellers?.length}/
            {bookingData.capacity}
          </p>
        </div>
        <div className="flex flex-row mt-2 items-center  gap-10 ">
          {/* <div className="flex flex-row gap-5">
            <div className="flex flex-row gap-2">
              <BoldedHeading text="Booking Date:" />
              <p className=" text-[1.15rem]">
                {bookingData.start_time.slice(0, 10)}
              </p>
            </div>
          </div> */}
          <p className=" tracking-wider text-[1rem] truncate">
            <BoldedHeading text="Window:" />{" "}
            {new Date(bookingData.start_time).toLocaleDateString() +
              " " +
              new Date(bookingData.start_time).toLocaleTimeString() +
              " - " +
              new Date(bookingData.end_time).toLocaleDateString() +
              " " +
              new Date(bookingData.end_time).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="collapse-content">
        {userSpecific ? (
          <UserCardExpanded
            bookingData={bookingData}
            fetchUserBookings={fetchUserBookings}
          />
        ) : (
          <AllUserCardExpanded
            bookingData={bookingData}
            email={email}
            fetchFilteredBookings={fetchFilteredBookings}
          />
        )}
      </div>
    </div>
  );
};

const BoldedHeading = ({ text }) => (
  <span className=" text-primary tracking-widest text-[1.15rem]">{text}</span>
);

export default CabShareSmall;
