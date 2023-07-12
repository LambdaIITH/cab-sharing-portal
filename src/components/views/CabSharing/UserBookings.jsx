import CabShareSmall from 'components/CabShareSmall';
import React, { useEffect, useState } from 'react'
import { NewBookingDialog } from './NewBookingDialog';
import { Stack } from '@mui/material';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const fetchUserBookings = () => {
    const authToken = localStorage.getItem("credential");
    fetch("http://localhost:8000/user", {
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
    setEmail(localStorage.getItem('user_email'))
    fetchUserBookings();
  }, []);

  return (
    <div className="flex flex-col  overflow-auto  mx-5  rounded-box py-10">
      <Stack
        direction="row"
        spacing={1}
        sx={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: '2rem' }}
      >
        <NewBookingDialog /> 
      </Stack>
        {bookings?.map((item, index) => <CabShareSmall userSpectific={true} key={index} bookingData={item} username={username} email={email}  />)}

   </div>
  )
}

export default UserBookings;    