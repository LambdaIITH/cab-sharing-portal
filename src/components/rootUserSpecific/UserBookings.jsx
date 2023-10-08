import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { NewBookingDialog } from "./NewBookingDialog";
import CabShareSmall from "components/commonForAll/CabShareSmall";
import TravellerCard from "components/commonForAll/TravellerCard";
import retrieveAuthToken from "components/utils/retrieveAuthToken";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const fetchUserBookings = async () => {
    const authToken = retrieveAuthToken(router);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/bookings`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      setBookings(res.data.future_bookings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setEmail(localStorage.getItem("user_email"));
    fetchUserBookings();
  }, []);

  return (
    <div className="flex flex-col  mx-auto  rounded-box md:py-10">
      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <NewBookingDialog
          fetchUserBookings={fetchUserBookings}
          username={username}
          email={email}
        />
      </Stack>
      <div className="">
        {bookings?.length > 0 &&
          bookings?.map((item, index) => {
            if (item.travellers[0].email === email)
              return (
                <CabShareSmall
                  fetchUserBookings={fetchUserBookings}
                  userSpecific={true}
                  key={index}
                  index={index}
                  bookingData={item}
                  username={username}
                  email={email}
                />
              );
            else
              return (
                <TravellerCard
                  fetchUserBookings={fetchUserBookings}
                  userSpecific={true}
                  key={index}
                  index={index}
                  bookingData={item}
                  username={username}
                  email={email}
                />
              );
          })}
      </div>
    </div>
  );
};

export default UserBookings;
