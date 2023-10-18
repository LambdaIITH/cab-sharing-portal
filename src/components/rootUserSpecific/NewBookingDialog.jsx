import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { matchIsValidTel } from "mui-tel-input";
import axios from "axios";
import { useRouter } from "next/router";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import PhoneNumberModal from "../modals/PhoneNumberModal";

import Link from "next/link";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const locations = [
  "RGIA",
  "Secun. Railway Stn.",
  "Lingampally Stn.",
  "Kacheguda Stn.",
  "Hyd. Deccan Stn.",
];

export function NewBookingDialog({ fetchUserBookings, username, email }) {
  const initData = {
    from_loc: "IITH",
    to_loc: "",
    capacity: "",
    comments: "",
  };
  const initState = { isLoading: false, error: "", values: initData };
  const [registerData, setRegisterData] = useState(initState);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [touched, setTouched] = useState(false);
  const { values, isLoading, error } = registerData;
  const [expand, setExpand] = useState(false);

  const router = useRouter();
  const [loaded_phone, setLoadedPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [location, setLocation] = useState("");
  const [toggle, setToggle] = useState("from");
  const [is_there_a_phone_number, setIsThereAPhoneNumber] = useState(null);

  const [clicked_book, setClickedBook] = useState(false);

  const [endTimeError, setEndTimeError] = useState(0);
  // 0 -> no error
  // 1 -> end time before start time
  // 2 -> end time before current time
  // 3 -> start and end time are too separated
  const [time1close, setTime1Close] = useState(false);
  const [time2close, setTime2Close] = useState(false);

  const checkErrors = (startTime, endTime) => {
    if (startTime > endTime || startTime == endTime) {
      setEndTimeError(1);
      setStartTime(null);
      setEndTime(null);
      setTime1Close(false);
      setTime2Close(false);
    } else if (endTime < new Date()) {
      setEndTimeError(2);
      setEndTime(null);
      setTime2Close(false);
      setTime1Close(false);
    } else if (endTime - startTime > 1000 * 60 * 60 * 24) {
      setEndTimeError(3);
      setStartTime(null);
      setEndTime(null);
      setTime1Close(false);
      setTime2Close(false);
    } else {
      setEndTimeError(0);
    }
  };

  const handleTime1Close = (date) => {
    setTime1Close(true);
    // setStartTime(date);
  };

  const handleTime2Close = (date) => {
    setTime2Close(true);
    // setEndTime(date);
  };

  useEffect(() => {
    if (time1close && time2close && startTime && endTime) {
      checkErrors(startTime, endTime);
    }
  }, [time1close, time2close, startTime, endTime]);

  const [capacityError, setCapacityError] = useState(0);
  // 0 -> no error
  // 1 -> capacity is not valid
  // 2 -> capacity is not a positive number
  // 3 -> capacity is too large

  const checkCapacityErrors = (capacity) => {
    if (
      capacity.length == "" ||
      parseFloat(capacity) != parseInt(capacity) ||
      capacity.charCodeAt(0) < 48 ||
      capacity.charCodeAt(0) > 57
    ) {
      setCapacityError(1);
      return false;
    } else if (capacity < 2) {
      setCapacityError(2);
      return false;
    } else if (capacity > 256) {
      setCapacityError(3);
      return false;
    } else {
      setCapacityError(0);
      return true;
    }
  };

  async function getMe() {
    const authToken = retrieveAuthToken(router);
    await axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((data) => {
        if (
          data.data["phone_number"] == null ||
          data.data["phone_number"] == ""
        ) {
          setPhone("");
          setLoadedPhone("");
          setIsThereAPhoneNumber(false);
        } else {
          setPhone(data.data["phone_number"]);
          setLoadedPhone(data.data["phone_number"]);
          setIsThereAPhoneNumber(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getMe();
  }, []);

  // handlers

  const handleToggle = (newToggle) => {
    if (newToggle == "from") {
      setToggle("from");
      setRegisterData((prev) => ({
        ...prev,
        values: { ...prev.values, from_loc: "IITH", to_loc: location },
      }));
    } else {
      setToggle("to");
      setRegisterData((prev) => ({
        ...prev,
        values: { ...prev.values, to_loc: "IITH", from_loc: location },
      }));
    }
  };

  const onBlur = ({ target }) =>
    // setTouched((prev) => ({ ...prev, [target.name]: true }));
    setTouched(true);

  const handleChange = ({ target }) => {
    if (target.name == "from_loc" || target.name == "to_loc") {
      setLocation(target.value);
    }
    if (target.name == "capacity") {
      checkCapacityErrors(target.value);
    }
    setRegisterData((prev) => ({
      ...prev,
      values: { ...prev.values, [target.name]: target.value },
    }));
  };
  const handlePhoneChange = (value, info) => {
    setPhone(info.numberValue);
    setPhoneIsValid(matchIsValidTel(info.numberValue));
  };

  const handleDialogClose = () => {
    setExpand(false);
    setRegisterData(initState);
    setTouched(false);
    setStartTime(null);
    setEndTime(null);
    setLocation("");
    setEndTimeError(0);
  };

  const RegisterNewBooking = async () => {
    setClickedBook(true);
    const authToken = retrieveAuthToken(router);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`,
        {
          ...values,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setExpand(false);
        setRegisterData(initState);
        setTouched(false);
        setStartTime(null);
        setEndTime(null);
        setLocation("");
        setEndTimeError(0);
        setCapacityError(0);
        setToggle("from");
        fetchUserBookings();

        toast("Booking Created Successfully", { type: "success" });
      })
      .catch((err) => {
        console.log(err);
      });
    setClickedBook(false);
  };

  const handlePhoneEdit = async () => {
    if (phone != loaded_phone) {
      const authToken = retrieveAuthToken(router);
      let apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`;
      await axios
        .post(
          apiURL,
          JSON.stringify({
            phone_number: phone,
          }),
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setLoadedPhone(phone);
          setIsThereAPhoneNumber(true);

          toast("Phone number updated successfully", { type: "success" });
        })
        .catch((err) => {
          console.log(err);

          toast("Error updating phone number", { type: "error" });
        });
    }
  };

  const destinations = locations.map((loc, i) => (
    <MenuItem key={i} value={loc}>
      {loc}
    </MenuItem>
  ));

  return (
    <>
      <div
        tabIndex={0}
        className={`collapse  ${
          expand ? "collapse-open" : "collapse-close"
        } collapse-close bg-secondary/10 sm:mx-auto md:p-5 border-black/20 border-t-2  mt-3 sm:border-2 sm:three-d sm:shadow-md sm:border-black text-black rounded-md w-[100vw] sm:w-[90vw] lg:w-[60rem]`}
      >
        <div className="collapse-title p-2  font-medium flex flex-col  rounded-md">
          <div className="flex flex-row justify-normal mt-2 gap-2 md:gap-10 ">
            <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
              <h3 className=" tracking-wider text-[1rem] md:text-[1.15rem] mr-auto">
                {username}
              </h3>
              <p className="text-secondary  tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
                {email}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {is_there_a_phone_number === true ? (
              <PhoneNumberModal
                handlePhoneEdit={handlePhoneEdit}
                handlePhoneChange={handlePhoneChange}
                phone={phone}
                phoneIsValid={phoneIsValid}
                edit={true}
                loaded_phone={loaded_phone}
                setPhone={setPhone}
              />
            ) : (
              <PhoneNumberModal
                handlePhoneEdit={handlePhoneEdit}
                handlePhoneChange={handlePhoneChange}
                phone={phone}
                phoneIsValid={phoneIsValid}
                loaded_phone={loaded_phone}
                setPhone={setPhone}
              />
            )}

            {!expand && (
              <button
                onClick={() => setExpand((prev) => !prev)}
                className={` btn hidden sm:block ml-auto bg-secondary/70 text-white/80 hover:bg-secondary/80 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] disabled:text-gray-300`}
                disabled={!is_there_a_phone_number}
              >
                Add Ride
              </button>
            )}
          </div>
          {!expand && (
            <button
              onClick={() => setExpand((prev) => !prev)}
              className=" btn block sm:hidden bg-secondary/70 text-white/80 hover:bg-secondary/80 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] disabled:text-gray-300"
              disabled={!is_there_a_phone_number}
            >
              Add Ride
            </button>
          )}
        </div>

        {is_there_a_phone_number === false ? (
          <p
            className="font-bold text-[1.1rem] text-black/80 mb-2 collapse-content  w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            Please Add phone number to create a new booking. <br />
          </p>
        ) : (
          <div
            className="flex flex-col gap-1 collapse-content"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-[1.1rem] text-black/80 mb-2  w-fit">
              Please fill the form to create a new booking. <br />
            </p>
            <div className="flex flex-row items-center justify-center gap-2 ">
              <p className="flex justify-center items-center mt-3">IITH</p>
              <div className="flex flex-col ">
                <p className="text-xs text-center">To/From</p>
                {toggle == "from" ? (
                  <button
                    className="btn bg-secondary/70 text-white/80 hover:bg-secondary/80 mt-1"
                    onClick={() => {
                      handleToggle("to");
                    }}
                  >
                    <ArrowForwardIcon />
                  </button>
                ) : (
                  <button
                    className="btn bg-secondary/70 text-white/80 hover:bg-secondary/80 mt-1"
                    onClick={() => {
                      handleToggle("from");
                    }}
                  >
                    <ArrowBackIcon />
                  </button>
                )}
              </div>
              <FormControl fullWidth>
                <p className="text-xs">Location</p>
                <Select
                  value={location}
                  name={toggle == "to" ? "from_loc" : "to_loc"}
                  onBlur={onBlur}
                  labelid="new-book-loc"
                  onChange={handleChange}
                  required
                >
                  {destinations}
                </Select>
                {touched && (!values.from_loc || !values.to_loc) && (
                  <span className="label-text-alt mt-1 text-red-600">
                    Required
                  </span>
                )}
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 my-3 w-full">
              <FormControl fullWidth>
                <p className="text-xs">
                  Willing to leave after ( 24 hr format )
                </p>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label=""
                    name="startTime"
                    value={startTime}
                    minDate={new Date()}
                    onChange={setStartTime}
                    renderInput={(params) => <TextField {...params} />}
                    onClose={handleTime1Close}
                    inputFormat="dd/MM/yyyy HH:mm"
                    ampm={false}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <p className="text-xs">
                    Have to leave before ( 24 hr format )
                  </p>
                  <DateTimePicker
                    label=""
                    value={endTime}
                    minDate={startTime ? startTime : new Date()}
                    name="endTime"
                    onChange={setEndTime}
                    renderInput={(params) => <TextField {...params} />}
                    onClose={handleTime2Close}
                    inputFormat="dd/MM/yyyy HH:mm"
                    ampm={false}
                  />
                </LocalizationProvider>
                {endTimeError == 1 && (
                  <span className="label-text-alt mt-1 text-red-600">
                    &quot; Have to leave before &quot; should be more than
                    &quot; Leave after &quot;
                  </span>
                )}
                {endTimeError == 2 && (
                  <span className="label-text-alt mt-1 text-red-600">
                    &quot; Have to leave before &quot; should be after current
                    time
                  </span>
                )}
                {endTimeError == 3 && (
                  <span className="label-text-alt mt-1 text-red-600">
                    Cab window should be within 24 hours
                  </span>
                )}
              </FormControl>
            </div>
            <FormControl variant="outlined" className="w-full">
              <p className="text-xs">
                Number of Passengers (including yourself)
              </p>
              <Select
                id="capacity"
                name="capacity"
                value={values.capacity}
                onChange={handleChange}
                label=""
              >
                {[...Array(10).keys()].map((num) => (
                  <MenuItem key={num + 1} value={num + 1}>
                    {num + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {capacityError == 1 && (
              <span className="label-text-alt mt-1 text-red-600">
                Capacity is not valid
              </span>
            )}
            {capacityError == 2 && (
              <span className="label-text-alt mt-1 text-red-600">
                Capacity cannot be less than 2
              </span>
            )}
            {capacityError == 3 && (
              <span className="label-text-alt mt-1 text-red-600">
                Capacity more than 256, Seriously ?
              </span>
            )}
            <FormControl>
              <p className="text-xs">Comments ( max 50 characters )</p>
              <TextField
                id="comments"
                name="comments"
                label=""
                type="text"
                value={values.comments}
                onChange={handleChange}
                inputProps={{ maxLength: 50 }}
                multiline
              />
            </FormControl>
            <div className="flex justify-end gap-5 mt-10">
              <button
                onClick={handleDialogClose}
                className=" btn  bg-secondary/70 text-white/80 hover:bg-secondary/80 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] disabled:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={RegisterNewBooking}
                className=" btn  bg-secondary/70 text-white/80 hover:bg-secondary/80 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] disabled:bg-gray-300 disabled:text-gray-400"
                disabled={
                  clicked_book ||
                  !values.capacity ||
                  !endTime ||
                  !startTime ||
                  !location ||
                  capacityError != 0 ||
                  endTimeError != 0
                }
              >
                {!clicked_book ? (
                  "Book"
                ) : (
                  <span className="loading loading-spinner text-black"></span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
