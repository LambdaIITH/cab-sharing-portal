import {
  Autocomplete,
  Dialog,
  TextField,
  FormControlLabel,
  FormGroup,
  Switch,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import retrieveAuthToken from "../utils/retrieveAuthToken";
import CabShareSmall from "components/commonForAll/CabShareSmall";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const places = ["IITH", "RGIA", "Secunderabad Railway Station", "Lingampally"];

const AllUserBookings = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [show_all, setShowAll] = useState(false);
  const [checked, setChecked] = useState(false);
  const [request_checked, setRequestChecked] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const fetchFilteredBookings = () => {
    const authToken = retrieveAuthToken(router);
    let apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`;

    if (fromValue && toValue) {
      if (startTime && endTime) {
        const isoStartTime = startTime.toISOString();
        const isoEndTime = endTime.toISOString();
        apiURL += `?from_loc=${fromValue}&to_loc=${toValue}&start_time=${isoStartTime}&end_time=${isoEndTime}`;
      } else {
        apiURL += `?from_loc=${fromValue}&to_loc=${toValue}`;
      }
    } else if (startTime && endTime) {
      const isoStartTime = startTime.toISOString();
      const isoEndTime = endTime.toISOString();
      apiURL += `?start_time=${isoStartTime}&end_time=${isoEndTime}`;
    }

    axios
      .get(apiURL, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log("data", data);
        setFilteredBookings(data);
      });
  };

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setEmail(localStorage.getItem("user_email"));
  }, []);

  useEffect(() => {
    if (username && email) {
      fetchFilteredBookings();
    }
  }, [username, email]);

  const handleShowAll = (event) => {
    setShowAll(!show_all);
    setChecked(event.target.checked);
  };

  const fetchRequests = () => {
    const authToken = retrieveAuthToken(router);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me/requests`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log("requests", data);
        setFilteredBookings(data);
      });
  };

  useEffect(() => {
    if (request_checked) {
      fetchRequests();
    } else {
      fetchFilteredBookings();
    }
  }, [request_checked]);

  const handleRequests = (event) => {
    setRequestChecked(event.target.checked);
  };

  return (
    <div className="flex flex-col  rounded-box py-10 mx-auto">
      <div className="flex flex-row gap-2 items-center justify-center rounded-lg">
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogContent>
            <div className="flex flex-col gap-3 items-center justify-center">
              <DialogTitle>Filter bookings</DialogTitle>
              <p className="text-[.9rem] md:text-[1rem] w-[20rem] text-center">
                Filter based on times, locations or both <br />
              </p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Time"
                  value={startTime}
                  minDate={new Date()}
                  maxDate={maxDate}
                  onChange={(newValue) => {
                    setStartTime(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        width: "175px",
                        borderRadius: "8px",
                      }}
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Time"
                  value={endTime}
                  minDate={new Date()}
                  maxDate={maxDate}
                  onChange={(newValue) => {
                    setEndTime(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        width: "175px",
                        borderRadius: "8px",
                      }}
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={places}
                value={fromValue}
                onChange={(event, newValue) => {
                  setFromValue(newValue);
                }}
                sx={{
                  width: "175px",
                  borderRadius: "8px",
                }}
                renderInput={(params) => <TextField {...params} label="From" />}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={places}
                value={toValue}
                onChange={(event, newValue) => {
                  setToValue(newValue);
                }}
                sx={{
                  width: "175px",
                  borderRadius: "8px",
                }}
                renderInput={(params) => <TextField {...params} label="To" />}
              />
            </div>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button
                onClick={fetchFilteredBookings}

                // disabled={!values.capacity || !endTime || !startTime || !location}
              >
                Filter
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-row gap-5 mx-auto justify-center items-center">
        <div className="flex gap-2 items-center justify-center rounded-md bg-primary w-fit mx-auto p-2">
          <FormGroup sx={{ width: "200px" }}>
            {" "}
            {/* fix this width css*/}
            <FormControlLabel
              sx={{ color: "black" }}
              control={
                <Switch
                  defaultChecked
                  checked={checked}
                  onChange={handleShowAll}
                />
              }
              label="Include filled cabs"
            />
          </FormGroup>
          <FormGroup sx={{ width: "200px" }}>
            {" "}
            {/* fix this width css*/}
            <FormControlLabel
              sx={{ color: "black" }}
              control={
                <Switch
                  defaultChecked
                  checked={request_checked}
                  onChange={handleRequests}
                />
              }
              label="Pending requests"
            />
          </FormGroup>
        </div>
        <button
          className="btn btn-primary capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-1 ml-auto"
          onClick={handleDialogOpen}
        >
          <FilterAltIcon />
        </button>
      </div>
      <div className="my-10">
        {filteredBookings?.map((item, index) => {
          if (show_all || item.capacity > item.travellers.length) {
            return (
              <CabShareSmall
                fetchFilteredBookings={fetchFilteredBookings}
                userSpecific={false}
                key={index}
                index={index}
                bookingData={item}
                username={username}
                email={email}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default AllUserBookings;
