import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const RequestProfileModel = ({
  name,
  email,
  AcceptBooking,
  loading,
  RejectBooking,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const showModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      <button
        className={`px-1 rounded-md text-[.9rem] sm:btn bg-secondary/70 text-white/80 hover:bg-secondary/80 capitalize font-[400]  sm:my-3 transition-all hover:-translate-y-1`}
        onClick={() => showModal()}
      >
        Request Status
      </button>
      {isModalOpen && (
        <dialog
          id="my_modal_3"
          className="modal modal-open"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            method="dialog"
            className="modal-box bg-white text-black border-black border-2"
          >
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => closeModal()}
            >
              ✕
            </button>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[1rem] sm:text-lg text-secondary/80 border-secondary border-b-2 w-fit">
                Someone requested to join your cab
              </h3>
              <p className="text-[.9rem] sm:text-[1rem]">Name: {name}</p>
              <p className="text-[.9rem] sm:text-[1rem]">Email: {email}</p>
              <div className="flex flex-row gap-3 items-end justify-end">
                <button
                  className="btn btn-success flex-start w-fit"
                  onClick={(e) => AcceptBooking(e, email)}
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
                  onClick={(e) => RejectBooking(e, email)}
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
          </form>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => closeModal()}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default RequestProfileModel;
