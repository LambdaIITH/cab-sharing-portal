import { TurnLeft } from "@mui/icons-material";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";

export default async function logout(router) {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_pic_url");
    localStorage.removeItem("credential");

    googleLogout();
    await serverLogout();

    router.replace("/");
};

async function serverLogout() {
    const apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL_BASE}/auth/logout`;
    try {
        axios.get(apiURL, { withCredentials: true })
    } catch (error) {
        console.log(error)
    }
}