import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { NewBookingDialog } from "./NewBookingDialog";
import CabShareSmall from "components/commonForAll/CabShareSmall";
import TravellerCard from "components/commonForAll/TravellerCard";
import UserbookingShimmer from "components/commonForAll/UserbookingShimmer";
import logout from "components/utils/logout";
import toastError from "components/utils/toastError";

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

  const fetchUserBookings = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/bookings`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBookings(res.data.future_bookings);
    } catch (err) {
      console.log(err);
      toastError(err.response.data.detail);
      if (err.response.status == 401) {
        await logout(router);
        return;
      }
      toastError("Error fetching bookings");
    }
  };

  const getMe = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
        withCredentials: true,
      });

      if (data["phone_number"] == null || data["phone_number"] === "") {
        setPhone("");
        setLoadedPhone("");
        setIsThereAPhoneNumber(false);
      } else {
        setPhone(data["phone_number"]);
        setLoadedPhone(data["phone_number"]);
        setIsThereAPhoneNumber(true);
      }
      await fetchUserBookings();
    } catch (err) {
      toastError(err.response?.data?.detail || "Error fetching user data");
      await logout(router);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setEmail(localStorage.getItem("user_email"));
    getMe();
  }, []);

  return (
    <div className="flex flex-col  mx-auto sm:pb-5 rounded-box md:py-10">
      {isLoading ? (
        <UserbookingShimmer />
      ) : (
        <div className="">
          <div className="w-[100%] sm:mb-[2rem]">
            <NewBookingDialog
              fetchUserBookings={fetchUserBookings}
              username={username}
              email={email}
            />
          </div>

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
