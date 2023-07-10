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

const places = ["IITH", "RGIA", "Secunderabad Railway Station", "Lingampally"];

function createData(date, name, from, to, time, capacity) {
  return {
    date,
    name,
    from,
    to,
    time,
    capacity,
    details: [
      {
        email: "test@test.com",
        comments:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
      },
      {
        email: "test@iith.ac.in",
        comments:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={row.id} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.date}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.from}</TableCell>
        <TableCell align="right">{row.to}</TableCell>
        <TableCell align="right">{row.start_time}</TableCell>
        <TableCell align="right">{row.capacity}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {row.details.map((historyRow) => (
                    <TableRow key={historyRow.index}>
                      <TableCell component="th" scope="row">
                        {historyRow.email}
                      </TableCell>
                      <TableCell>{historyRow.comments}</TableCell>
                    </TableRow>
                  ))} */}
                  <Button variant="contained" sx={{ marginTop: "10px" }}>
                    Join Booking
                  </Button>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const rows = [
  createData(
    "02-03-2020",
    "John Doe",
    "IITH",
    "Secunderabad Railway Station",
    "8:30",
    "4"
  ),
  createData(
    "02-03-2020",
    "Ronald Roe",
    "IITH",
    "Secunderabad Railway Station",
    "8:30",
    "4"
  ),
];

export function DataTable() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [fromValue, setFromValue] = useState();
  const [toValue, setToValue] = useState();
  const [filteredBookings, setFilteredBookings] = useState([]);

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
        <Button variant="contained" onClick={fetchFilteredBookings}>
          Search
        </Button>
      </Stack>
      {filteredBookings?.length !== 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">From</TableCell>
                <TableCell align="right">To</TableCell>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">Capacity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings?.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
