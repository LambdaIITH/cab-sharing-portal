import React from "react";
import { useRouter } from "next/router";
import BugReportIcon from '@mui/icons-material/BugReport';

function ReportBugButton() {
  const router = useRouter();

  const handleReport = () => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScEKZIbE45xn8TzD_OzehhNnS0BDXdSfvJBm1FAG_l0KywSEw/viewform";
  };

  return (
    <button
      className="btn bg-transparent h-1 min-h-8 p-1 border-none text-black mx-5 mb-5 hover:bg-secondary/80 hover:text-white/80 capitalize font-[400]  text-sm my-3 transition-all hover:-translate-y-[.5px] ml-[auto]"
      onClick={handleReport}
    >
      Report Bug <BugReportIcon className="text-[.9rem] text-black/50" />
    </button>
  );
}

export default ReportBugButton;