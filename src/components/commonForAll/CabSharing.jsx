import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "./NavBar";
import UserBookings from "components/rootUserSpecific/UserBookings";
import AllUserBookings from "components/allUsersSpecific/AllUserBookings";
import retrieveAuthToken from "components/utils/retrieveAuthToken";

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
      <div className="flex bg-purple-100 flex-col overflow-x-auto py-[2rem] min-h-screen">
        <div className="tabs flex mx-auto shadow-lg my-[2rem] border border-black rounded-lg">
          <a
            className={`tab tab-lg text-[1rem] md:text-lg transition-all rounded-l-lg ${
              tab == 0
                ? "tab-active bg-secondary/80 text-white/80"
                : "bg-secondary/20 text-white/60"
            }`}
            onClick={() => setTab(0)}
          >
            Your Bookings
          </a>
          <a
            className={`tab transition-all text-[1rem] md:text-lg rounded-r-lg tab-lg ${
              tab == 1
                ? "tab-active bg-secondary/80 text-white/80"
                : " bg-secondary/20 text-white/60"
            }`}
            onClick={() => setTab(1)}
          >
            All Bookings
          </a>
        </div>
        <div className="flex flex-nowrap overflow-x-auto">
          {tab === 0 && <UserBookings />}
          {tab === 1 && <AllUserBookings />}
        </div>
      </div>
    </>
  );
}
