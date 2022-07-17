import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { googleLogout } from "@react-oauth/google";

const retrieveAuthToken = (router) => {
  //const router = useRouter();
  const token = localStorage.getItem("credential");
  if (!token) {
    googleLogout();
    router.push("/");
    return null;
  }
  const decode_token = jwt_decode(token);
  console.log(decode_token);
  const date = new Date();
  console.log(date.getTime(), decode_token["exp"]);
  if (decode_token["exp"] < date.getTime() / 1000) {
    // token has expired
    localStorage.removeItem("credential");
    googleLogout();
    router.push("/");
    return null;
  }

  return token;
};
export default retrieveAuthToken;
