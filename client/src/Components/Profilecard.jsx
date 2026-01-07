import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Profilecard = ({ data, showConnectButton }) => {
  const [buttonText, setButtonText] = useState("Connect");
  const [ownData, setOwnData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/self`,
          { withCredentials: true }
        );
        setOwnData(ownRes.data.user);

        // Check if already sent a request or already friends
        const alreadyFriend = data?.friends?.includes(ownRes.data.user._id);
        const alreadyPending = data?.pending_friends?.includes(
          ownRes.data.user._id
        );

        if (alreadyFriend) setButtonText("Connected");
        else if (alreadyPending) setButtonText("Request Sent");
        else setButtonText("Connect");
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.error || "Something went wrong");
      }
    };

    if (data?._id) fetchData();
  }, [data?._id]);

  // ✅ Handle sending friend request
  const handleConnect = async () => {
    if (buttonText !== "Connect") return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/sendFriendRequest`,
        { receiver: data?._id },
        { withCredentials: true }
      );

      toast.success(`Connection request sent to ${data?.f_name}`);
      setButtonText("Request Sent");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed to send request");
    }
  };

  return (
    <Card padding={0}>
      <div className="relative h-25">
        <div className="relative w-full h-22 rounded-md overflow-hidden">
          <img
            src={data?.cover_pic}
            alt="cover_Pic"
            className="rounded-t-md h-full w-full object-cover"
          />
        </div>
        <Link
          to={`/profile/${data?._id}`}
          className="absolute top-14 left-6 z-10"
        >
          <img
            src={data?.profile_pic}
            alt="profile_Pic"
            className="rounded-4xl h-16 w-16 border-2 border-white cursor-pointer object-cover"
          />
        </Link>
      </div>

      <div className="p-5 space-y-1 mt-1 flex flex-col items-start h-full justify-between">
        <div>
          <h1 className="text-2xl font-bold truncate max-w-[220px]">
            {data?.f_name}
          </h1>
          <p className="text-gray-600 break-words line-clamp-1">
            {data?.headline}
          </p>
          <p className="text-gray-600 truncate max-w-[220px]">
            {data?.curr_company}
          </p>
          {!showConnectButton && (
            <p className="text-gray-600 truncate max-w-[220px]">
              {data?.curr_location}
            </p>
          )}
        </div>

        {showConnectButton && (
          <button
            onClick={handleConnect}
            disabled={buttonText !== "Connect"}
            className={`mt-4 w-full text-white font-medium py-1 rounded-full cursor-pointer transition-all ${
              buttonText === "Connected"
                ? "bg-green-600 cursor-not-allowed"
                : buttonText === "Request Sent"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </Card>
  );
};

export default Profilecard;
