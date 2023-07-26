import React, { useEffect, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const UserTravellers = ({ travellers }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
  };

  useEffect(() => {
    copied &&
      toast("Sucessfully copied") &&
      setTimeout(() => {
        setCopied(false);
      }, 2000);
  }, [copied]);
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <p className="bg-primary text-black p-2 rounded-lg">Travellers</p>
      {travellers.map((item, index) => (
        <div
          className="flex flex-col gap-3 items-center p-2 w-full"
          key={index}
        >
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row justify-center items-center mr-auto gap-3">
              <h3 className=" tracking-widest text-[1.15rem]">{item.name}</h3>
              <p className="text-primary text-[1rem]">{item.email}</p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              <p className="text-primary text-[1rem]">
                +91 {item.phone_number}
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
              <ToastContainer />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTravellers;
