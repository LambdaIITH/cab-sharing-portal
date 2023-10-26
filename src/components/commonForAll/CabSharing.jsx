import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import UserBookings from "components/rootUserSpecific/UserBookings";
import AllUserBookings from "components/allUsersSpecific/AllUserBookings";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import LogoutButton from "./Logout";
import ReportBugButton from "./ReportBug";
import UserGuide from "./UserGuide";
import { ToastContainer, toast } from "react-toastify";

// 1 -> All Rides, 2 -> User Rides

export default function CabSharing() {
  const [tab, setTab] = useState(1);
  // Tab 1 - All Rides, Tab 0 - My Rides
  const [username, setUsername] = useState("");
  const router = useRouter();
  const findRides = router.query.findRides;
  const startTimeProp = router.query.startTimeProp|| null;
  const endTimeProp = router.query.endTimeProp || null;
  const fromValueProp = router.query.fromValueProp || null;
  const toValueProp = router.query.toValueProp || null;

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    retrieveAuthToken(router);
    if(findRides === 'true' || findRides==null) setTab(1);
    else setTab(0);
  }, [findRides]);

  const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

  const HeartIcon = styled(FavoriteIcon)`
    color: #fa366b;
    animation: ${pulse} 1.5s infinite;
  `;

  return (
    <div className="bg-purple-100 flex flex-col">
      {/* <NavBar /> */}
      {/* controlling width */}
      <ToastContainer />
      <div className="flex flex-row ml-auto">
        {/* <UserGuide /> */}
        <ReportBugButton />
        <LogoutButton />
      </div>
      <div className="flex bg-purple-100 flex-col overflow-x-auto min-h-screen ">
        <div className="tabs flex mx-auto shadow-lg border border-black rounded-lg mb-10">
          <a
            className={`tab tab-lg text-[1rem] md:text-lg transition-all rounded-l-lg ${
              tab == 1
                ? "tab-active bg-secondary/80 text-white/80"
                : "bg-secondary/20 text-black/30"
            }`}
            onClick={() => setTab(1)}
          >
            All Rides <span className="w-2"></span> <GroupsIcon />
          </a>
          <a
            className={`tab transition-all text-[1rem] md:text-lg rounded-r-lg tab-lg ${
              tab == 0
                ? "tab-active bg-secondary/80 text-white/80"
                : " bg-secondary/20 text-black/30"
            }`}
            onClick={() => setTab(0)}
          >
            My Rides <span className="w-2"></span> <PersonIcon />
          </a>
        </div>
        <div className="flex flex-nowrap overflow-x-auto">
          {tab === 0 && <UserBookings />}
          {tab === 1 && <AllUserBookings 
            startTimeProp={startTimeProp}
            endTimeProp={endTimeProp}
            fromValueProp={fromValueProp}
            toValueProp={toValueProp}
          />}
        </div>
      </div>
      <footer className="flex justify-center gap-2 text-[1.1rem] border-t-2 border-black/20 items-center bg-secondary/20  py-4">
        <span className="text-secondary/80">Made with </span>
        <HeartIcon />
        <span className="text-secondary/80"> By Lambda</span>
      </footer>
    </div>
  );
}
