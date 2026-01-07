import React, { useEffect, useState } from "react";
import Profilecard from "../Components/Profilecard";
import Advertisement from "../Components/Advertisement";
import Card from "../Components/Card";
import axios from "axios";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/getNotifications`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setNotifications(res.data.notifications);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickNotification = async (notification) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/isRead`,
        { notificationId: notification._id },
        {
          withCredentials: true,
        }
      );
      if (notification.type === "comment") {
        navigate(`/profile/${userData?._id}/activities/${notification.postId}`);
      } else {
        navigate("/my-network");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);

    fetchNotifications();
  }, []);
  if (loading) {
    return <Loading fullscreen={true} />;
  }
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full  mt-5 bg-gray-100">
      {/* Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
        <div className="h-fit sticky top-19">
          <Profilecard data={userData} />
        </div>
      </div>
      {/* Middle side */}
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Card padding={0}>
            <div className="w-full">
              {/* For Each Notification */}
              {notifications.map((notification, index) => (
                <div
                  className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3 ${
                    notification?.isRead
                      ? "bg-gray-200"
                      : "bg-blue-100 border-gray-600"
                  }`}
                  key={index}
                  onClick={() => {
                    handleOnClickNotification(notification);
                  }}
                >
                  <img
                    src={notification?.sender?.profile_pic}
                    className="w-15 h-15 rounded-full cursor-pointer"
                    alt=""
                  />
                  <p className="text-gray-600 text-lg">
                    {notification.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {/* Right side */}
      <div className="w-[26%] py-5 hidden md:block">
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Notification;
