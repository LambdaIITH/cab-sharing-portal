import { TurnLeft } from "@mui/icons-material";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";

export default async function logout(router) {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_pic_url");
    localStorage.removeItem("credential");

    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });

    googleLogout();
    await serverLogout();

    router.replace("/");
};

async function serverLogout() {
    const apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL_BASE}/auth/logout`;
    try {
        await axios.get(apiURL, { withCredentials: true });
    } catch (error) {
        console.log(error);
    }
}
