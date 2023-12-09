import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div data-theme="halloween" className="">
        <Component {...pageProps} />
        <ToastContainer limit={3} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
