// import React, { useEffect, useState } from "react";
// import Profilecard from "../Components/Profilecard";
// import Posts from "../Components/Posts";
// import Advertisement from "../Components/Advertisement";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const SingleActivity = () => {
//   const [userData, setUserData] = useState(null);

//   const { postId } = useParams();
//   const [posts, setPosts] = useState(null);

//   const fetchSingleActivity = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/post/getPostById/${postId}`
//       );
//       setPosts(res.data.post);
//       console.log(res);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchSingleActivity();
//     const storedUser = localStorage.getItem("userInfo");
//     setUserData(storedUser ? JSON.parse(storedUser) : null);
//   }, []);
//   return (
//     <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
//       {/* Left side */}
//       <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
//         <div className="h-fit sticky top-19">
//           <Profilecard data={posts?.user} />
//         </div>
//       </div>
//       {/* Middle side */}
//       <div className="w-[100%] py-5 sm:w-[50%]">
//         <div>
//           <Posts item={posts} personalData={userData} />
//         </div>
//       </div>
//       {/* Right side */}
//       <div className="w-[26%] py-5 hidden md:block">
//         <div className="my-5 sticky top-19">
//           <Advertisement />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleActivity;

import React, { useEffect, useState } from "react";
import Profilecard from "../Components/Profilecard";
import Posts from "../Components/Posts";
import Advertisement from "../Components/Advertisement";
import Card from "../Components/Card";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SingleActivity = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [isPagePost, setIsPagePost] = useState(false);

  const { postId } = useParams();

  const fetchSingleActivity = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/getPostById/${postId}`
      );
      const post = res.data.post;
      setPosts(post);

      // Check if it's a page post or user post
      if (post.authorType === "Page" && post.authorId) {
        setIsPagePost(true);
        // Fetch page data
        const pageRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/page/${post.authorId}`
        );
        setAuthorData(pageRes.data.page);
      } else if (post.user) {
        setIsPagePost(false);
        setAuthorData(post.user);
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingleActivity();
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
  }, [postId]);

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
        <div className="h-fit sticky top-19">
          {isPagePost ? (
            // Page Card (matching Profilecard design)
            <Card padding={0}>
              <div className="relative h-25">
                <div className="relative w-full h-22 rounded-md overflow-hidden">
                  <img
                    src={authorData?.cover_image}
                    alt="cover_pic"
                    className="rounded-t-md h-full w-full object-cover"
                  />
                </div>
                <Link
                  to={`/page/${authorData?._id}`}
                  className="absolute top-14 left-6 z-10"
                >
                  <img
                    src={authorData?.logo}
                    alt="page_logo"
                    className="rounded-4xl h-16 w-16 border-2 border-white cursor-pointer object-cover"
                  />
                </Link>
              </div>

              <div className="p-5 space-y-1 mt-1 flex flex-col items-start h-full justify-between">
                <div className="w-full">
                  <h1 className="text-2xl font-bold truncate max-w-[220px]">
                    {authorData?.name}
                  </h1>
                  <p className="text-gray-600 break-words line-clamp-2">
                    {authorData?.tagline}
                  </p>
                  <p className="text-gray-600 truncate max-w-[220px]">
                    {authorData?.industry}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold mt-2">
                    • Company Page
                  </p>
                </div>

                <Link to={`/page/${authorData?._id}`} className="w-full mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 rounded-full cursor-pointer transition-all active:scale-95">
                    View Page
                  </button>
                </Link>
              </div>
            </Card>
          ) : (
            // User Profile Card
            <Profilecard data={authorData} />
          )}
        </div>
      </div>

      {/* Middle side */}
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Posts item={posts} personalData={userData} />
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

export default SingleActivity;
