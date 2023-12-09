import { googleLogout } from "@react-oauth/google";

export default function logout (router) {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_pic_url");
    localStorage.removeItem("credential");

    googleLogout();
    router.push("/");
};