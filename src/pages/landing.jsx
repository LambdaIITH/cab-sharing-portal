import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const locations = [
  "IIT Hyderabad",
  "RGIA",
  "Secunderabad Railway Station",
  "Lingampally",
];

export default function Landing() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [date, setDate] = useState(new Date());
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFromChange = (event) => {
    setFrom(event.target.value);
  };
  const destinations = locations.map((loc) => (
    <MenuItem value={loc}>{loc}</MenuItem>
  ));
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Container fluid style={{ alignItems: "center" }}>
        <Typography variant="h3">Welcome, Rachit Keerti Das!</Typography>
      </Container>
      <Typography variant="h4">My Bookings</Typography>

      <Button variant="outlined" onClick={handleDialogOpen} disableElevation>
        New Booking
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>New booking</DialogTitle>
        <DialogContent>
          <Container
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
            }}
          >
            Please fill form to create a new booking. <br />
            <FormControl>
              <InputLabel id="new-book-from">From</InputLabel>
              <Select
                value={from}
                label="From"
                labelId="new-book-from"
                onChange={handleFromChange}
              >
                {destinations}
              </Select>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Booking Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogClose}>Book</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
