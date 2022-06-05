import React from "react";
import {Button, Container} from "@mui/material"
import logo from "assets/media/logo.png"
import Image from 'next/image'
import { GoogleLogin } from '@react-oauth/google';

const responseGoogleSuccess = response => {
  console.log('Successful Log in');
  //response has profile object and stuff
  console.log(response);
  localStorage.setItem('profile', JSON.stringify(response));
};
const responseGoogleFailure = (response, details) => {
  console.log('Log in UnSuccessful');
  console.log(response);
};

function Login() {
    return (
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Image src={logo.src} alt="IITH-Commisions Logo" className="logo-img" width={96} height={96}/>
        <p>Sign in to continue to IITH Commisions Portal.</p>
        
        <GoogleLogin
          onSuccess={responseGoogleSuccess}
          shape="pill"

        />
      </Container>
    );
  }

    export default Login;
