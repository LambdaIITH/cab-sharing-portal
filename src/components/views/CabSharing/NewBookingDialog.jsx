import React, { useState } from "react";
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
  const [date, setDate] = useState(new Date());
  const [capacity, setCapacity] = useState(4);
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
        date: date.toISOString().slice(0,10),
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
            <FormControl>
              <InputLabel id="new-book-from">From</InputLabel>
              <Select
                value={from}
                label="From"
                labelId="new-book-from"
                onChange={handleFromChange}
                required
              >
                {destinations}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="new-book-to">To</InputLabel>
              <Select
                value={to}
                label="To"
                labelId="new-book-to"
                onChange={handleToChange}
                required
              >
                {destinations}
              </Select>
            </FormControl>{" "}
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Booking Date"
                  value={date}
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
