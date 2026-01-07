import React, { useEffect, useState } from "react";
import Advertisement from "../Components/Advertisement";
import Card from "../Components/Card";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Posts from "../Components/Posts";
import Modal from "../Components/Modal";
import ImageModal from "../Components/ImageModal";
import EditInfoModal from "../Components/EditInfoModal";
import AboutModal from "../Components/AboutModal";
import ExperienceModal from "../Components/ExperienceModal";
import EduModal from "../Components/EduModal";
import MsgModal from "../Components/MsgModal";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../Components/Loading";

const Profile = () => {
  const { id } = useParams();
  const [imageModal, setImageModal] = useState(false);
  const [circularImage, setCircularImage] = useState(true);
  const [infoModal, setInfoModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [experienceModal, setExperienceModal] = useState(false);
  const [eduModal, setEduModal] = useState(false);
  const [msgModal, setMsgModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [ownData, setOwnData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateExp, setUpdateExp] = useState({
    clicked: "",
    id: "",
    datas: {},
  });
  const [updateEdu, setUpdateEdu] = useState({
    clicked: "",
    id: "",
    datas: {},
  });

  const navigate = useNavigate();

  const updateExpEdit = (id, data) => {
    setUpdateExp({ ...updateExp, clicked: true, id: id, datas: data });
    setExperienceModal((prev) => !prev);
  };

  const updateEduEdit = (id, data) => {
    setUpdateEdu({ ...updateEdu, clicked: true, id: id, datas: data });
    setEduModal((prev) => !prev);
  };

  const fetchDataonLoad = async () => {
    setLoading(true);
    try {
      const [userRes, postRes, ownRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/${id}`),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getTop5Posts/${id}`
        ),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/self`, {
          withCredentials: true,
        }),
      ]);

      setUserData(userRes.data);
      setPostData(postRes.data.posts);
      setOwnData(ownRes.data.user);
      localStorage.setItem("userInfo", JSON.stringify(ownRes.data.user));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataonLoad();
  }, [id]);

  const handleImageModal = () => {
    setImageModal((prev) => !prev);
  };
  const handleOnEditCover = () => {
    setImageModal(true);
    setCircularImage(false);
  };

  const handleCircularImage = () => {
    setImageModal(true);
    setCircularImage(true);
  };

  const handleInfoModal = () => {
    setInfoModal((prev) => !prev);
  };
  const handleAboutModal = () => {
    setAboutModal((prev) => !prev);
  };
  const handleExperienceModal = () => {
    if (experienceModal) {
      setUpdateExp({ clicked: false, id: "", datas: {} });
    }
    setExperienceModal((prev) => !prev);
  };
  const handleEduModal = () => {
    if (eduModal) {
      setUpdateEdu({ clicked: false, id: "", datas: {} });
    }
    setEduModal((prev) => !prev);
  };
  const handleMsgModal = () => {
    setMsgModal((prev) => !prev);
  };

  const handleEditFunction = async (data) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
        { user: data },
        { withCredentials: true }
      );
      window.location.reload();
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  const amIFriend = () => {
    let arr = userData?.data?.friends?.find((item) => item === ownData?._id);
    return arr?.length;
  };

  const isInPendingList = () => {
    let arr = userData?.data?.pending_friends?.find(
      (item) => item === ownData?._id
    );
    return arr?.length;
  };

  const isInSelfPendingList = () => {
    let arr = ownData?.pending_friends?.find(
      (item) => item === userData?.data._id
    );
    return arr?.length;
  };

  const checkFriendship = () => {
    if (amIFriend()) {
      return "Disconnect";
    } else if (isInSelfPendingList()) {
      return "Approve Request";
    } else if (isInPendingList()) {
      return "Request Sent";
    } else {
      return "Connect";
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      if (checkFriendship() === "Request Sent") return;
      if (checkFriendship() === "Connect") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/sendFriendRequest`,
          { receiver: userData?.data?._id },
          { withCredentials: true }
        );

        console.log(res);
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (checkFriendship() === "Approve Request") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/acceptFriendRequest`,
          { receiver: userData?.data?._id },
          { withCredentials: true }
        );
        console.log(res);
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const res = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/remove-friend/${
            userData?.data?._id
          }`,
          { withCredentials: true }
        );
        console.log(res);
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  //handleLogout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      navigate("/");
      window.location.reload();
      toast.success("Logout successful!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  const handleShareProfile = async () => {
    try {
      let string = `${import.meta.env.VITE_FRONTEND_URL}/profile/${id}`;
      await navigator.clipboard.writeText(string);
      toast.success("Profile link copied to clipboard");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading fullscreen={true} />;
  }

  return (
    <div className="px-5 xl:px-50 py-5 mt-5 flex flex-col gap-5 w-full pt-12 bg-gray-100">
      <div className="flex justify-between">
        {/* Left side Main Section */}
        <div className="w-full md:w-[70%]">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                  {userData?.data?._id === ownData?._id && (
                    <div
                      className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                      onClick={handleOnEditCover}
                    >
                      <EditIcon className="text-gray-600" />
                    </div>
                  )}

                  <img
                    className="w-full h-[200px] rounded-t-lg"
                    src={userData?.data.cover_pic}
                    alt=""
                  />
                  <div
                    className="absolute object-cover top-24 left-6 z-10"
                    onClick={handleCircularImage}
                  >
                    <img
                      src={userData?.data.profile_pic}
                      alt=""
                      className="rounded-full  h-35 w-35 border-2 border-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-10 relative px-8 py-2">
                  {userData?.data?._id === ownData?._id && (
                    <div
                      onClick={handleInfoModal}
                      className="absolute cursor-pointer top-0 right-3 z-20 w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                    >
                      <EditIcon className="text-gray-600" />
                    </div>
                  )}
                  <div className="w-full">
                    <h1 className="text-2xl font-bold">
                      {userData?.data.f_name}
                    </h1>
                    <p className="text-gray-600">{userData?.data.headline}</p>
                    <p className="text-gray-600">
                      {userData?.data.curr_company}
                    </p>
                    <p className="text-gray-600">
                      {userData?.data.curr_location}
                    </p>

                    <p className="text-md font-medium text-blue-800 cursor-pointer hover:underline">
                      {userData?.data.friends.length} Connections
                    </p>

                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-5">
                        <button className="bg-blue-500 hover:bg-blue-600 cursor-pointer transition text-white px-5 py-2 rounded-full">
                          Open to
                        </button>
                        <button
                          onClick={handleShareProfile}
                          className="bg-blue-500 hover:bg-blue-600 cursor-pointer transition text-white px-5 py-2 rounded-full"
                        >
                          Share Profile
                        </button>
                        {userData?.data?._id === ownData?._id && (
                          <button
                            onClick={handleLogout}
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer transition text-white px-5 py-2 rounded-full"
                          >
                            Log Out
                          </button>
                        )}
                      </div>

                      {/* Conditionally Render */}
                      <div className="my-5 flex gap-5">
                        {amIFriend() ? (
                          <button
                            onClick={handleMsgModal}
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer transition text-white px-5 py-2 rounded-full"
                          >
                            Message
                          </button>
                        ) : null}

                        {userData?.data?._id !== ownData?._id && (
                          <button
                            onClick={handleSendFriendRequest}
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer transition text-white px-5 py-2 rounded-full"
                          >
                            {checkFriendship()}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">About</h1>

                {/* Edit Icon */}
                {userData?.data?._id === ownData?._id && (
                  <div
                    onClick={handleAboutModal}
                    className="cursor-pointer w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                  >
                    <EditIcon className="text-gray-600" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-600 mt-3">{userData?.data.about}</p>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            {/* Skills Section */}
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Skills</h1>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {userData?.data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-4 py-1 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 cursor-pointer"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-5">
              <Card padding={1}>
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Activity</h1>
                </div>
                <button className="px-3 py-1 cursor-pointer w-fit border-1 bg-green-800 text-white rounded-full font-semibold">
                  Posts
                </button>
                <div className="overflow-x-auto my-2 flex gap-1 overflow-y-hidden w-full">
                  {postData?.map((item, index) => {
                    return (
                      <Link
                        key={index}
                        to={`/profile/${id}/activities/${item._id}`}
                        className="shrink-0 w-[350px] h-[560px] cursor-pointer"
                      >
                        <Posts profile={1} item={item} personalData={ownData} />
                      </Link>
                    );
                  })}
                </div>
                {postData?.length > 5 && (
                  <div className="w-full flex justify-center items-center">
                    <Link
                      to={`/profile/${id}/activities`}
                      className="px-5 py-2 cursor-pointer w-fit border border-gray-300  hover:bg-gray-300  rounded-full font-semibold"
                    >
                      Show All Posts <ArrowRightAltIcon />
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Education Section */}
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Education</h1>
                {/* Add Icon (only for self user) */}
                {userData?.data._id === ownData?._id && (
                  <div
                    onClick={handleEduModal}
                    className="cursor-pointer w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                  >
                    <AddIcon className="text-gray-600" />
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                {userData?.data.education?.length > 0 ? (
                  userData?.data.education.map((item, index) => (
                    <div
                      key={index}
                      className="relative p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-200"
                    >
                      {/* Edit Icon (only for self user) */}
                      {userData?.data._id === ownData?._id && (
                        <div className="absolute top-3 right-3 cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 shadow-sm hover:bg-gray-100 transition">
                          <EditIcon
                            onClick={() => updateEduEdit(item._id, item)}
                            className="w-5 h-5 text-gray-600"
                          />
                        </div>
                      )}

                      {/* Degree / Field */}
                      <h2 className="font-semibold text-lg text-gray-800">
                        {item.degree}
                      </h2>

                      {/* Field of Study */}
                      <p className="text-gray-700 text-sm mt-1 font-medium">
                        {item.field_of_study}
                      </p>

                      {/* School / Duration */}
                      <p className="text-gray-700 text-sm mt-1 font-medium">
                        {item.school}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No education added yet.
                  </p>
                )}
              </div>
            </Card>

            {/* Experience Section */}
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Experience</h1>
                {/* Add Icon */}
                {userData?.data._id === ownData?._id && (
                  <div
                    onClick={handleExperienceModal}
                    className="cursor-pointer w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                  >
                    <AddIcon className="text-gray-600" />
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                {userData?.data.experience.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="relative p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-200"
                    >
                      {/* Edit Button */}
                      {userData?.data._id === ownData?._id && (
                        <div className="absolute top-3 right-3 cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 shadow-sm hover:bg-gray-100 transition">
                          <EditIcon
                            onClick={() => updateExpEdit(item._id, item)}
                            className="w-5 h-5 text-gray-600"
                          />
                        </div>
                      )}

                      {/* Designation */}
                      <h2 className="font-semibold text-lg text-gray-800">
                        {item.designation}
                      </h2>

                      {/* Company */}
                      <p className="text-gray-700 text-sm mt-1 font-medium">
                        {item.company_name}
                      </p>

                      {/* Duration + Location */}
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100">
                          {item.duration}
                        </span>
                        {item.location && (
                          <span className="px-2 py-0.5 rounded-md bg-gray-100">
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Right side Main Section */}
        <div className="w-[28%] py-1 hidden sm:block">
          <Advertisement />
        </div>
      </div>

      {imageModal && (
        <Modal title="Upload Image" closeModal={handleImageModal}>
          <ImageModal
            handleEditFunction={handleEditFunction}
            selfData={ownData}
            isCircular={circularImage}
          />
        </Modal>
      )}

      {infoModal && (
        <Modal title="Edit Profile" closeModal={handleInfoModal}>
          <EditInfoModal
            handleEditFunction={handleEditFunction}
            selfData={ownData}
          />
        </Modal>
      )}

      {aboutModal && (
        <Modal title="Edit About" closeModal={handleAboutModal}>
          <AboutModal
            handleEditFunction={handleEditFunction}
            selfData={ownData}
          />
        </Modal>
      )}

      {experienceModal && (
        <Modal title="Add Experience" closeModal={handleExperienceModal}>
          <ExperienceModal
            handleEditFunction={handleEditFunction}
            selfData={ownData}
            updateExp={updateExp}
            setUpdateExp={updateExpEdit}
          />
        </Modal>
      )}

      {eduModal && (
        <Modal title="Add Education" closeModal={handleEduModal}>
          <EduModal
            handleEditFunction={handleEditFunction}
            selfData={ownData}
            updateEdu={updateEdu}
            setUpdateEdu={updateEduEdit}
          />
        </Modal>
      )}

      {msgModal && (
        <Modal title="Send Message" closeModal={handleMsgModal}>
          <MsgModal selfData={ownData} userData={userData} />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
