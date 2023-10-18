import React from "react";
import RequestProfileModel from "components/modals/RequestProfileModal";

const UserRequests = ({ requests, AcceptBooking, RejectBooking, loading }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center my-2">
      <p className="border-b-2 font-semibold text-[1.1rem] text-secondary border-secondary ">
        Requests
      </p>
      {requests.map((item, index) => (
        <div className="flex flex-col gap-3 items-center  w-full" key={index}>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row justify-center items-center mr-auto sm:gap-3">
                <h3 className=" tracking-wider text-[1rem] sm:text-[1.15rem] mr-auto">
                  {item.name}
                </h3>
                <p className="hidden sm:block text-[.9rem] sm:text-[1rem] mr-auto">
                  {item.email}
                </p>
              </div>
              <p className="hidden sm:block ">
                <span className="text-[.9rem] sm:text-[1rem] text-secondary">
                  Note:
                </span>{" "}
                {item.comments}
              </p>
            </div>
            <RequestProfileModel
              name={item.name}
              email={item.email}
              AcceptBooking={AcceptBooking}
              loading={loading}
              RejectBooking={RejectBooking}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserRequests;
