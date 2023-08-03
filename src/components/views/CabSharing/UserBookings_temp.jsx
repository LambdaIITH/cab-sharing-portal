import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
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
  Typography,
  Stack,
} from "@mui/material";
import { NewBookingDialog } from "./NewBookingDialog";
import { useEffect, useState } from "react";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import { useRouter } from "next/router";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);


  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} key={row.id}>
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
        <TableCell align="right">{props.username}</TableCell>
        <TableCell align="right">{row.from_}</TableCell>
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

export function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState("");

  const router = useRouter();
  
  const fetchUserBookings = () => {
    const authToken = retrieveAuthToken(router);
    fetch("http://localhost:8000/me/bookings", {
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('this is user bookings data from UserBooking.jsx', data);
        data['user_bookings'] =[...data['past_bookings'], ...data['future_bookings']];
        setBookings(data["user_bookings"]);
        console.log(data)
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    fetchUserBookings();
  }, []);


  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
      >
        <NewBookingDialog />
        {/* <Button variant="contained">My Bookings</Button> */}
      </Stack>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Date</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">From</TableCell>
              <TableCell align="right">To</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Capacity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {bookings?.map((row) => (
                <Row key={row.id} row={row} username={username} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
