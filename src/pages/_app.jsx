import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId="151062523573-qi5ict3dofr2b4iosif3t5l4v2n8j2t7.apps.googleusercontent.com">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
