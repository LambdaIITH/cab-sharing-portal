import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import NavBar from "./NavBar";
import UserBookings from "./UserBookings";
import { useRouter } from "next/router";
import retrieveAuthToken from "../../utils/retrieveAuthToken";
import AllUserBookings from "./AllUserBookings";

export default function CabSharing() {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const handleTabChange = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    retrieveAuthToken(router);
  }, []);

  return (
    <>
      {/* <NavBar /> */}
      {/* controlling width */}
      <div className="w-[60rem] mx-auto py-[2rem]">
        <div className="tabs w-fit mx-auto shadow-lg my-[2rem] border border-black rounded-lg">
          <a
            className={`tab tab-lg transition-all ${
              tab == 0 ? "tab-active" : ""
            }`}
            onClick={() => setTab(0)}
          >
            {username}&apos;s Bookings
          </a>
          <a
            className={`tab transition-all tab-lg ${
              tab == 1 ? "tab-active" : ""
            }`}
            onClick={() => setTab(1)}
          >
            All User Bookings
          </a>
        </div>
        {tab === 0 && <UserBookings />}
        {tab == 1 && <AllUserBookings />}
      </div>
    </>
  );
}
