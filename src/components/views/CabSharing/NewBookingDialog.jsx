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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const locations = [
  "IITH",
  "RGIA",
  "Secunderabad Railway Station",
  "Lingampally",
];

export function NewBookingDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(null);
  const [capacity, setCapacity] = useState(4);
  const initData = {
    from_: null,
    to: null,
    startDateTime: null,
    endDateTime: null,
    capacity: 4,
  };
  const initState = { isLoading: false, error: "", values: initData };
  const [registerData, setRegesterData] = useState(initState);
  const [touched, setTouched] = useState({});
  const { values, isLoading, error } = registerData;

  // handlers

  const onBlur = ({ target }) =>
    setTouched((prev) => ({ ...prev, [target.name]: true }));

  const handleChange = ({ target }) =>
    setRegesterData((prev) => ({
      ...prev,
      values: { ...prev.values, [target.name]: target.value },
    }));

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFromChange = (event) => {
    setFrom(event.target.value);
  };
  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };
  const RegisterNewBooking = async () => {
    const authToken = localStorage.getItem("credential");
    // console.log(authToken);
    fetch("http://localhost:8000/book", {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        from_: from,
        to: to,
        comments: "",
        capacity: capacity,
        date: date.toISOString().slice(0, 10),
        start_time: date.toISOString(),
        end_time: date.toISOString(),
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
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Booking Date"
                  value={date}
                  // name="to"
                  minDateTime={new Date()}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl>
              <TextField
                id="capacity"
                label="Capacity"
                labelId="capacity-label"
                type="number"
                value={capacity}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleCapacityChange}
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
