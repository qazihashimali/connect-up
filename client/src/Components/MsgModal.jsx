import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const MsgModal = ({ selfData, userData }) => {
  const [message, setMessage] = useState("");

  console.log("====================================");
  console.log(userData);
  console.log("====================================");

  const handleSendMsg = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/add-conversation`,
        { receiverId: userData.data?._id, message: message },
        { withCredentials: true }
      );
      console.log(res);
      toast.success(res.data.message);
      setMessage("");
      // window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };
  return (
    <div className="my-5">
      <div className="w-full mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          cols={10}
          rows={10}
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Write a message..."
        ></textarea>
      </div>
      <button
        onClick={handleSendMsg}
        className="bg-blue-500 text-white w-fit cursor-pointer rounded-full px-3 py-1"
      >
        Send
      </button>
    </div>
  );
};

export default MsgModal;
