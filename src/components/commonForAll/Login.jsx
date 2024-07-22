import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import toastError from "components/utils/toastError";
import logout from "components/utils/logout";
import getSessionInfo from "../utils/sessionInfo";

function ProcessUser(token) {
  const decoded_token = jwt_decode(token);
  localStorage.setItem("user_name", decoded_token["name"]);
  localStorage.setItem("user_email", decoded_token["email"]);
  localStorage.setItem("user_pic_url", decoded_token["picture"]);
}

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const responseGoogleSuccess = async (response) => {
    setLoading(true);
    console.log("Successful Log in");

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_BASE}/auth/login`,
        { id_token: response.credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      ProcessUser(response.credential);
      console.log(data.headers);
      router.replace("/cab-sharing");
    } catch (err) {
      await logout(router);
      console.log(err);
      toastError(err.response?.data?.detail || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const responseGoogleFailure = (response, details) => {
    toast("Error logging in", { type: "error" });
    console.log("Log in Unsuccessful");
  };

  const checkSession = async () => {
    const info = await getSessionInfo(router);
    if (info) {
      router.replace('/cab-sharing')
    } else {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (pageLoading) {
    return (
      <div className="w-screen flex flex-col justify-center bg-purple-50 items-center h-screen gap-5">
        <span className="loading loading-spinner text-black"></span>
      </div>
    );
  }

  return (
    <div className="w-screen flex flex-col justify-center bg-purple-50 items-center h-screen gap-5">
      <img
        src={"/assets/iith_cabshare_logo_no_bg.png"}
        className="w-[15rem] h-[15rem]"
        alt="IITH Cabsharing Logo"
      />
      <p className="text-[.9rem] md:text-[1.3rem] text-black">
        Welcome to IITH Cabsharing Portal
      </p>
      <GoogleLogin
        useOneTap
        onSuccess={responseGoogleSuccess}
        onError={responseGoogleFailure}
        shape="pill"
      />
      {loading && (
        <span className="loading loading-spinner text-black"></span>
      )}
    </div>
  );
}

export default Login;
