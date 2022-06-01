import React from "react";
import {Button, Container} from "@mui/material"
import logo from "assets/media/logo.png"
import Image from 'next/image'

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
        <Button color="primary" variant="contained">
          <a href="/api/auth/login">Sign in with Google</a>
        </Button>
      </Container>
    );
  }

    export default Login;
