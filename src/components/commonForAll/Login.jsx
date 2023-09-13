import React from "react";
import { Button, Container } from "@mui/material";
import logo from "assets/media/logo.png";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

function ProcessUser(token) {
  const decoded_token = jwt_decode(token);
  localStorage.setItem("user_name", decoded_token["name"]);
  localStorage.setItem("user_email", decoded_token["email"]);
  localStorage.setItem("user_pic_url", decoded_token["picture"]);
}

function Login() {
  const router = useRouter();
  const responseGoogleSuccess = (response) => {
    console.log("Successful Log in");
    //response has profile object and stuff

    console.log(response);
    localStorage.setItem("credential", response.credential);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
      headers: {
        Authorization: response.credential,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        ProcessUser(response.credential);
        router.push("/cab-sharing");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const responseGoogleFailure = (response, details) => {
    console.log("Log in UnSuccessful");
    console.log(response);
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center h-screen gap-5">
      <img
        src={
          "https://res.cloudinary.com/dcpgsijmr/image/upload/v1691685335/cab-sharing/IITHCS-logo_tnpnur.png"
        }
        className="w-[15rem] h-[15rem]"
      />
      <p className="text-[.9rem] md:text-[1.3rem]">
        Welcome to IITH Cabsharing Portal
      </p>
      <GoogleLogin
        useOneTap
        onSuccess={responseGoogleSuccess}
        onError={responseGoogleFailure}
        shape="pill"
      />
    </div>
  );
}

export default Login;
