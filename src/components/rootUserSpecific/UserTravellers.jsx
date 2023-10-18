import React, { useEffect, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ConformModal from "components/modals/ConformModal";
import StarIcon from "@mui/icons-material/Star";
import ViewProfile from "components/modals/ViewProfile";
// List of traverllers in TravellerCard, this is a child of TravellerCard(parent)

const UserTravellers = ({
  travellers,
  hidePhoneNumber = false,
  user_email = "",
  ExitBooking = null,
  owner_email = "",
}) => {
  const [copied, setCopied] = useState(false);
  const user_email_local = localStorage.getItem("user_email");
  const handleCopy = () => {
    setCopied(true);
  };

  useEffect(() => {
    copied &&
      toast("Sucessfully copied", { type: "success" }) &&
      setTimeout(() => {
        setCopied(false);
      }, 2000);
  }, [copied]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <p className="border-b-2 border-secondary font-semibold text-[1.1rem] text-secondary">
        Travellers
      </p>

      {travellers.map((item, index) => (
        <div className="flex flex-col w-full" key={index}>
          <div
            className={`${
              item.email !== owner_email ? "pl-7 sm:pl-7" : ""
            } flex flex-row  items-center justify-between gap-1 sm:gap-3`}
          >
            <div className="flex flex-row gap-1 justify-center">
              {item.email === owner_email && (
                <span className="text-secondary  tracking-wider font-medium text-[.9rem] md:text-[1rem] ">
                  <StarIcon sx={{ fontSize: "1.5rem" }} />
                </span>
              )}
              <h3 className="tracking-wider text-[.9rem] sm:text-[1rem] ">
                {item.name}
              </h3>
              <p className="sm:block hidden text-secondary  tracking-wider font-medium text-[.9rem] md:text-[1rem] ">
                {item.email}
              </p>
            </div>
            <div className="flex flex-row gap-3 ">
              <div className="sm:hidden block">
                <ViewProfile
                  name={item.name}
                  email={item.email}
                  hidePhoneNumber={hidePhoneNumber}
                  phone_number={item.phone_number}
                  handleCopy={handleCopy}
                  copied={copied}
                />
              </div>

              {item.email === user_email && (
                <ConformModal
                  modalText={"Are you sure you want to exit from this booking"}
                  buttonText={"Exit"}
                  buttonClickFunction={ExitBooking}
                  displayText={"Exit Ride"}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTravellers;
