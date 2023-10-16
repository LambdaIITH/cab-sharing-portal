import React from "react";
import { MenuBookOutlined } from "@mui/icons-material";

const UserGuide = () => {
  return (
    <button
      className="btn bg-yellow-400 h-1 min-h-8 p-1 text-black mx-5 mb-5 hover:bg-yellow-400 capitalize font-[400]  text-sm my-3 transition-all hover:-translate-y-[.5px] ml-[auto]"
      //   onClick={handleLogout}
    >
      User Guide <MenuBookOutlined className="text-[1rem]" />
    </button>
  );
};

export default UserGuide;
