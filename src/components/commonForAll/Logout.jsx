import React from "react";
import { useRouter } from "next/router";

function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_pic_url");
    localStorage.removeItem("credential");

    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="">
      Logout
    </button>
  );
}

export default LogoutButton;
