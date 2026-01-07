import React from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    toast.success("Logout successful!");
    window.location.href = "/";
  };

  return (
    <header className="bg-white  h-16 flex items-center justify-between px-6  border-b border-gray-300">
      <h1 className="text-xl font-bold text-gray-700">
        Connect-Up Admin Panel
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-[#662d91] text-white px-4 py-2 rounded-full  transition duration-300 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
