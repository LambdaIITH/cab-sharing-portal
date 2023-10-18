import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EditIcon from "@mui/icons-material/Edit";
import UserCardExpanded from "components/rootUserSpecific/UserCardExpanded";
import AllUserCardExpanded from "components/allUsersSpecific/AllUserCardExpanded";
const CabShareSmall = ({
  userSpecific,
  bookingData,
  username,
  email,
  index,
  fetchUserBookings,
  fetchFilteredBookings,
  loaded_phone,
  phone,
  setPhone,
  is_there_a_phone_number,
}) => {
  const router = useRouter();

  const [expand, setExpand] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [endTimeError, setEndTimeError] = useState(0);

  const checkErrors = () => {
    if (startTime && endTime) {
      if (startTime >= endTime) {
        setEndTimeError(1);
        setStartTime(null);
        setEndTime(null);
      } else if (endTime < new Date()) {
        setEndTimeError(2);
        setEndTime(null);
      } else if (endTime - startTime > 1000 * 60 * 60 * 24) {
        setEndTimeError(3);
        setStartTime(null);
        setEndTime(null);
      } else {
        setEndTimeError(0);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEndTimeError(0);
    setStartTime(new Date(bookingData.start_time));
    setEndTime(new Date(bookingData.end_time));
  };

  const editWindow = async () => {
    const authToken = retrieveAuthToken(router);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}`,
        {
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );

      toast("Succesfully Edited", { type: "success" });
      fetchUserBookings();
      handleDialogClose();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userSpecific && index === 0) setExpand(true);
  }, []);

  useEffect(() => {
    if (bookingData) {
      setStartTime(new Date(bookingData.start_time));
      setEndTime(new Date(bookingData.end_time));
    }
  }, [bookingData]);

  return (
    <div
      tabIndex={0}
      className={`collapse collapse-arrow ${
        index === 0 && expand && "collapse-open"
      }  ${
        expand ? "collapse-open" : "collapse-close"
      } collapse-close bg-secondary/10 px-2  md:p-5 py-2 sm:py-0 sm:mx-auto sm:mt-5 border-t-2 border-black/20 sm:border-2 sm:three-d sm:shadow-md sm:border-black text-black  rounded-none sm:rounded-md w-[100vw] sm:w-[90vw] lg:w-[60rem]`}
      onClick={() => setExpand((prev) => !prev)}
    >
      <div className="collapse-title p-1 md:p-2 font-medium flex flex-col  rounded-md  cursor-pointer">
        <div className="flex flex-row justify-normal mt-2 gap-2 md:gap-10 ">
          <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate">
            <BoldedHeading text="From:" /> <b>{bookingData.from_}</b>
          </p>

          <p className="tracking-wider text-[.9rem] md:text-[1rem] truncate">
            <BoldedHeading text="To:" /> <b>{bookingData.to}</b>
          </p>

          <div className="hidden 5x:inline">
            <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate">
              <BoldedHeading text="Occupied:" />{" "}
              <b>
                {bookingData.travellers?.length}/{bookingData.capacity}
              </b>
            </p>
          </div>
        </div>
        <div className="5x:hidden inline mt-2">
          <p className=" tracking-wider text-[.9rem] md:text-[1rem] truncate">
            <BoldedHeading text="Occupied:" />{" "}
            <b>
              {bookingData.travellers?.length}/{bookingData.capacity}
            </b>
          </p>
        </div>
        {/* play with window code */}

        <div className="flex flex-col sm:flex-row  mt-5 sm:mt-4 sm:items-start justify-start items-start gap-3  w-[22rem]  sm:w-[30rem] md:w-[35rem]">
          <div className="flex flex-col md:gap-3 md:flex-row items-start bg-white/30 p-2 rounded-md w-full ">
            <BoldedHeading text="Leaving window" />
            <span className="hidden md:block">-</span>
            <p className="flex flex-row items-center justify-center tracking-wider text-[.9rem] md:text-[1rem]">
              <span className="mt-[3px]">
                {new Date(bookingData.start_time).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  weekday: "short",
                }) +
                  " " +
                  new Date(bookingData.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                  " - " +
                  new Date(bookingData.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="collapse-content p-1 md:p-2">
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
            loaded_phone={loaded_phone}
            phone={phone}
            setPhone={setPhone}
            is_there_a_phone_number={is_there_a_phone_number}
          />
        )}
      </div>
    </div>
  );
};

const BoldedHeading = ({ text }) => (
  <span className=" text-secondary  tracking-wider font-semibold text-[.9rem] md:text-[1.15rem]">
    {text}
  </span>
);

export default CabShareSmall;
