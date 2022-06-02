import React from "react";
import {Button, Container} from "@mui/material"
import logo from "assets/media/logo.png"
import Image from 'next/image'
import { GoogleLogin } from 'react-google-login';

const responseGoogleSuccess = response => {
  console.log('Successful Log in');
  //response has profile object and stuff
  localStorage.setItem('profile', JSON.stringify(response));
};
const responseGoogleFailure = response => {
  console.log('Log in UnSuccessful');
  console.log(response)
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
          clientId="928477434469-qapbv1dd1dt7dbmfka4rpvc3m6a2ref1.apps.googleusercontent.com"
          render={renderProps => (
            <Button color="primary" variant="contained" onClick={renderProps.onClick}>
              Sign in with Google
            </Button>
          )}
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          isSignedIn={false}
          uxMode='redirect'
          redirectUri="http://localhost:3000/home"
        />
      </Container>
    );
  }

    export default Login;
