import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const NavBar = () => {
  const links = {
    HOME: "/",
    ABOUT: "/about",
  };
  const router = useRouter();

  return (
    <div>
      <div className="navbar bg-transparant w-[90%] mx-auto mt-5 rounded-xl">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {Object.keys(links).map((linkKey, index) => (
                <li
                  key={index}
                  className={`${
                    `${links[linkKey].toLowerCase()}` === router.pathname
                      ? " font-[600] text-black/70 bg-black/10 rounded-md"
                      : ""
                  } cursor-pointer hover:-translate-y-1 transition-all`}
                >
                  <Link href={links[linkKey]}>{linkKey}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <Link
            href="/"
            className="btn btn-ghost normal-case text-[1.2rem] md:text-[1.5rem] main__font tracking-wider font-bold"
          >
            Cab Sharing
          </Link> */}
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="flex flex-row w-ful justify-center gap-5 xl:gap-10 secondary_font text-[1.2rem] my-[1rem] tracking-wider  w-fit  p-3 mx-auto px-5">
            {Object.keys(links).map((linkKey, index) => (
              <li
                key={index}
                className={`${
                  `${links[linkKey].toLowerCase()}` === router.pathname
                    ? "border-b-black/80 border-b-4 font-[600] text-black/70 -translate-y-[2px]"
                    : ""
                } cursor-pointer hover:-translate-y-1 transition-all`}
              >
                <Link href={links[linkKey]}>{linkKey}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          {/* {signedin ? <UserPanel setsignedin={setsignedin} /> : <GetStarted />} */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
