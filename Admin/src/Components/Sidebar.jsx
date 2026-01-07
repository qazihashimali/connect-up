// src/Components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BriefcaseBusiness,
  Plus,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check if the route is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white text-[#662d91] h-screen flex-shrink-0 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-r border-gray-300">
        <img src="/connectup.png" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 text-lg font-semibold p-2 rounded-lg transition-all ${
            isActive("/dashboard")
              ? "bg-[#662d91] text-white shadow-md"
              : "hover:bg-[#662d91] hover:text-white"
          }`}
        >
          <LayoutDashboard size={22} />
          Dashboard
        </Link>

        <Link
          to="/add-job"
          className={`flex items-center gap-3 text-lg font-semibold p-2 rounded-lg transition-all ${
            isActive("/add-job")
              ? "bg-[#662d91] text-white shadow-md"
              : "hover:bg-[#662d91] hover:text-white"
          }`}
        >
          <Plus size={22} />
          Add Job
        </Link>
        <Link
          to="/add-notice"
          className={`flex items-center gap-3 text-lg font-semibold p-2 rounded-lg transition-all ${
            isActive("/add-job")
              ? "bg-[#662d91] text-white shadow-md"
              : "hover:bg-[#662d91] hover:text-white"
          }`}
        >
          <Plus size={22} />
          Add Notice
        </Link>

        <Link
          to="/manage-jobs"
          className={`flex items-center gap-3 text-lg font-semibold p-2 rounded-lg transition-all ${
            isActive("/manage-jobs")
              ? "bg-[#662d91] text-white shadow-md"
              : "hover:bg-[#662d91] hover:text-white"
          }`}
        >
          <BriefcaseBusiness size={22} />
          Manage Jobs
        </Link>

        <Link
          to="/applications"
          className={`flex items-center gap-3 text-lg font-semibold p-2 rounded-lg transition-all ${
            isActive("/applications")
              ? "bg-[#662d91] text-white shadow-md"
              : "hover:bg-[#662d91] hover:text-white"
          }`}
        >
          <FileText size={22} />
          View Applications
        </Link>

        <Link
          to="/users"
          className={`flex items-center gap-3 text-lg font-semibold p-2 rounded-lg transition-all ${
            isActive("/users")
              ? "bg-[#662d91] text-white shadow-md"
              : "hover:bg-[#662d91] hover:text-white"
          }`}
        >
          <Users size={22} />
          Users
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
