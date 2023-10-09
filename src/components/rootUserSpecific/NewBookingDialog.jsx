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
import { DateTimePicker } from "@mui/x-date-pickers";
import { matchIsValidTel } from "mui-tel-input";
import { set } from "date-fns";
import axios from "axios";
import { useRouter } from "next/router";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import PhoneNumberModal from "../modals/PhoneNumberModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const locations = ["RGIA", "Secunderabad Railway Station", "Lingampally"];

export function NewBookingDialog({ fetchUserBookings, username, email }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const initData = {
    from_loc: "IITH",
    to_loc: "",
    capacity: "",
    comments: "",
  };
  const initState = { isLoading: false, error: "", values: initData };
  const [registerData, setRegisterData] = useState(initState);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [touched, setTouched] = useState(false);
  const { values, isLoading, error } = registerData;

  const router = useRouter();
  const [loaded_phone, setLoadedPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [location, setLocation] = useState("");
  const [toggle, setToggle] = useState("from");
  const [is_there_a_phone_number, setIsThereAPhoneNumber] = useState(null);

  const [endTimeError, setEndTimeError] = useState(0);
  // 0 -> no error
  // 1 -> end time before start time
  // 2 -> end time before current time
  // 3 -> start and end time are too separated
  const [time1close, setTime1Close] = useState(false);
  const [time2close, setTime2Close] = useState(false);

  const checkErrors = (startTime, endTime) => {
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
    if (capacity == "" || parseFloat(capacity) != parseInt(capacity) || capacity.charCodeAt(0) < 48 || capacity.charCodeAt(0) > 57) {
      setCapacityError(1);
      return false;
    } else if (capacity < 0) {
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

  useEffect(() => {
    const authToken = retrieveAuthToken(router);
    let apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`;
    axios
      .get(apiURL, {
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
      if (!checkCapacityErrors(target.value)) {
        return false;
      }
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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setRegisterData(initState);
    setTouched(false);
    setStartTime(null);
    setEndTime(null);
    setLocation("");
    setEndTimeError(0);
  };

  const RegisterNewBooking = async () => {
    const authToken = retrieveAuthToken(router);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        ...values,
        start_time: startTime,
        end_time: endTime,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDialogOpen(false);
        setRegisterData(initState);
        setTouched(false);
        setStartTime(null);
        setEndTime(null);
        setLocation("");
        setEndTimeError(0);
        fetchUserBookings();
      })
      .catch((err) => console.log(err));
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
        })
        .catch((err) => {
          console.log(err);
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
        className={`bg-secondary/10 md:p-5 mx-auto mt-3 border-2 three-d shadow-md border-black text-black rounded-md lg:w-[60rem]`}
      >
        <div className="collapse-title font-medium flex flex-col  rounded-md  cursor-pointer">
          <p className="text-secondary border-b-2 border-secondary mb-2 tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
            Your Profile
          </p>
          <div className="flex flex-row justify-normal mt-2 gap-2 md:gap-10 ">
            <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
              <h3 className=" tracking-widest text-[1rem] md:text-[1.15rem] mr-auto">
                {username}
              </h3>
              <p className="text-secondary border-b-2 border-secondary tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
                {email}
              </p>
            </div>
          </div>
          {is_there_a_phone_number === true && (
            <div className="flex gap-4">
              <PhoneNumberModal
                handlePhoneEdit={handlePhoneEdit}
                handlePhoneChange={handlePhoneChange}
                phone={phone}
                phoneIsValid={phoneIsValid}
                edit={true}
              />
              <button
                onClick={handleDialogOpen}
                className=" btn bg-yellow-400 text-black hover:bg-yellow-500 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-1"
                disabled={!is_there_a_phone_number}
              >
                Register Booking
              </button>
            </div>
          )}
        </div>
      </div>

      {is_there_a_phone_number === false && (
        <PhoneNumberModal
          handlePhoneEdit={handlePhoneEdit}
          handlePhoneChange={handlePhoneChange}
          phone={phone}
          phoneIsValid={phoneIsValid}
        />
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>New booking</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-5 ">
            <p className="text-[.9rem] md:text-[1rem]">
              Please fill the form to create a new booking. <br />
            </p>
            {/* Your email address will be automatically associated with your
            booking. */}
            {values.from_loc !== "" && values.from_loc === values.to_loc && (
              <span className="label-text-alt mt-1 text-red-600">
                To and From Location cannot be the same
              </span>
            )}
            <div className="flex flex-row gap-3">
              <Typography
                component="div"
                fontSize={15}
                sx={{ display: "flex", alignItems: "center" }}
              >
                IITH
              </Typography>
              {toggle == "from" ? (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    handleToggle("to");
                  }}
                >
                  <ArrowForwardIcon />
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    handleToggle("from");
                  }}
                >
                  <ArrowBackIcon />
                </Button>
              )}
              <FormControl fullWidth>
                <InputLabel id="new-book-loc">Location</InputLabel>
                <Select
                  value={location}
                  name={toggle == "to" ? "from_loc" : "to_loc"}
                  onBlur={onBlur}
                  label="Location"
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
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Leave After"
                  name="startTime"
                  value={startTime}
                  onChange={setStartTime}
                  renderInput={(params) => <TextField {...params} />}
                  onClose={handleTime1Close}
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
                  onClose={handleTime2Close}
                />
              </LocalizationProvider>
              {endTimeError == 1 && (
                <span className="label-text-alt mt-1 text-red-600">
                  &quot; Leave before &quot; should be more than &quot; Leave
                  after &quot;
                </span>
              )}
              {endTimeError == 2 && (
                <span className="label-text-alt mt-1 text-red-600">
                  &quot; Leave before &quot; should be after current time
                </span>
              )}
              {endTimeError == 3 && (
                <span className="label-text-alt mt-1 text-red-600">
                  Cab window should be within 24 hours
                </span>
              )}
            </FormControl>
            <FormControl>
              <TextField
                id="capacity"
                name="capacity"
                label="Capacity"
                type="number"
                value={values.capacity}
                onChange={handleChange}
              />
            </FormControl>
              {capacityError == 1 && (
                <span className="label-text-alt mt-1 text-red-600">
                  Capacity is not valid
                </span>
              )}
              {capacityError == 2 && (
                <span className="label-text-alt mt-1 text-red-600">
                  Capacity cannot be negative
                </span>
              )}
              {capacityError == 3 && (
                <span className="label-text-alt mt-1 text-red-600">
                  Capacity more than 256, Seriously ?
                </span>
              )}
            <FormControl>
              <TextField
                id="comments"
                name="comments"
                label="Comments"
                type="text"
                value={values.comments}
                onChange={handleChange}
              />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={RegisterNewBooking}
            disabled={!values.capacity || !endTime || !startTime || !location}
          >
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const BoldedHeading = ({ text }) => (
  <span className=" text-secondary border-b-2 border-secondary tracking-widest text-[.9rem] md:text-[1.15rem]">
    {text}
  </span>
);
