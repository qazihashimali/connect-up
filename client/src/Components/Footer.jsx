import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-200 flex justify-center">
      <div className="md:p-6 w-full max-w-6xl flex flex-col items-center py-4 gap-4">
        {/* Logo Section */}
        <div className="flex gap-1 items-center cursor-pointer">
          <h3 className="text-blue-800 font-bold text-3xl">Linked</h3>
          <img
            src="https://freelogopng.com/images/all_img/1656994981linkedin-icon-png.png"
            alt="logo"
            className="w-7 h-7"
          />
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <Link to="#" className="hover:underline">
            About
          </Link>
          <Link to="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link to="#" className="hover:underline">
            Help Center
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} LinkedIn. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
