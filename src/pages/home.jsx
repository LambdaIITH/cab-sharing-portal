import React from "react";
import {Button, Container} from "@mui/material"
import logo from "assets/media/logo.png"
import Image from 'next/image'
import { GoogleLogout } from 'react-google-login';

const responseGoogleSuccess = response => {
    console.log('Successfully logged out');
  };
const responseGoogleFailure = response => {
    console.log('log out failed');
  };

export default function Home() {
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
        <p>Sign out</p>
        
        <GoogleLogout
          clientId="928477434469-qapbv1dd1dt7dbmfka4rpvc3m6a2ref1.apps.googleusercontent.com"
          render={renderProps => (
            <Button color="primary" variant="contained" onClick={renderProps.onClick}>
              Sign out
            </Button>
          )}
          onLogoutSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
        />
      </Container>
    );
  }