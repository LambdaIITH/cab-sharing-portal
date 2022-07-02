import React from "react";
import { Button, Container } from "@mui/material";
import logo from "assets/media/logo.png";
import Image from "next/image";
import { googleLogout } from "@react-oauth/google";

const responseGoogleSuccess = (response) => {
  console.log("Successfully logged out");
};
const responseGoogleFailure = (response) => {
  console.log("log out failed");
  console.log(response);
};

export default function Home() {
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
      <p>Sign out</p>
      <Button color="primary" variant="contained" onClick={googleLogout}>
        Sign out
      </Button>
    </Container>
  );
}
