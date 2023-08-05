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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { MuiTelInput } from "mui-tel-input";
import { set } from "date-fns";
import axios from "axios";
import { useRouter } from "next/router";
import retrieveAuthToken from "components/utils/retrieveAuthToken";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const locations = [
  "RGIA",
  "Secunderabad Railway Station",
  "Lingampally",
];

export function NewBookingDialog({ fetchUserBookings }) {
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
  const [location, setLocation] = useState("");
  const [toggle, setToggle] = useState('from');
  const [is_there_a_phone_number, setIsThereAPhoneNumber] = useState(false);

  const [endTimeError, setEndTimeError] = useState(0);
  // 0 -> no error
  // 1 -> end time before start time
  // 2 -> end time before current time
  // 3 -> start and end time are too separated

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

  useEffect(() => {
    const authToken = retrieveAuthToken(router);
    let apiURL = `http://localhost:8000/me`;
    axios.get(apiURL, {
      headers: {
        Authorization: authToken,
      }
    })
    .then((data) => {
      if (data.data['phone_number'] == null){
        setPhone("")
        setLoadedPhone("")
        setIsThereAPhoneNumber(false)
      }
      else{
        setPhone(data.data['phone_number'])
        setLoadedPhone(data.data['phone_number'])
        setIsThereAPhoneNumber(true)
      }
    }).catch((err) => {
      console.log(err)
    })
  }, []);


  // handlers

  const handleToggle = (newToggle) => {
    if (newToggle == "from"){
      setToggle("from")
      setRegisterData((prev) => ({
        ...prev,
        values: { ...prev.values, from_loc: "IITH", to_loc: location },
      }));
    }
    else{
      setToggle("to")
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
    if (target.name == "from_loc" || target.name == "to_loc"){
      setLocation(target.value);
    }
    setRegisterData((prev) => ({
      ...prev,
      values: { ...prev.values, [target.name]: target.value },
    }));
  };
  const handlePhoneChange = (value, info) => {
    setPhone(info.numberValue);
  }

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
    fetch("http://localhost:8000/bookings", {
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
    if (phone!=loaded_phone){
      const authToken = retrieveAuthToken(router);
      let apiURL = `http://localhost:8000/me`;
      await axios.post(apiURL, 
        JSON.stringify({
          phone_number: phone,
        }),
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          }
        }
      ).then((res) => {
        setLoadedPhone(phone)
        setIsThereAPhoneNumber(true)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  const destinations = locations.map((loc, i) => (
    <MenuItem key={i} value={loc}>
      {loc}
    </MenuItem>
  ));
  return (
    <>
    <MuiTelInput defaultCountry="IN" onlyCountries={['IN']} forceCallingCode onChange={handlePhoneChange} value={phone} />
      <ToastContainer />   
      <Button
        // variant="contained"
        onClick={handlePhoneEdit}
        // sx={{ marginBottom: "10px" }}
        className=" btn btn-primary capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-1"
      >
        {(loaded_phone=="")?`Register`:`Edit`} Phone
      </Button>
      <Button
        // variant="contained"
        onClick={handleDialogOpen}
        // sx={{ marginBottom: "10px" }}
        className=" btn btn-primary capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-1"
        disabled={!is_there_a_phone_number}
      >
        Register Booking
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>New booking</DialogTitle>
        <DialogContent>
          <Stack gap={3}>
            Please fill the form to create a new booking. <br />
            Your email address will be automatically associated with your
            booking.
            {values.from_loc !== "" && values.from_loc === values.to_loc && (
              <span className="label-text-alt mt-1 text-red-600">
                To and From Location cannot be the same
              </span>
            )}
            <Box gap={3} sx={{ display: 'flex', flexDirection: 'row' }}>
            <Typography component="div" fontSize={15} sx={{ display: 'flex', alignItems: 'center' }}>
              IITH
            </Typography>
            {(toggle=="from")?
              <Button color="primary" variant="outlined"  onClick={()=>{handleToggle("to")}}>
                <ArrowForwardIcon/>
              </Button>
            :
            <Button  color="primary" variant="outlined"  onClick={()=>{handleToggle("from")}}>
              <ArrowBackIcon/>
            </Button>
            }
              <FormControl fullWidth>
              <InputLabel id="new-book-loc">Location</InputLabel>
              <Select
                value={location}
                name={(toggle=="to")?"from_loc":"to_loc"}
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
            </Box>
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
            
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={RegisterNewBooking}>Book</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
