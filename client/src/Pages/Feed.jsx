import React, { useEffect, useState } from "react";
import Profilecard from "../Components/Profilecard";
import Card from "../Components/Card";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import Advertisement from "../Components/Advertisement";
import Posts from "../Components/Posts";
import Modal from "../Components/Modal";
import AddModal from "../Components/AddModal";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

const Feed = () => {
  const [addPostModal, setAddPostModal] = useState(false);
  const [personalData, setPersonalData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePostModal = () => {
    setAddPostModal((prev) => !prev);
  };

  // const fetchSelfData = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/auth/self`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error?.response?.data?.error || "Something went wrong");
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userData, postData] = await Promise.all([
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/self`, {
          withCredentials: true,
        }),
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/get-all-posts`
        ),
      ]);
      setPersonalData(userData.data.user);
      localStorage.setItem("userInfo", JSON.stringify(userData.data.user));
      setPosts(postData.data.posts);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading fullscreen />;
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
        <div className="h-fit sticky top-19">
          <Profilecard data={personalData} />

          {/* Impression Card  */}
          <div className="w-full my-5">
            <Card padding={1}>
              <div className="w-full flex justify-between">
                <h2 className="font-semibold">Profile Viewers</h2>
                <p className="text-gray-600 font-medium">23</p>
              </div>

              <div className="w-full flex justify-between">
                <h2 className="font-semibold">Post Impressions</h2>
                <p className="text-gray-600 font-medium">90</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Middle side */}
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Card padding={1}>
            <div className="flex gap-2 items-center">
              <img
                src={personalData?.profile_pic}
                alt=""
                className="rounded-full h-12 w-12 border-2 border-white cursor-pointer"
              />
              <div
                onClick={() => setAddPostModal(true)}
                className="w-full border-1 text-gray-600 border-gray-300 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100"
              >
                Start a post
              </div>
            </div>

            <div className="w-full flex mt-3">
              <div
                onClick={() => setAddPostModal(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"
              >
                <VideoCallIcon sx={{ color: "green" }} /> Video
              </div>
              <div
                onClick={() => setAddPostModal(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"
              >
                <InsertPhotoIcon sx={{ color: "blue" }} /> Photo
              </div>
              <div
                onClick={() => setAddPostModal(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"
              >
                <ArticleIcon sx={{ color: "orange" }} /> Article
              </div>
            </div>
          </Card>
        </div>

        <div className="border-b-1 border-gray-400 my-5" />

        {/* Posts */}

        <div className="w-full flex flex-col gap-5">
          {posts.map((item) => {
            return (
              <Posts item={item} key={item._id} personalData={personalData} />
            );
          })}
        </div>
      </div>
      {/* Right side */}
      <div className="w-[26%] py-5 hidden md:block">
        <div>
          <Card padding={1}>
            <h1 className="text-xl font-semibold">Linkedin News</h1>
            <p className="text-gray-600">Top Stories</p>
            <div className="my-1">
              <h1 className="text-md">Flood in Pakistan</h1>
              <p className="text-gray-600 text-xs">1 day ago</p>
            </div>
            <div className="my-1">
              <h1 className="text-md">Gaza under attack</h1>
              <p className="text-gray-600 text-xs">1 day ago</p>
            </div>
          </Card>
        </div>
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
      {addPostModal && (
        <Modal closeModal={handlePostModal} title={""}>
          <AddModal personalData={personalData} />
        </Modal>
      )}
      {/* <Loader /> */}
    </div>
  );
};

export default Feed;
