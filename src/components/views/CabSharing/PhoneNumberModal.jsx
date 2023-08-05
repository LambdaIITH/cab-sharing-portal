import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const PhoneNumberModal = ({
  handlePhoneChange,
  phone,
  phoneIsValid,
  handlePhoneEdit,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const showModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setUsername(localStorage.getItem("user_name"));
    setEmail(localStorage.getItem("user_email"));
  }, []);

  return (
    <>
      <button
        className=" btn btn-primary capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-1"
        onClick={() => showModal()}
      >
        Get Started
      </button>
      {isModalOpen && (
        <dialog
          id="my_modal_3"
          className="modal modal-open"
          onClick={(e) => e.stopPropagation()}
        >
          <form method="dialog" className="modal-box bg-secondary text-white">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => closeModal()}
            >
              ✕
            </button>
            <div className="flex flex-col gap-5">
              <h3 className="font-bold text-lg text-primary">Profile Setup</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <span className="font-bold">Name:</span> {username}
                </li>
                <li>
                  <span className="font-bold">Email:</span> {email}
                </li>
              </ul>
              <div className="flex flex-col gap-2">
                <p className="font-bold">Enter your phone number</p>
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
                className="btn btn-primary ml-auto text-black "
                disabled={!phoneIsValid}
                onClick={() => {
                  handlePhoneEdit();
                  router.reload();
                  closeModal();
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
