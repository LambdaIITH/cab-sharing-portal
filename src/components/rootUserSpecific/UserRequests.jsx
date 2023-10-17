import React from "react";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const UserRequests = ({ requests, AcceptBooking, RejectBooking, loading }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <p className="border-b-2 font-semibold text-[1.1rem] text-secondary border-secondary ">
        Requests
      </p>
      {requests.map((item, index) => (
        <div
          className="flex flex-col gap-3 items-center p-2 w-full"
          key={index}
        >
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
                <h3 className=" tracking-wider text-[1rem] sm:text-[1.15rem] mr-auto">
                  {item.name}
                </h3>
                <p className=" text-[.9rem] sm:text-[1rem] mr-auto">
                  {item.email}
                </p>
              </div>
              <p>
                <span className="text-[.9rem] sm:text-[1rem] text-secondary">
                  Note:
                </span>{" "}
                {item.comments}
              </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              <button
                className="btn btn-success flex-start w-fit"
                onClick={(e) => AcceptBooking(e, item.email)}
                disabled={loading}
              >
                {!loading ? (
                  <DoneIcon />
                ) : (
                  <span className="loading loading-spinner text-white"></span>
                )}
              </button>
              <button
                className="btn btn-error flex-start w-fit"
                onClick={(e) => RejectBooking(e, item.email)}
                disabled={loading}
              >
                {!loading ? (
                  <CloseIcon />
                ) : (
                  <span className="loading loading-spinner text-white"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserRequests;
