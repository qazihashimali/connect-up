import React, { useEffect, useRef, useState } from "react";
import Card from "../Components/Card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Advertisement from "../Components/Advertisement";
import Conversation from "../Components/Conversation";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";
import { socket } from "../../Socket";
import Loading from "../Components/Loading";

const Messages = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Focused");
  const [conversation, setConversation] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversationDetails, setActiveConversationDetails] =
    useState(null);
  const [messages, setMessages] = useState([]);
  const [imageLink, setImageLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const options = ["Focused", "All", "Unread"];

  const handleSelectedConversation = (id, userData) => {
    setActiveConversationId(id);
    socket.emit("joinConversation", id);
    setActiveConversationDetails(userData);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const fetchConversation = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/get-conversation`,

        {
          withCredentials: true,
        }
      );

      setConversation(res.data?.conversations);
      setActiveConversationId(res.data?.conversations[0]?._id);
      socket.emit("joinConversation", res.data?.conversations[0]?._id);

      let ownId = userData?.data?._id;
      let member = res.data?.conversations[0]?.members.filter(
        (m) => m._id !== ownId
      );
      setActiveConversationDetails(
        member[0] || res.data?.conversations[0]?.members[0]
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeConversationId) return;

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/message/get-message/${activeConversationId}`,
        {
          withCredentials: true,
        }
      );

      setMessages(res.data?.messages);
      console.log(res.data?.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeConversationId]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log({ receiveMessage: data });
      setMessages([...messages, data]);
    });
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
    fetchConversation();
  }, []);

  const handleimageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LinkedinClone");
    try {
      setLoading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/drkicrttn/image/upload",
        formData
      );
      console.log(res.data.secure_url);
      setImageLink(res.data.secure_url);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/send-message`,
        {
          conversation: activeConversationId,
          message: messageText,
          picture: imageLink,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);

      socket.emit("sendMessage", {
        activeConversationId,
        message: res.data,
      });

      setMessageText("");
      setImageLink(null);
      fetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading fullscreen={true} />;
  }

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      <div className="w-full justify-between flex pt-5">
        {/* Left Side */}
        <div className="w-full md:w-[70%]">
          <Card padding={0}>
            <div className="border-b-1 border-gray-300 px-5 py-2 font-semibold text-lg">
              Messaging
            </div>

            <div className="border-b border-gray-300 px-5 py-2 relative">
              <div
                className="py-1 px-3 cursor-pointer bg-green-800 hover:bg-green-900 font-semibold flex gap-2 items-center w-fit text-white rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selected} <ArrowDropDownIcon />
              </div>

              {isOpen && (
                <div className="absolute mt-2 w-40 bg-white  rounded-lg shadow-lg z-10">
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        selected === option
                          ? "font-semibold text-green-700"
                          : ""
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* for Chat */}
            <div className="w-full md:flex">
              <div className="h-[590px] overflow-auto w-full md:w-[40%] border-r-1 border-gray-300">
                {/* For Each Chat */}
                {conversation.map((item, index) => {
                  return (
                    <Conversation
                      activeConversationId={activeConversationId}
                      handleSelectedConversation={handleSelectedConversation}
                      key={index}
                      item={item}
                      ownData={userData}
                    />
                  );
                })}
              </div>

              {/* for chat box */}
              <div className="w-full md:w-[60%] border-gray-400">
                <div className="border-gray-300 py-2 px-4 border-b-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">
                      {activeConversationDetails?.f_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {activeConversationDetails?.headline}
                    </p>
                  </div>
                  <div>
                    <MoreVertIcon />
                  </div>
                </div>

                <div className="h-[360px] overflow-auto w-full border-b-1 border-gray-300">
                  <div className="w-full border-b-1 border-gray-300 gap-3 p-4">
                    <img
                      src={activeConversationDetails?.profile_pic}
                      alt=""
                      className="rounded-[100%] h-16 w-16 border-2 border-white cursor-pointer"
                    />
                    <div className="my-2">
                      <h1 className="text-md font-bold">
                        {activeConversationDetails?.f_name}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {activeConversationDetails?.headline}
                      </p>
                    </div>
                  </div>

                  <div className="w-full">
                    {/* for each msg */}
                    {messages.map((item, index) => {
                      return (
                        <div
                          ref={ref}
                          key={index}
                          className="flex w-full cursor-pointer border-gray-300 gap-3 p-4"
                        >
                          <div className="shrink-0">
                            <img
                              src={item?.sender?.profile_pic}
                              alt=""
                              className="rounded-[100%] h-8 w-8 border-2 border-white cursor-pointer"
                            />
                          </div>
                          <div className="w-full mb-2">
                            <p className="text-md">{item?.sender?.f_name}</p>
                            <p className="text-sm mt-6 hover:bg-gray-200 p-2">
                              {item?.message}
                            </p>
                            {item?.picture && (
                              <div className="my-2">
                                <img
                                  src={item?.picture}
                                  alt=""
                                  className="w-[240px] h-[180px] rounded-md"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2 w-full border-b-1 border-gray-200">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="bg-gray-200 outline-0 rounded-xl p-3 w-full text-sm"
                    placeholder="Type a message"
                  ></textarea>
                </div>
                <div className="p-3 flex justify-between">
                  <div>
                    <label htmlFor="msgImg" className="cursor-pointer">
                      <ImageIcon sx={{ fontSize: "30px" }} />
                    </label>
                    <input
                      type="file"
                      onChange={handleimageChange}
                      id="msgImg"
                      hidden
                    />
                  </div>
                  {!loading && (
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-500 cursor-pointer font-semibold flex gap-2 w-fit text-white rounded-full px-5 py-2"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-[26%] py-1 hidden sm:block">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Messages;
