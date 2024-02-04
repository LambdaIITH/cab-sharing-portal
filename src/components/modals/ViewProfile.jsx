import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ViewProfile = ({
  name,
  email,
  hidePhoneNumber,
  phone_number,
  handleCopy,
  copied,
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
        className={`p-2 rounded-md text-[.9rem] bg-secondary/70 text-white/80 hover:bg-secondary/80 capitalize font-[400]  sm:my-3 transition-all hover:-translate-y-1`}
        onClick={() => showModal()}
      >
        View Profile
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
                {name}&apos;s Profile
              </h3>
              <p className="text-[.9rem] sm:text-[1rem]">Email: {email}</p>
              {!hidePhoneNumber && (
                <div className="flex  flex-row gap-3 items-center">
                  <p className="text-[.9rem] sm:text-[1rem]">
                    Phone: {phone_number}
                  </p>
                  <CopyToClipboard text={phone_number} onCopy={handleCopy}>
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
          </form>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => closeModal()}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default ViewProfile;
