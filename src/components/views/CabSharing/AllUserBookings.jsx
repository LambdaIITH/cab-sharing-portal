import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useState } from "react";
import retrieveAuthToken from "../../utils/retrieveAuthToken";
import CabShareSmall from "components/CabShareSmall";

const places = ["IITH", "RGIA", "Secunderabad Railway Station", "Lingampally"];

const AllUserBookings = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [fromValue, setFromValue] = useState();
  const [toValue, setToValue] = useState();
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [email, setEmail] = useState("");

  const fetchFilteredBookings = () => {
    const authToken = retrieveAuthToken();
    let apiURL = `http://localhost:8000/allbookings`;

    if(fromValue && toValue) {
      if(startTime && endTime) {
        apiURL += `/time?from_loc=${fromValue}&to_loc=${toValue}&start_time=${startTime}&end_time=${endTime}`;
      } else {
        apiURL += `/loc?from_loc=${fromValue}&to_loc=${toValue}`;
      }
    }
    
    fetch(apiURL, {
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFilteredBookings(data["all_bookings"]);
        setEmail(data['email'])
      });
  };

  useEffect(() => fetchFilteredBookings(), [])

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          alignItems: 'center'
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => {
              setStartTime(newValue);
            }}
            renderInput={(params) => (
              <TextField
                sx={{
                  width: "175px",
                }}
                {...params}
              />
            )}
          />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => {
              setEndTime(newValue);
            }}
            renderInput={(params) => (
              <TextField
                sx={{
                  width: "175px",
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
          sx={{ width: "175px", marginTop: "20px" }}
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
          sx={{ width: "175px", marginTop: "20px" }}
          renderInput={(params) => <TextField {...params} label="To" />}
        />
        <button   className="border btn border-black p-3 rounded-lg my-3 shadow-lg transition-all hover:-translate-y-1" onClick={fetchFilteredBookings}>
          Search
        </button>
      </Stack>
      <div className="my-10">

      {filteredBookings?.map((item, index) => <CabShareSmall key={index} bookingData={item} username={''} email={email}  />)}
      </div>
    </Box>
  )
}

export default AllUserBookings