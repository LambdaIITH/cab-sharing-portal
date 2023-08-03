import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserTravellers from "./UserTravellers";
import retrieveEmail from "components/utils/retrieveEmail";

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
  const [user_email,setUserEmail] = useState("");


  useEffect(() => {
    if (index === 0) setExpand(true);
    const user_email = retrieveEmail(router);
    setUserEmail(user_email);
  }, []);

  const ExitBooking = async (e) => {
    e.stopPropagation();
    const authToken = retrieveAuthToken(router);
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:8000/delete/bookings/${bookingData?.id}/self`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Succesfully Exited");
      fetchUserBookings();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
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
      <div className="collapse-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col justify-center my-10">
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

        {bookingData.travellers.length > 0 && (
          <UserTravellers travellers={bookingData.travellers} user_email={user_email} ExitBooking={ExitBooking} />
        )}
      </div>
    </div>
  );
};

const BoldedHeading = ({ text }) => (
  <span className=" text-primary tracking-widest text-[1.15rem]">{text}</span>
);

export default TravellerCard;
