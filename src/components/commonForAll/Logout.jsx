import React from "react";
import { useRouter } from "next/router";
import { Logout } from "@mui/icons-material";

function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_pic_url");
    localStorage.removeItem("credential");

    router.push("/");
  };

  return (
    <button
      className="btn bg-transparent h-1 min-h-8 p-1 border-yellow-400 text-black mx-5 mb-5 hover:bg-yellow-400 capitalize font-[400]  text-sm my-3 transition-all hover:-translate-y-[.5px] ml-[auto]"
      onClick={handleLogout}
    >
      Logout <Logout className="text-[1rem]" />
    </button>
  );
}

export default LogoutButton;
