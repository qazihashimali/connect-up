import React from "react";
import { Link } from "react-router-dom";

const NavbarV1 = () => {
  return (
    <nav className="w-[100%] bg-gray-100 md:px-[100px] px-[20px] flex justify-between py-4 box-border">
      <Link to="/" className="flex justify-between">
        <div className="flex gap-1 items-center cursor-pointer">
          <h3 className="text-blue-800 font-bold text-3xl">Linked</h3>
          <img
            src={
              "https://freelogopng.com/images/all_img/1656994981linkedin-icon-png.png"
            }
            alt="logo"
            className="w-7 h-7"
          />
        </div>
      </Link>
      {/* Buttons */}
      <div className="flex box-border md:gap-4 gap-2 justify-center items-center">
        <Link to="/sign-up" className="bg-blue-800 text-white px-4 py-2 rounded-full  transition duration-300 cursor-pointer">
          Join Now
        </Link>
        <Link to="/login" className="bg-transparent text-blue-800 px-4 py-2 rounded-full border border-blue-800 transition duration-300 cursor-pointer">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default NavbarV1;
