import axios from "axios";
import React from "react";

const AllUserCardExpanded = ({ bookingData, email }) => {
  //   const [isValidToJoin, setIsValidToJoin] = useState(false);
  // handlers
  const JoinBooking = async () => {
    const authToken = localStorage.getItem("credential");
    try {
      const data = await axios.post(
        `http://localhost:8000/join`,
        { booking_id: bookingData.id, comment: "" },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        `successfully requested the user booking of id ${bookingData?.id}`
      );
    } catch (err) {
      console.log(err);
    }
  };
  console.log("from AlluserBookingXE", bookingData.travellers, email);
  return (
    <div>
      {bookingData.travellers?.indexOf(email) === -1 && (
        <button className="btn btn-outline" onClick={() => JoinBooking()}>
          Join Booking
        </button>
      )}
    </div>
  );
};

export default AllUserCardExpanded;
