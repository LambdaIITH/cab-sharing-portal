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
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const locations = [
  "IITH",
  "RGIA",
  "Secunderabad Railway Station",
  "Lingampally",
];

export function NewBookingDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const initData = {
    from_: null,
    to: null,
    capacity: null,
  };
  const initState = { isLoading: false, error: "", values: initData };
  const [registerData, setRegisterData] = useState(initState);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [touched, setTouched] = useState({});
  const { values, isLoading, error } = registerData;

  // handlers

  const onBlur = ({ target }) =>
    setTouched((prev) => ({ ...prev, [target.name]: true }));

  const handleChange = ({ target }) => {
    setRegisterData((prev) => ({
      ...prev,
      values: { ...prev.values, [target.name]: target.value },
    }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const RegisterNewBooking = async () => {
    const authToken = localStorage.getItem("credential");
    // console.log(authToken);
    console.log(
      new Date(
        date.toISOString().slice(0, 10) + startTime.toISOString().slice(10)
      )
    );
    fetch("http://localhost:8000/book", {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        ...values,
        start_time: new Date(
          date.toISOString().slice(0, 10) + startTime.toISOString().slice(10)
        ),
        end_time: new Date(
          date.toISOString().slice(0, 10) + endTime.toISOString().slice(10)
        ),
        date: date,
        comments: "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDialogOpen(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => console.log(registerData.values), [registerData]);

  const destinations = locations.map((loc, i) => (
    <MenuItem key={i} value={loc}>
      {loc}
    </MenuItem>
  ));
  return (
    <>
      <button
        // variant="contained"
        onClick={handleDialogOpen}
        // sx={{ marginBottom: "10px" }}
        className="border btn border-black p-3 rounded-lg my-3 shadow-lg transition-all hover:-translate-y-1"
      >
        Register Booking
      </button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>New booking</DialogTitle>
        <DialogContent>
          <Stack gap={3}>
            Please fill the form to create a new booking. <br />
            Your email address will be automatically associated with your
            booking.
            {values.from_ !== null && values.from_ === values.to && (
              <span className="label-text-alt mt-1 text-red-600">
                To and From Location cannot be the same
              </span>
            )}
            <FormControl>
              <InputLabel id="new-book-from">From</InputLabel>
              <Select
                value={values.from_}
                name="from_"
                onBlur={onBlur}
                label="From"
                labelId="new-book-from"
                onChange={handleChange}
                required
              >
                {destinations}
              </Select>
              {touched.from_ && !values.from_ && (
                <span className="label-text-alt mt-1 text-red-600">
                  Required
                </span>
              )}
            </FormControl>
            <FormControl>
              <InputLabel id="new-book-to">To</InputLabel>
              <Select
                value={values.to}
                name="to"
                onBlur={onBlur}
                label="To"
                labelId="new-book-to"
                onChange={handleChange}
                required
              >
                {destinations}
              </Select>
              {touched.to && !values.to && (
                <span className="label-text-alt mt-1 text-red-600">
                  Required
                </span>
              )}
            </FormControl>{" "}
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Booking Date"
                  value={date}
                  minDateTime={new Date()}
                  onChange={setDate}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  name="startTime"
                  value={startTime}
                  onChange={setStartTime}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={endTime}
                  name="endTime"
                  onChange={setEndTime}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl>
              <TextField
                id="capacity"
                name="capacity"
                label="Capacity"
                labelId="capacity-label"
                type="number"
                value={values.capacity}
                onChange={handleChange}
              />
            </FormControl>{" "}
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
