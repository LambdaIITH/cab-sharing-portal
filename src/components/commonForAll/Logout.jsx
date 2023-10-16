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
    <div className="navbar bg-transparant w-[90%] mx-auto rounded-xl">
      <button className="btn bg-yellow-400 text-black hover:bg-yellow-400 capitalize font-[400] text-lg my-3 transition-all hover:-translate-y-[.5px] ml-[auto]"
        onClick={handleLogout}
      >
        Logout <Logout className="ml-2" />
      </button>
    </div>
  );
}

export default LogoutButton;
