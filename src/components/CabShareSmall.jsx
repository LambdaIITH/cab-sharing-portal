import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserCardExpanded from "./UserCardExpanded";
import AllUserCardExpanded from "./AllUserCardExpanded";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Button, Stack, TextField} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import retrieveAuthToken from "./utils/retrieveAuthToken";
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
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEndTimeError(0);
    setStartTime(new Date(bookingData.start_time));
    setEndTime(new Date(bookingData.end_time));
  };

  const editWindow = async () => {
    const authToken = retrieveAuthToken(router);
    // try {
    //   const res = await axios.put(
    //     `http://localhost:8000/bookings/${bookingData?.id}`,
    //     {
    //       start_time: startTime,
    //       end_time: endTime,
    //     },
    //     {
    //       headers: {
    //         Authorization: authToken,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   toast("Succesfully Edited");
    //   fetchFilteredBookings();
    //   handleDialogClose();
    // } catch (err) {
    //   console.log(err);
    // }
    console.log(startTime, endTime);
  }

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
          <button
            className="btn btn-outline w-fit"
            onClick={(e) => {e.stopPropagation();setDialogOpen(true);}}
          >
          Edit Window
        </button>
          <Dialog open={dialogOpen} onClose={handleDialogClose} onClick={(e)=>{e.stopPropagation();}}>
          <DialogTitle>Edit cab window</DialogTitle>
          <DialogContent>
            <Stack gap={3} sx={{mt:"10px"}}>
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Leave After"
                    name="startTime"
                    value={startTime}
                    onChange={setStartTime}
                    renderInput={(params) => <TextField {...params} />}
                    onClose={checkErrors}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Leave Before"
                    value={endTime}
                    name="endTime"
                    onChange={setEndTime}
                    renderInput={(params) => <TextField {...params} />}
                    onClose={checkErrors}
                  />
                </LocalizationProvider>
                {endTimeError==1 && (
                <span className="label-text-alt mt-1 text-red-600">
                  &quot; Leave before &quot; should be more than &quot; Leave after &quot;
                </span>
                )}
                {endTimeError==2 && (
                <span className="label-text-alt mt-1 text-red-600">
                  &quot; Leave before &quot; should be after current time
                </span>
                )}
                {endTimeError==3 && (
                <span className="label-text-alt mt-1 text-red-600">
                  Cab window should be within 24 hours
                </span>
                )}
              </FormControl>
              
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={editWindow}>Save</Button>
          </DialogActions>
          </Dialog>
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
