import axios from "axios";
import logout from "./logout";

const getSessionInfo = async (router) => {
    const apiURL = `${process.env.NEXT_PUBLIC_BACKEND_URL_BASE}/session-exists`;
    try {
        const response = await axios.get(apiURL, { withCredentials: true });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        await logout(router)
        return false;
    }
};

export default getSessionInfo;
