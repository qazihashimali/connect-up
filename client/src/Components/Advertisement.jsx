import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Advertisement = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
  }, []);
  return (
    <div className="sticky top-18">
      <Card padding={0}>
        <div className="relative h-25">
          <div className="relative w-full h-22 rounded-md">
            <img
              src={userData?.cover_pic}
              alt=""
              className="rounded-t-md h-full w-full"
            />
          </div>
          <div className="absolute top-14 left-[40%] z-10">
            <img
              src={userData?.profile_pic}
              alt=""
              className="rounded-4xl h-14 w-14 border-2 border-white cursor-pointer"
            />
          </div>
        </div>
        <div className="px-5 my-5 mx-auto text-center">
          <h1 className="text-2xl font-bold">{userData?.f_name}</h1>
          <p className="text-gray-600 my-3 text-sm">
            Get the latest jobs & industry news
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer transition text-white px-5 py-2 rounded-full"
          >
            Explore Now
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Advertisement;
