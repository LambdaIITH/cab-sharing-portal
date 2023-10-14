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
import UserbookingShimmer from "components/commonForAll/UserbookingShimmer";

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
  const [isLoading, setIsLoading] = useState(true);

  const [expand, setExpand] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setExpand(true);
  };
  const handleDialogClose = () => {
    setExpand(false);
  };

  const fetchFilteredBookings = async () => {
    setIsLoading(true);
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

    try {
      const response = await axios.get(apiURL, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });
      console.log("data", response.data);
      setFilteredBookings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching filtered bookings:", error);
    }
  };

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setEmail(localStorage.getItem("user_email"));
  }, []);

  useEffect(() => {
    if (username && email) {
      fetchFilteredBookings().then(() => {
        setIsLoading(false);
      });
    }
  }, [username, email]);

  const handleShowAll = (event) => {
    setShowAll(!show_all);
    setChecked(event.target.checked);
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    const authToken = retrieveAuthToken(router);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/requests`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("requests", response.data);
      setFilteredBookings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
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
      {isLoading ? (
        <UserbookingShimmer />
      ) : (
        <div>
          <div className="flex flex-row gap-2 items-center justify-center rounded-lg"></div>

          <div
            tabIndex={0}
            className={`collapse   ${
              expand ? "collapse-open" : "collapse-close"
            } collapse-close bg-secondary/10 md:p-5 mx-auto mt-5 border-2 three-d shadow-md border-black text-black rounded-md lg:w-[60rem]`}
          >
            <div className="collapse-title font-medium flex flex-col   rounded-md">
              <p className="text-secondary border-b-2 border-secondary mb-2 tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
                Sort & Filter
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center rounded-md">
                <FormGroup sx={{ width: "200px" }}>
                  <FormControlLabel
                    sx={{
                      color: "black",
                      fontFamily: "Montserrat, sans-serif",
                    }}
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
                  <FormControlLabel
                    sx={{
                      color: "black",
                      fontFamily: "Montserrat, sans-serif",
                    }}
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
                <div className="ml-auto">
                  {!expand && (
                    <button
                      className="btn bg-yellow-400 hover:bg-yellow-400 text-black capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[0.5px]"
                      onClick={handleDialogOpen}
                    >
                      Filter
                    </button>
                  )}
                  {(startTime !== null ||
                    endTime !== null ||
                    toValue !== null ||
                    fromValue !== null) && (
                    <button
                      className="btn bg-yellow-400 hover:bg-yellow-400 text-black capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[0.5px]"
                      onClick={() => {
                        setEndTime(null);
                        setStartTime(null);
                        setToValue(null);
                        setFromValue(null);
                        setExpand(false);
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="collapse-content">
              <DialogContent>
                <div className="flex flex-col gap-3 ">
                  <p className="text-[.9rem] md:text-[1rem] w-[20rem] text-center">
                    Filter based on times, locations or both <br />
                  </p>
                  <div className="flex flex-row gap-2">
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
                  </div>
                  <div className="flex flex-row gap-2">
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
                      renderInput={(params) => (
                        <TextField {...params} label="From" />
                      )}
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
                      renderInput={(params) => (
                        <TextField {...params} label="To" />
                      )}
                    />
                  </div>
                </div>
                <DialogActions>
                  <button
                    onClick={handleDialogClose}
                    className=" btn  bg-yellow-400 text-black hover:bg-yellow-400 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] disabled:text-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={fetchFilteredBookings}
                    className=" btn  bg-yellow-400 text-black hover:bg-yellow-400 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] disabled:bg-gray-300 disabled:text-gray-400"
                    disabled={
                      (startTime === null || endTime === null) &&
                      (toValue === null || fromValue === null)
                    }
                  >
                    Filter
                  </button>
                </DialogActions>
              </DialogContent>
            </div>
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
      )}
    </div>
  );
};

export default AllUserBookings;
