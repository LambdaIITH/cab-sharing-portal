import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div data-theme="halloween" className="">
        <Component {...pageProps} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
