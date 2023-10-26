import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const OverlappingModal = ({
  numOverlapping,
  findFunction,
  bookFunction,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (numOverlapping > 0) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [numOverlapping]);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
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
              className="btn btn-sm btn-circle btn-ghost absolute right-2"
              onClick={() => closeModal()}
            >
              ✕
            </button>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-secondary/80 border-secondary border-b-2 w-fit">
                Overlapping Rides
              </h3>
              {"There are " + numOverlapping + " rides matching your info. Would you like to check them out?"}
              <button
                className="btn  ml-auto bg-secondary/70 text-white/80 hover:bg-secondary/80 "
                onClick={() => {
                  findFunction();
                  closeModal();
                }}
              >
                {"Yes, Find Rides"}
              </button>
              <button
                className="btn  ml-auto bg-secondary/70 text-white/80 hover:bg-secondary/80 "
                onClick={() => {
                  bookFunction();
                  closeModal();
                }}
              >
                {"No, Continue booking"}
              </button>
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

export default OverlappingModal;