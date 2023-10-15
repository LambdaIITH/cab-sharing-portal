import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { NewBookingDialog } from "./NewBookingDialog";
import CabShareSmall from "components/commonForAll/CabShareSmall";
import TravellerCard from "components/commonForAll/TravellerCard";
import retrieveAuthToken from "components/utils/retrieveAuthToken";
import UserbookingShimmer from "components/commonForAll/UserbookingShimmer";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [expand, setExpand] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [loaded_phone, setLoadedPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [is_there_a_phone_number, setIsThereAPhoneNumber] = useState(true);

  useEffect(() => {
    const authToken = retrieveAuthToken(router);
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
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
  }, []);

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
    fetchUserBookings().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col  mx-auto  rounded-box md:py-10">
      {isLoading ? (
        <UserbookingShimmer />
      ) : (
        <div className="">
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
                      loaded_phone={loaded_phone}
                      phone={phone}
                      setPhone={setPhone}
                      is_there_a_phone_number={is_there_a_phone_number}
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
      )}
    </div>
  );
};

export default UserBookings;
