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
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import retrieveAuthToken from "../../utils/retrieveAuthToken";
import CabShareSmall from "components/CabShareSmall";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
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

  const fetchFilteredBookings = () => {
    const authToken = retrieveAuthToken(router);
    let apiURL = `http://localhost:8000/bookings`;

    if (fromValue && toValue) {
      if (startTime && endTime) {
        const isoStartTime = startTime.toISOString();
        const isoEndTime = endTime.toISOString();
        apiURL += `?from_loc=${fromValue}&to_loc=${toValue}&start_time=${isoStartTime}&end_time=${isoEndTime}`;
      } else {
        apiURL += `?from_loc=${fromValue}&to_loc=${toValue}`;
      }
    }
    else if (startTime && endTime) {
      const isoStartTime = startTime.toISOString();
      const isoEndTime = endTime.toISOString();
      apiURL += `?start_time=${isoStartTime}&end_time=${isoEndTime}`;
    }

    fetch(apiURL, {
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
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
  }

  return (
    <div className="flex flex-col  overflow-auto rounded-box py-10 mx-auto">
      <div className="flex flex-row gap-2 items-center justify-center rounded-lg">
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
                  backgroundColor: "#F2D2BD",
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
                  backgroundColor: "#F2D2BD",
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
            backgroundColor: "#F2D2BD",
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
            backgroundColor: "#F2D2BD",
            borderRadius: "8px",
          }}
          renderInput={(params) => <TextField {...params} label="To" />}
        />
          <button
            className="btn btn-primary my-3 shadow-lg transition-all hover:-translate-y-1"
            onClick={fetchFilteredBookings}
          >
            Search
          </button>
      </div>
          <FormGroup sx={{width:"200px", m:"auto"}}> {/* fix this width css*/}
            <FormControlLabel control={<Switch defaultChecked checked={checked} onChange={handleShowAll}/>} label="Show all Cabs" />
          </FormGroup>
      <div className="my-10">
        {filteredBookings?.map((item, index) => {
          if (show_all || item.occupied < item.travellers.length){
            return(
              <CabShareSmall
                fetchFilteredBookings={fetchFilteredBookings}
                userSpecific={false}
                key={index}
                index={index}
                bookingData={item}
                username={username}
                email={email}
              />
            )
          }
        })}
      </div>
    </div>
  );
};

export default AllUserBookings;
