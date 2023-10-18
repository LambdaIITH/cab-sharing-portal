import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AddBox } from "@mui/icons-material";

const PhoneNumberModal = ({
  handlePhoneChange,
  phone,
  phoneIsValid,
  handlePhoneEdit,
  edit = false,
  loaded_phone,
  setPhone,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const showModal = () => {
    setPhone(loaded_phone);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <div>
          {edit
            ? `Phone: ${loaded_phone.slice(0, 3)} ${loaded_phone.slice(3)}`
            : ""}
        </div>
        <button
          className=" capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] shadow-md rounded-xl p-1"
          onClick={() => showModal()}
        >
          {edit ? <EditOutlinedIcon /> : "Click to Add Phone Number"}
        </button>
      </div>
      {isModalOpen && (
        <dialog
          id="my_modal_3"
          className="modal modal-open"
          onClick={(e) => e.stopPropagation()}
        >
          <form method="dialog" className="modal-box bg-white text-black">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => closeModal()}
            >
              ✕
            </button>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <p className="font-bold">
                  {edit ? "Edit" : "Enter"} your phone number
                </p>
                <MuiTelInput
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                  }}
                  defaultCountry="IN"
                  onlyCountries={["IN"]}
                  forceCallingCode
                  onChange={handlePhoneChange}
                  value={phone}
                />
              </div>
              <button
                className="w-fit flex ml-auto btn bg-secondary/70 text-white/80 hover:bg-secondary/80 disabled:bg-gray-200 disabled:text-gray-300"
                disabled={!phoneIsValid}
                onClick={() => {
                  handlePhoneEdit().then(() => {
                    router.reload();
                    closeModal();
                  });
                }}
              >
                Save
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

export default PhoneNumberModal;
