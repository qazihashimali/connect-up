import React, { useEffect, useState } from "react";
import Advertisement from "../Components/Advertisement";
import Profilecard from "../Components/Profilecard";
import { useParams } from "react-router-dom";
import Card from "../Components/Card";
import Posts from "../Components/Posts";
import axios from "axios";

const Activites = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [ownData, setOwnData] = useState(null);

  const fetchPostData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/getAllPostsOfUser/${id}`
      );
      setPosts(res.data.posts);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostData();
    const storedUser = localStorage.getItem("userInfo");
    setOwnData(storedUser ? JSON.parse(storedUser) : null);
  }, [id]);

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
        <div className="h-fit sticky top-19">
          <Profilecard data={posts[0]?.user} />
        </div>
      </div>
      {/* Middle side */}
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Card padding={1}>
            <h1 className="text-2xl font-bold">All Activites</h1>
            <button className="px-3 py-1 cursor-pointer w-fit border-1 bg-green-800 text-white rounded-full font-semibold">
              Posts
            </button>
            <div className="my-2 flex flex-col gap-2">
              {posts.map((post, index) => (
                <div key={index}>
                  <Posts item={post} personalData={ownData} />
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

export default Activites;
