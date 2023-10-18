import React, { useEffect, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ConformModal from "components/modals/ConformModal";
import StarIcon from '@mui/icons-material/Star';
// List of traverllers in TravellerCard, this is a child of TravellerCard(parent)

const UserTravellers = ({
  travellers,
  hidePhoneNumber = false,
  user_email = "",
  ExitBooking = null,
  owner_email = "",
  DeleteBooking = null,
  clicked_delete = false,
}) => {
  const [copied, setCopied] = useState(false);
  const user_email_local = localStorage.getItem("user_email");
  const handleCopy = () => {
    setCopied(true);
  };

  useEffect(() => {
    copied &&
      toast("Sucessfully copied", {type: "success"}) &&
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
        <div className="flex flex-col gap-3 items-center  w-full" key={index}>
          <div className="flex flex-col sm:flex-row justify-between w-full">
            <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
              <h3 className=" tracking-wider text-[1rem] sm:text-[1.15rem] mr-auto">
                {item.name}
              </h3>
              <p className="text-secondary  tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
                {item.email}
              </p>
              {item.email === owner_email && (
                <span className="text-secondary  tracking-wider font-medium text-[.9rem] md:text-[1.1rem] mr-auto">
                  <StarIcon sx={{fontSize:"1.5rem"}}/>
                </span>
              )}
              {user_email_local === owner_email && item.email === owner_email && DeleteBooking && (
                <div className="hidden sm:block">
                {!clicked_delete ? (
                  <ConformModal
                    modalText={"Are you sure you want to delete this booking"}
                    buttonText={"Yes"}
                    buttonClickFunction={DeleteBooking}
                    displayText={"Delete Ride"}
                  />
                ) : (
                  <span className="loading loading-spinner text-black"></span>
                )}
                </div>
              )}
              {item.email === user_email && (
                <ConformModal
                  modalText={"Are you sure you want to exit from this booking"}
                  buttonText={"Exit"}
                  buttonClickFunction={ExitBooking}
                  displayText={"Exit"}
                />
              )}
            </div>
            {!hidePhoneNumber && (
              <div className="flex flex-row gap-3 items-center">
                <p className="text-[.9rem] sm:text-[1rem]">
                  {item.phone_number}
                </p>
                <CopyToClipboard text={item.phone_number} onCopy={handleCopy}>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={copied}
                    className="bg-white/20 rounded-md p-1 disabled:opacity-[.2]"
                  >
                    <ContentCopyIcon
                      sx={{ fontSize: "1rem", marginBottom: 0.5 }}
                    />
                  </button>
                </CopyToClipboard>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTravellers;
