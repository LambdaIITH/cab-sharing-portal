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
  Stack,
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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const places = [
  "IITH",
  "RGIA",
  "Secun. Railway Stn.",
  "Lingampally Stn.",
  "Kacheguda Stn.",
  "Hyd. Deccan Stn.",
];

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

  const [phone, setPhone] = useState("");
  const [loaded_phone, setLoadedPhone] = useState("");
  const [is_there_a_phone_number, setIsThereAPhoneNumber] = useState(true);

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
        },
      });
      setFilteredBookings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching filtered bookings:", error);
      toast("Error fetching filtered bookings", {
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);

  const getMe = async () => {
    const authToken = retrieveAuthToken(router);
    await axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((data) => {
        if (
          data.data["phone_number"] == null ||
          data.data["phone_number"] == ""
        ) {
          setPhone("");
          setLoadedPhone("");
          setIsThereAPhoneNumber(false);
        } else {
          setPhone(data.data["phone_number"]);
          setLoadedPhone(data.data["phone_number"]);
          setIsThereAPhoneNumber(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setEmail(localStorage.getItem("user_email"));
    getMe();
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
      setFilteredBookings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast("Error fetching requests", {
        type: "error",
      });
      setIsLoading(false);
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
          <ToastContainer />

          <div
            tabIndex={0}
            className={`collapse   ${
              expand ? "collapse-open" : "collapse-close"
            } collapse-close bg-secondary/10 mx-3 md:p-5 sm:mx-auto mt-3 border-2 three-d shadow-md border-black text-black rounded-md w-[90vw] lg:w-[60rem]`}
          >
            <div className="collapse-title p-2 font-medium flex flex-col  rounded-md w-[90vw] sm:w-full">
              <p className="text-secondary border-b-2 border-secondary mx-auto mb-2 tracking-wider font-semibold text-[1rem] md:text-[1.1rem] mr-auto">
                Sort & Filter
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center rounded-md ">
                <FormGroup sx={{ width: "200px" }}>
                  <FormControlLabel
                    sx={{
                      color: "black",
                    }}
                    control={
                      <Switch
                        // defaultChecked
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
                    }}
                    control={
                      <Switch
                        // defaultChecked
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
                      className="btn hidden sm:block bg-yellow-400 hover:bg-yellow-400 text-black capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[0.5px]"
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
                        fetchFilteredBookings();
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
              {!expand && (
                <button
                  className="btn block sm:hidden bg-yellow-400 hover:bg-yellow-400 text-black capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[0.5px]"
                  onClick={handleDialogOpen}
                >
                  Filter
                </button>
              )}
            </div>

            <div className="collapse-content p-0 w-[90vw] sm:w-full">
              <div className="flex flex-col gap-3">
                <p className="text-[.9rem] md:text-[1rem] text-center mx-auto sm:mx-0 w-fit">
                  Filter based on times,
                  <br className="sm:hidden" /> locations or both <br />
                </p>
                <div className="flex flex-col md:flex-row gap-2  items-center sm:mr-auto">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={places}
                    value={fromValue}
                    onChange={(event, newValue) => {
                      setFromValue(newValue);
                    }}
                    sx={{
                      width: "200px",
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
                      width: "200px",
                      borderRadius: "8px",
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="To" />
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2 items-center sm:mr-auto">
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
                            width: "200px",
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
                            width: "200px",
                            borderRadius: "8px",
                          }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="flex gap-2 justify-center sm:justify-end">
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
                    (toValue === null || fromValue === null) &&
                    (startTime === null ||
                      endTime === null ||
                      toValue === null ||
                      fromValue === null)
                  }
                >
                  Filter
                </button>
              </div>
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
                    phone={phone}
                    loaded_phone={loaded_phone}
                    is_there_a_phone_number={is_there_a_phone_number}
                    setPhone={setPhone}
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
