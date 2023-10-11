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

import { ToastContainer, toast } from "react-toastify";
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
      toast("Succesfully Edited");
      fetchUserBookings();
      handleDialogClose();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (index === 0) setExpand(true);
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
      } collapse-close bg-secondary/10 md:p-5 mx-auto mt-3 border-2 three-d shadow-md border-black text-black rounded-md lg:w-[60rem]`}
      onClick={() => setExpand((prev) => !prev)}
    >
      <div className="collapse-title font-medium flex flex-col  rounded-md  cursor-pointer">
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

        <div className="flex flex-row mt-2 items-center justify-normal  gap-3">
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
  <span className=" text-secondary border-b-2 border-secondary tracking-widest text-[.9rem] md:text-[1.15rem]">
    {text}
  </span>
);

export default CabShareSmall;
