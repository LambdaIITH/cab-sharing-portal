import React from "react";
import { Button, Container } from "@mui/material";
import logo from "assets/media/logo.png";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

function ProcessUser(token) {
  const decoded_token = jwt_decode(token);
  localStorage.setItem('user_name',decoded_token['name']);
  localStorage.setItem('user_email',decoded_token['email']);
  localStorage.setItem('user_pic_url',decoded_token['picture']);
}

function Login() {
  const router = useRouter();
  const responseGoogleSuccess = (response) => {
    console.log("Successful Log in");
    //response has profile object and stuff

    console.log(response);
    localStorage.setItem("credential", response.credential);

    fetch("http://localhost:8000/auth", {
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
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Image
        src={logo.src}
        alt="IITH-Commisions Logo"
        className="logo-img"
        width={96}
        height={96}
      />
      <p>Sign in to continue to IITH Commisions Portal.</p>

      <GoogleLogin
        useOneTap
        onSuccess={responseGoogleSuccess}
        onError={responseGoogleFailure}
        shape="pill"
      />
    </Container>
  );
}

export default Login;
