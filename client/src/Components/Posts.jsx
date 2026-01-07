// import React, { useEffect, useState } from "react";
// import Card from "./Card";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
// import CommentIcon from "@mui/icons-material/Comment";
// import SendIcon from "@mui/icons-material/Send";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// const Posts = ({ profile, item, personalData }) => {
//   const [seeMore, setSeeMore] = useState(false);
//   const [comment, setComment] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [liked, setLiked] = useState(false);
//   const [noOfLikes, setNoOfLikes] = useState(item?.likes?.length || 0);
//   const [commentText, setCommentText] = useState("");

//   const desc = item?.desc;

//   const handleComment = async (e) => {
//     e.preventDefault();
//     try {
//       if (!commentText) {
//         return toast.error("Comment cannot be empty");
//       }
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/comment/add-comment`,
//         { postId: item?._id, comment: commentText },
//         { withCredentials: true }
//       );
//       console.log(res);
//       setComments([res.data.comment, ...comments]);
//       setCommentText("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Handle Like Dislike
//   const handleLikeDislike = async () => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/post/like-dislike`,
//         { postId: item?._id },
//         { withCredentials: true }
//       );
//       if (liked) {
//         setNoOfLikes((prev) => prev - 1);
//         setLiked(false);
//       } else {
//         setNoOfLikes((prev) => prev + 1);
//         setLiked(true);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //UseEffect fo Like unLike
//   useEffect(() => {
//     let selfId = personalData?._id;
//     item?.likes?.map((item) => {
//       if (item.toString() === selfId.toString()) {
//         setLiked(true);
//         return;
//       } else {
//         setLiked(false);
//       }
//     });
//   }, []);

//   // Handle Comment Box

//   const handleCommentBox = async () => {
//     try {
//       setComment((prev) => !prev);
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/comment/get-comments/${
//           item?._id
//         }`
//       );
//       // console.log(res);
//       setComments(res.data.comments);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //Handle copy

//   const copyToClipboard = async () => {
//     try {
//       let string = `${import.meta.env.VITE_FRONTEND_URL}/profile/${
//         item?.user?._id
//       }/activities/${item?._id}`;
//       await navigator.clipboard.writeText(string);
//       toast.success("Copied to clipboard");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <Card padding={0}>
//         <div className="flex gap-3 p-4">
//           <Link
//             to={`/profile/${item?.user?._id}`}
//             className="rounded-full min-h-12 min-w-12 max-w-12 max-h-12"
//           >
//             <img
//               src={item?.user?.profile_pic}
//               alt=""
//               className="!rounded-full h-full w-full border-2 border-white cursor-pointer"
//             />
//           </Link>
//           <div>
//             <h1 className="font-semibold text-lg">{item?.user?.f_name}</h1>
//             <p className="text-gray-600 textxs">{item?.user?.headline}</p>
//           </div>
//         </div>

//         <div className="text-md p-4 my-3 whitespace-pre-line flex-grow">
//           {seeMore
//             ? desc
//             : desc?.length > 50
//             ? desc?.slice(0, 50) + "..."
//             : desc}{" "}
//           {desc?.length < 50 ? null : (
//             <span
//               className="text-gray-500 underline cursor-pointer text-sm"
//               onClick={() => setSeeMore(!seeMore)}
//             >
//               {seeMore ? "See Less" : "See More"}
//             </span>
//           )}
//         </div>

//         {item?.imageLink && (
//           <div className="w-full">
//             <img src={item?.imageLink} alt="" />
//           </div>
//         )}

//         <div className="my-2 p-4 flex justify-between items-center">
//           <div className="flex gap-1 items-center">
//             <ThumbUpIcon sx={{ color: "blue", fontSize: 20 }} />{" "}
//             <span className="text-sm text-gray-600">{noOfLikes} likes</span>
//           </div>
//           <p className="text-sm text-gray-600">{item?.comments} comments</p>
//         </div>

//         {!profile && (
//           <div className="flex p-1">
//             <div
//               onClick={handleLikeDislike}
//               className="w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
//             >
//               {liked ? (
//                 <ThumbUpIcon sx={{ color: "blue", fontSize: 22 }} />
//               ) : (
//                 <ThumbUpAltOutlinedIcon sx={{ fontSize: 22 }} />
//               )}{" "}
//               <span>{liked ? "Liked" : "Like"}</span>
//             </div>
//             <div
//               onClick={handleCommentBox}
//               className="w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
//             >
//               <CommentIcon sx={{ fontSize: 20 }} /> <span>Comment</span>
//             </div>
//             <div
//               onClick={copyToClipboard}
//               className="w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
//             >
//               <SendIcon sx={{ fontSize: 20 }} /> <span>Share</span>
//             </div>
//           </div>
//         )}
//         {/* Comment Section */}
//         {comment && (
//           <div className="p-4 w-full">
//             <div className="flex gap-2 items-center">
//               <img
//                 src={personalData?.profile_pic}
//                 alt=""
//                 className="rounded-4xl h-12 w-12 border-2 border-white cursor-pointer"
//               />
//               <form className="w-full flex gap-2" onSubmit={handleComment}>
//                 <input
//                   type="text"
//                   placeholder="Write a comment..."
//                   className="w-full bg-gray-100 py-3 px-5 rounded-3xl"
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="cursor-pointer bg-blue-800 text-white py-1 px-3 rounded-3xl"
//                 >
//                   Send
//                 </button>
//               </form>
//             </div>

//             {/* Others Comments Section */}
//             <div className="w-full p-4">
//               {comments.map((comment, index) => {
//                 return (
//                   <div className="my-4" key={index}>
//                     <Link
//                       to={`/profile/${comment?.user?._id}`}
//                       className="flex gap-3"
//                     >
//                       <img
//                         src={comment?.user?.profile_pic}
//                         alt=""
//                         className="rounded-4xl h-10 w-10 border-2 border-white cursor-pointer"
//                       />
//                       <div className="cursor-pointer">
//                         <h1 className="text-md">{item?.user?.f_name}</h1>
//                         <p className="text-sm text-gray-600">
//                           {comment?.user?.headline}
//                         </p>
//                       </div>
//                     </Link>
//                     <p className="px-11 my-2">{comment?.comment}</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </Card>
//     </>
//   );
// };

// export default Posts;

import React, { useEffect, useState } from "react";
import Card from "./Card";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Posts = ({ profile, item, personalData }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [comment, setComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(
    Array.isArray(item?.likes) ? item.likes.length : 0
  );
  const [commentText, setCommentText] = useState("");
  const [authorData, setAuthorData] = useState(null);

  const desc = item?.desc;
  const isPagePost = item?.authorType === "Page";

  // Fetch author data (User or Page)
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        if (isPagePost && item?.authorId) {
          // Fetch page data
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/page/${item.authorId}`
          );
          setAuthorData(res.data.page);
        } else if (item?.user) {
          // Use existing user data
          setAuthorData(item.user);
        }
      } catch (error) {
        console.log("Error fetching author data:", error);
      }
    };

    fetchAuthorData();
  }, [item, isPagePost]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      if (!commentText) {
        return toast.error("Comment cannot be empty");
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/add-comment`,
        { postId: item?._id, comment: commentText },
        { withCredentials: true }
      );
      console.log(res);
      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Like Dislike
  const handleLikeDislike = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/like-dislike`,
        { postId: item?._id },
        { withCredentials: true }
      );
      if (liked) {
        setNoOfLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        setNoOfLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //UseEffect for Like/Unlike
  useEffect(() => {
    const selfId = personalData?._id;
    if (Array.isArray(item?.likes) && selfId) {
      const hasLiked = item.likes.some(
        (likeId) => likeId.toString() === selfId.toString()
      );
      setLiked(hasLiked);
    }
  }, [item?.likes, personalData?._id]);

  // Handle Comment Box
  const handleCommentBox = async () => {
    try {
      setComment((prev) => !prev);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/get-comments/${
          item?._id
        }`
      );
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  //Handle copy
  const copyToClipboard = async () => {
    try {
      let string;
      if (isPagePost) {
        string = `${import.meta.env.VITE_FRONTEND_URL}/page/${
          item?.authorId
        }/post/${item?._id}`;
      } else {
        string = `${import.meta.env.VITE_FRONTEND_URL}/profile/${
          item?.user?._id
        }/activities/${item?._id}`;
      }
      await navigator.clipboard.writeText(string);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.log(error);
    }
  };

  // Get profile link based on author type
  const getProfileLink = () => {
    if (isPagePost && item?.authorId) {
      return `/page/${item.authorId}`;
    }
    return `/profile/${item?.user?._id}`;
  };

  // Get author image
  const getAuthorImage = () => {
    if (isPagePost && authorData) {
      return authorData.logo;
    }
    return item?.user?.profile_pic || authorData?.profile_pic;
  };

  // Get author name
  const getAuthorName = () => {
    if (isPagePost && authorData) {
      return authorData.name;
    }
    return item?.user?.f_name || authorData?.f_name;
  };

  // Get author headline/tagline
  const getAuthorHeadline = () => {
    if (isPagePost && authorData) {
      return authorData.tagline || authorData.industry;
    }
    return item?.user?.headline || authorData?.headline || "";
  };

  const getMediaType = (url) => {
    if (!url) return null;
    const ext = url.split(".").pop().toLowerCase();
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

    if (videoExtensions.includes(ext)) return "video";
    if (imageExtensions.includes(ext)) return "image";
    return "unknown";
  };

  return (
    <>
      <Card padding={0}>
        {/* Author Header */}
        <div className="flex gap-3 p-4">
          <Link
            to={getProfileLink()}
            className="rounded-full min-h-12 min-w-12 max-w-12 max-h-12"
          >
            <img
              src={getAuthorImage()}
              alt={getAuthorName()}
              className="!rounded-full h-full w-full border-2 border-white cursor-pointer object-cover"
            />
          </Link>
          <div>
            <Link to={getProfileLink()}>
              <h1 className="font-semibold text-lg hover:underline">
                {getAuthorName()}
              </h1>
            </Link>
            <p className="text-gray-600 text-xs">{getAuthorHeadline()}</p>
            {/* {isPagePost && (
              <p className="text-xs text-gray-500 mt-1">• Company Page</p>
            )} */}
          </div>
        </div>

        {/* Post Description */}
        <div className="text-md p-4 my-3 whitespace-pre-line flex-grow">
          {seeMore
            ? desc
            : desc?.length > 50
            ? desc?.slice(0, 50) + "..."
            : desc}{" "}
          {desc?.length < 50 ? null : (
            <span
              className="text-gray-500 underline cursor-pointer text-sm"
              onClick={() => setSeeMore(!seeMore)}
            >
              {seeMore ? "See Less" : "See More"}
            </span>
          )}
        </div>

        {/* Post Image */}
        {item?.imageLink && (
          <div className="w-full bg-black flex justify-center">
            {getMediaType(item.imageLink) === "video" ? (
              <video
                controls
                className="w-full max-h-screen object-contain"
                style={{ maxHeight: "600px" }}
                preload="metadata"
              >
                <source src={item.imageLink} />
                Your browser does not support video playback.
              </video>
            ) : (
              <img
                src={item.imageLink}
                alt="Post"
                className="w-full object-contain max-h-screen"
                style={{ maxHeight: "600px" }}
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* Likes and Comments Count */}
        <div className="my-2 p-4 flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <ThumbUpIcon sx={{ color: "blue", fontSize: 20 }} />{" "}
            <span className="text-sm text-gray-600">
              {noOfLikes} {noOfLikes === 1 ? "like" : "likes"}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {item?.comments} {item?.comments === 1 ? "comment" : "comments"}
          </p>
        </div>

        {/* Action Buttons (Like, Comment, Share) */}
        {!profile && (
          <div className="flex p-1">
            <div
              onClick={handleLikeDislike}
              className="w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              {liked ? (
                <ThumbUpIcon sx={{ color: "blue", fontSize: 22 }} />
              ) : (
                <ThumbUpAltOutlinedIcon sx={{ fontSize: 22 }} />
              )}{" "}
              <span>{liked ? "Liked" : "Like"}</span>
            </div>
            <div
              onClick={handleCommentBox}
              className="w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              <CommentIcon sx={{ fontSize: 20 }} /> <span>Comment</span>
            </div>
            <div
              onClick={copyToClipboard}
              className="w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              <SendIcon sx={{ fontSize: 20 }} /> <span>Share</span>
            </div>
          </div>
        )}

        {/* Comment Section */}
        {comment && (
          <div className="p-4 w-full">
            <div className="flex gap-2 items-center">
              <img
                src={personalData?.profile_pic}
                alt="Your profile"
                className="rounded-4xl h-12 w-12 border-2 border-white cursor-pointer object-cover"
              />
              <form className="w-full flex gap-2" onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full bg-gray-100 py-3 px-5 rounded-3xl"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-blue-800 text-white py-1 px-3 rounded-3xl"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Others Comments Section */}
            <div className="w-full p-4">
              {comments.map((comment, index) => {
                return (
                  <div className="my-4" key={index}>
                    <Link
                      to={`/profile/${comment?.user?._id}`}
                      className="flex gap-3"
                    >
                      <img
                        src={comment?.user?.profile_pic}
                        alt={comment?.user?.f_name}
                        className="rounded-4xl h-10 w-10 border-2 border-white cursor-pointer object-cover"
                      />
                      <div className="cursor-pointer">
                        <h1 className="text-md">{comment?.user?.f_name}</h1>
                        <p className="text-sm text-gray-600">
                          {comment?.user?.headline}
                        </p>
                      </div>
                    </Link>
                    <p className="px-11 my-2">{comment?.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default Posts;
