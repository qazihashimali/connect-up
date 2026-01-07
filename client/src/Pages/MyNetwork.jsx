// import React, { useEffect, useState } from "react";
// import Profilecard from "../Components/Profilecard";
// import axios from "axios";
// import Loading from "../Components/Loading";

// const MyNetwork = () => {
//   const [text, setText] = useState("Catchup with Friends");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchFriendsData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/friendList`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(res);
//       setData(res.data.friends);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPendingRequests = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/pending-friends`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(res);
//       setData(res.data.pendingFriends);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (text === "Catchup with Friends") {
//       fetchFriendsData();
//     } else {
//       fetchPendingRequests();
//     }
//   }, [text]);

//   if (loading) {
//     return <Loading />;
//   }
//   return (
//     <div className="px-5 xl:px-50 py-9 flex flex-col gap-5 w-full mt-5 bg-gray-100">
//       <div className="py-4 px-10 border-1 border-gray-200 w-full flex justify-between items-center  my-5 text-xl bg-white rounded-xl">
//         <h1 className="font-semibold text-2xl">{text}</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setText("Catchup with Friends")}
//             className={`px-5 py-2 rounded-full cursor-pointer border-1  border-gray-400 ${
//               text === "Catchup with Friends" ? "bg-blue-500 text-white" : ""
//             }`}
//           >
//             Friends
//           </button>
//           <button
//             onClick={() => setText("Pending Requests")}
//             className={`px-5 py-2 rounded-full cursor-pointer border-1  border-gray-400 ${
//               text === "Pending Requests" ? "bg-blue-500 text-white" : ""
//             }`}
//           >
//             Pending Requests
//           </button>
//         </div>
//       </div>

//       <div className="flex h-[80vh] w-full gap-7 flex-wrap items-start justify-center">
//         {data?.map((item, index) => (
//           <div className="md:w-[23%] h-[270px] sm:w-full">
//             <Profilecard data={item} key={index} />
//           </div>
//         ))}

//         {data.length === 0 && (
//           <h1 className="text-2xl font-semibold">
//             {text === "Catchup with Friends"
//               ? "No friends found"
//               : "No requests found"}
//           </h1>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyNetwork;

import React, { useEffect, useState } from "react";
import Profilecard from "../Components/Profilecard";
import axios from "axios";
import Loading from "../Components/Loading";

const MyNetwork = () => {
  const [text, setText] = useState("Catchup with Friends");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/friendList`,
        { withCredentials: true }
      );
      setData(res.data.friends || []); // ✅ ensure it's an array
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/pending-friends`,
        { withCredentials: true }
      );
      setData(res.data.pendingFriends || []); // ✅ ensure it's an array
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const [allUsersRes, friendsRes, pendingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/all-users`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/friendList`, {
          withCredentials: true,
        }),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/pending-friends`,
          {
            withCredentials: true,
          }
        ),
      ]);

      const allUsers = Array.isArray(allUsersRes.data.data)
        ? allUsersRes.data.data
        : [];

      const friends = friendsRes.data.friends || [];
      const pending = pendingRes.data.pendingFriends || [];

      // ✅ Collect friend & pending user IDs
      const excludedIds = new Set([
        ...friends.map((f) => f._id),
        ...pending.map((p) => p._id),
      ]);

      // ✅ Filter out friends and pending users
      const filteredUsers = allUsers.filter(
        (user) => !excludedIds.has(user._id)
      );

      setData(filteredUsers);
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (text === "Catchup with Friends") {
      fetchFriendsData();
    } else if (text === "Pending Requests") {
      fetchPendingRequests();
    } else if (text === "All LinkedIn Users") {
      fetchAllUsers();
    }
  }, [text]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-5 xl:px-50 py-9 flex flex-col gap-5 w-full mt-5 bg-gray-100">
      <div className="py-4 px-10 border-1 border-gray-200 w-full flex justify-between items-center my-5 text-xl bg-white rounded-xl">
        <h1 className="font-semibold text-2xl">{text}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setText("Catchup with Friends")}
            className={`px-5 py-2 rounded-full cursor-pointer border-1 border-gray-400 ${
              text === "Catchup with Friends" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Friends
          </button>

          <button
            onClick={() => setText("Pending Requests")}
            className={`px-5 py-2 rounded-full cursor-pointer border-1 border-gray-400 ${
              text === "Pending Requests" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Pending Requests
          </button>

          <button
            onClick={() => setText("All LinkedIn Users")}
            className={`px-5 py-2 rounded-full cursor-pointer border-1 border-gray-400 ${
              text === "All LinkedIn Users" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Grow
          </button>
        </div>
      </div>

      <div className="flex h-[80vh] w-full gap-7 flex-wrap items-start justify-center">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item, index) => (
            <div className="md:w-[23%] h-[270px] sm:w-full" key={index}>
              <Profilecard
                data={item}
                showConnectButton={text === "All LinkedIn Users"}
              />
            </div>
          ))
        ) : (
          <h1 className="text-2xl font-semibold">
            {text === "Catchup with Friends"
              ? "No friends found"
              : text === "Pending Requests"
              ? "No requests found"
              : "No users found"}
          </h1>
        )}
      </div>
    </div>
  );
};

export default MyNetwork;
