import React, { useEffect, useState } from "react";

import axios from "axios";
import { matchIsValidTel } from "mui-tel-input";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneNumberModal from "components/modals/PhoneNumberModal";
import UserTravellers from "components/rootUserSpecific/UserTravellers";
import retrieveAuthToken from "components/utils/retrieveAuthToken";

const AllUserCardExpanded = ({ bookingData, email, fetchFilteredBookings }) => {
  const [isValidToJoin, setIsValidToJoin] = useState(false);
  const [joinComment, setJoinComment] = useState("I am interested to join.");

  const [loaded_phone, setLoadedPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [is_there_a_phone_number, setIsThereAPhoneNumber] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const authToken = retrieveAuthToken(router);
    let apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`;
    axios
      .get(apiURL, {
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

  // handlers
  const JoinBooking = async () => {
    const authToken = retrieveAuthToken(router);
    if (phone != loaded_phone) {
      let apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`;
      await axios
        .post(
          apiURL,
          JSON.stringify({
            phone_number: phone,
          }),
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });
    }
    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData.id}/request`,
        { comments: joinComment },
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
      toast("Successfully Requested");
    } catch (err) {
      console.log(err);
    } finally {
      fetchFilteredBookings();
    }
  };

  const handlePhoneEdit = async () => {
    if (phone != loaded_phone) {
      const authToken = retrieveAuthToken(router);
      let apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`;
      await axios
        .post(
          apiURL,
          JSON.stringify({
            phone_number: phone,
          }),
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toast("Phone Number Updated");
          fetchFilteredBookings();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCancelRequest = async (e) => {
    e.stopPropagation();
    const authToken = retrieveAuthToken(router);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingData?.id}/request`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      toast("Succesfully Cancelled Request");
      fetchFilteredBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const travellers_email_list = [];
  bookingData.travellers.map((item) => travellers_email_list.push(item.email));

  const request_email_list = [];
  bookingData.requests?.map((item) => request_email_list.push(item.email));

  const isInRequest = request_email_list.indexOf(email);
  let ownerIndex = 0;

  const handlePhoneChange = (value, info) => {
    setPhone(info.numberValue);
    setPhoneIsValid(matchIsValidTel(info.numberValue));
  };

  console.log(is_there_a_phone_number);

  useEffect(() => {
    if (travellers_email_list.indexOf(email) === -1 && isInRequest === -1)
      setIsValidToJoin(true);
    else ownerIndex = travellers_email_list.indexOf(email);
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-5 w-full">
      <div className="flex flex-col justify-center my-5">
        <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
          <h3 className=" tracking-widest text-[1rem] sm:text-[1.15rem]">
            {bookingData.travellers[0].name}
          </h3>
          <p className="text-primary tracking-wider font-medium text-[.9rem] sm:text-[1.1rem] mr-auto ">
            {bookingData.travellers[0].email}
          </p>
        </div>
        <div>
          <span className="text-primary text-[.9rem] sm:text-[1.1rem] ">
            Note:
          </span>{" "}
          {bookingData.travellers[0].comments}
        </div>
      </div>
      {
        <div className="flex flex-row justify-between items-center">
          {isValidToJoin && isInRequest == -1 ? (
            <input
              disabled={!isValidToJoin && !is_there_a_phone_number}
              onClick={(e) => e.stopPropagation()}
              value={joinComment}
              name="comment"
              onChange={(e) => setJoinComment(e.target.value)}
              className="bg-transparent w-[60%] txt-black text-[.8rem] sm:text-[1.1rem] py-3 pl-2 rounded-sm border-b border-white"
            />
          ) : (
            <p></p>
          )}
          <div>
            {isValidToJoin && isInRequest == -1 && (
              <button
                disabled={
                  joinComment.length == 0 || phone.replace("+91", "") == ""
                }
                className="btn btn-outline"
                onClick={JoinBooking}
              >
                Join Booking
              </button>
            )}
            {!is_there_a_phone_number && (
              <PhoneNumberModal
                handlePhoneEdit={handlePhoneEdit}
                handlePhoneChange={handlePhoneChange}
                phone={phone}
                phoneIsValid={phoneIsValid}
              />
            )}

            {isInRequest != -1 && (
              <button
                onClick={(e) => {
                  handleCancelRequest(e);
                }}
                className="btn btn-outline"
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      }

      <div className="mt-5">
        {bookingData.travellers.length > 0 && (
          <UserTravellers
            travellers={bookingData.travellers}
            hidePhoneNumber={true}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllUserCardExpanded;
