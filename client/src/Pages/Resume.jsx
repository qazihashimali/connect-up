import React, { useEffect, useState } from "react";
import Advertisement from "../Components/Advertisement";

const Resume = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
  }, []);
  if (!userData && userData?.resume)
    return <div className="text-center">Resume does not exists ...</div>;
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      <div className="w-[100%] py-5 sm:w-[74%]">
        <img
          src={userData?.resume}
          alt=""
          className="w-full h-full rounded-2xl"
        />
      </div>
      <div className="w-[26%] py-5 hidden sm:block">
        <Advertisement />
      </div>
    </div>
  );
};

export default Resume;
