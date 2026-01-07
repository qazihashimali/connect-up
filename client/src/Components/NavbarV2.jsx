import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArticleIcon from "@mui/icons-material/Article";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import InsightsIcon from "@mui/icons-material/Insights";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NavbarV2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTerm, setDebounceTerm] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [myPages, setMyPages] = useState([]);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [searchPages, setSearchPages] = useState([]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debounceTerm) searchApiCall();
  }, [debounceTerm]);

  const searchApiCall = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/findUser?query=${debounceTerm}`,
        { withCredentials: true }
      );
      setSearchUsers(res.data.users || []);
      setSearchPages(res.data.pages || []);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Search failed");
    }
  };

  const fetchActiveNotifications = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/notification/activeNotifications`,
        { withCredentials: true }
      );
      setCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyPages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/page/user-pages`,
        { withCredentials: true }
      );
      setMyPages(res.data.pages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
    fetchActiveNotifications();
    fetchMyPages();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      navigate("/");
      window.location.reload();
      toast.success("Logout successful!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <div className="bg-white h-13 flex justify-between py-1 px-5 xl:px-50 fixed top-0 w-full z-50 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        <Link to="/feed">
          <img
            src="https://freelogopng.com/images/all_img/1656994981linkedin-icon-png.png"
            alt="logo"
            className="w-8 h-8"
          />
        </Link>

        {/* Search Bar */}
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search"
            className="search-input w-70 bg-gray-100 rounded-sm h-10 px-4"
          />
          {(searchUsers.length > 0 || searchPages.length > 0) &&
            debounceTerm.length !== 0 && (
              <div className="absolute w-88 left-0 bg-gray-200 rounded-md shadow-lg z-50">
                {/* Users */}
                {searchUsers.map((user, index) => (
                  <Link
                    to={`/profile/${user._id}`}
                    key={`user-${index}`}
                    className="flex mb-1 items-center gap-2 cursor-pointer hover:bg-gray-300 px-3 py-2"
                    onClick={() => setSearchTerm("")}
                  >
                    <img
                      src={user.profile_pic}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div>{user.f_name}</div>
                  </Link>
                ))}

                {/* Pages */}
                {searchPages.map((page, index) => (
                  <Link
                    to={`/page/${page._id}`}
                    key={`page-${index}`}
                    className="flex mb-1 items-center gap-2 cursor-pointer hover:bg-gray-300 px-3 py-2"
                    onClick={() => setSearchTerm("")}
                  >
                    <img
                      src={page.logo || "https://via.placeholder.com/40"}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div>{page.name}</div>
                  </Link>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden gap-10 md:flex items-center">
        {/* Nav Links */}
        <Link to="/feed" className="flex flex-col items-center cursor-pointer">
          <HomeIcon
            sx={{ color: location.pathname === "/feed" ? "black" : "gray" }}
          />
          <p
            className={`text-sm text-gray-500 ${
              location.pathname === "/feed" ? "border-b-3" : ""
            }`}
          >
            Home
          </p>
        </Link>

        <Link
          to="/my-network"
          className="flex flex-col items-center cursor-pointer"
        >
          <PeopleAltIcon
            sx={{
              color: location.pathname === "/my-network" ? "black" : "gray",
            }}
          />
          <p
            className={`text-sm text-gray-500 ${
              location.pathname === "/my-network" ? "border-b-3" : ""
            }`}
          >
            Network
          </p>
        </Link>

        <Link to="/jobs" className="flex flex-col items-center cursor-pointer">
          <WorkIcon
            sx={{ color: location.pathname === "/jobs" ? "black" : "gray" }}
          />
          <p
            className={`text-sm text-gray-500 ${
              location.pathname === "/jobs" ? "border-b-3" : ""
            }`}
          >
            Jobs
          </p>
        </Link>

        <Link
          to="/resume"
          className="flex flex-col items-center cursor-pointer"
        >
          <ArticleIcon
            sx={{
              color: location.pathname === "/resume" ? "black" : "gray",
            }}
          />
          <p
            className={`text-sm text-gray-500 ${
              location.pathname === "/resume" ? "border-b-3" : ""
            }`}
          >
            Resume
          </p>
        </Link>

        <Link
          to="/messages"
          className="flex flex-col items-center cursor-pointer"
        >
          <MessageIcon
            sx={{
              color: location.pathname === "/messages" ? "black" : "gray",
            }}
          />
          <p
            className={`text-sm text-gray-500 ${
              location.pathname === "/messages" ? "border-b-3" : ""
            }`}
          >
            Messages
          </p>
        </Link>

        <Link
          to="/notifications"
          className="flex flex-col items-center cursor-pointer relative"
        >
          <div className="relative">
            <NotificationsIcon
              sx={{
                color:
                  location.pathname === "/notifications" ? "black" : "gray",
                fontSize: 28,
              }}
            />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                {count}
              </span>
            )}
          </div>
          <p
            className={`text-sm text-gray-500 ${
              location.pathname === "/notifications"
                ? "border-b-2 border-black"
                : ""
            }`}
          >
            Notifications
          </p>
        </Link>

        {/* Profile Dropdown */}
        <div
          className="relative flex flex-col items-center cursor-pointer"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <img
            src={userData?.profile_pic}
            alt=""
            className="w-8 h-8 rounded-full"
          />
          <p className="text-sm text-gray-500">Me</p>

          {isProfileOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-lg w-64 p-4 z-50">
              <div className="flex items-center gap-3 mb-4 border-b pb-3">
                <img
                  src={userData?.profile_pic}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {userData?.f_name} {userData?.l_name}
                  </p>
                  <p className="text-sm text-gray-500">{userData?.headline}</p>
                </div>
              </div>

              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <Link
                    to={`/profile/${userData?._id}`}
                    className="block hover:bg-gray-100 p-2 rounded-md"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="block hover:bg-gray-100 p-2 rounded-md"
                  >
                    Account Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="block hover:bg-gray-100 p-2 rounded-md"
                  >
                    Privacy & Security
                  </Link>
                </li>

                {/* My Pages */}
                {myPages.length > 0 && (
                  <>
                    {myPages.length === 1 ? (
                      <li>
                        <Link
                          to={`/page/${myPages[0]._id}`}
                          className="block hover:bg-gray-100 p-2 rounded-md"
                        >
                          {myPages[0].name}
                        </Link>
                      </li>
                    ) : (
                      <li className="relative">
                        <button
                          className="w-full text-left block hover:bg-gray-100 p-2 rounded-md flex justify-between items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPagesOpen(!isPagesOpen);
                          }}
                        >
                          My Pages{" "}
                          <span className="ml-2">
                            <ArrowDropDownIcon />
                          </span>
                        </button>
                        {isPagesOpen && (
                          <ul className="absolute left-0 top-full bg-white shadow-lg rounded-md mt-1 w-full z-50">
                            {myPages.map((page) => (
                              <li key={page._id}>
                                <Link
                                  to={`/page/${page._id}`}
                                  className="block hover:bg-gray-100 p-2 rounded-md"
                                >
                                  {page.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )}
                  </>
                )}

                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left text-red-600 hover:bg-gray-100 p-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* For Business Dropdown */}
        <div
          className="relative flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setIsBusinessOpen(true)}
          onMouseLeave={() => setIsBusinessOpen(false)}
        >
          <BusinessCenterIcon sx={{ color: "gray" }} />
          <p className="text-sm text-gray-500">For Business</p>

          {isBusinessOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-lg w-[700px] p-6 grid grid-cols-2 gap-6 z-50">
              {/* My Apps Section */}
              <div>
                <h3 className="font-semibold mb-3">My Apps</h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <GroupsIcon fontSize="small" /> Groups
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <ManageAccountsIcon fontSize="small" /> Manage Billing
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <InsightsIcon fontSize="small" /> Talent Insights
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <ShoppingBagIcon fontSize="small" /> Sales Nav
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <AdUnitsIcon fontSize="small" /> Advertise
                  </div>
                </div>
              </div>

              {/* Explore More for Business */}
              <div>
                <h3 className="font-semibold mb-3">
                  Explore More for Business
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="hover:underline cursor-pointer">
                    Hire on Platform
                  </li>
                  <li className="hover:underline cursor-pointer">
                    Sell with Platform
                  </li>
                  <li className="hover:underline cursor-pointer">
                    Advertise to Grow
                  </li>
                  <li className="hover:underline cursor-pointer">
                    Start a Job Post
                  </li>
                  <li className="hover:underline cursor-pointer">
                    Learn with Courses
                  </li>
                  <li className="hover:underline cursor-pointer">
                    Manage Billing in Admin Center
                  </li>
                  <Link
                    to="/business"
                    className="hover:underline cursor-pointer"
                  >
                    Create a Business Page
                  </Link>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarV2;
