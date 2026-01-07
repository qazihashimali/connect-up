import React, { useEffect, useState } from "react";
import Advertisement from "../../Components/Advertisement";
import Card from "../../Components/Card";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "../../Components/Modal";
import Loading from "../../Components/Loading";
import { useParams, Link } from "react-router-dom";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Posts from "../../Components/Posts";
import axios from "axios";
import PageImageModal from "../../Components/Business/PageImageModal";
import { toast } from "react-toastify";
import PageAboutModal from "../../Components/Business/PageAboutModal";
import PageEditInfoModal from "../../Components/Business/PageEditInfoModal";
import PagePostModal from "../../Components/Business/PagePostModal";

const PageDetails = () => {
  const { id } = useParams();

  const [page, setPage] = useState(null);
  const [ownData, setOwnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [postData, setPostData] = useState([]);
  const [circularImage, setCircularImage] = useState(true);

  // Modals
  const [imageModal, setImageModal] = useState(false);
  const [editInfoModal, setEditInfoModal] = useState(false);
  const [editAboutModal, setEditAboutModal] = useState(false);
  const [addPostModal, setAddPostModal] = useState(false);

  // -------------------- FETCH PAGE DATA --------------------
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const [pageResponse, postsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/page/${id}`, {
            withCredentials: true,
          }),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/page/${id}/posts/top5`,
            { withCredentials: true }
          ),
        ]);

        const pageData = pageResponse.data.page;
        setPage(pageData);

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setOwnData(userInfo);

        if (userInfo?._id && pageData?.owner === userInfo._id) {
          setIsOwner(true);
        }

        setPostData(postsResponse.data.posts || []);
      } catch (error) {
        console.error("Error fetching page:", error);
        toast.error("Failed to load page data");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  // Add refresh function
  const refreshPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/page/${id}/posts/top5`,
        { withCredentials: true }
      );
      setPostData(response.data.posts || []);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };
  // -------------------- IMAGE MODAL HANDLERS --------------------
  const handleOnEditCover = () => {
    setImageModal(true);
    setCircularImage(false);
  };

  const handleCircularImage = () => {
    setImageModal(true);
    setCircularImage(true);
  };

  const handleImageModal = () => {
    setImageModal((prev) => !prev);
  };

  const handleEditFunction = async (data) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/page/${id}`,
        data,
        { withCredentials: true }
      );
      toast.success("Page updated successfully!");
      // Refresh page data
      setPage(res.data.page);
      setImageModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update page");
    }
  };

  // -------------------- OTHER MODAL HANDLERS --------------------
  const openInfoModal = () => setEditInfoModal(true);
  const closeInfoModal = () => setEditInfoModal(false);
  const openAboutModal = () => setEditAboutModal(true);
  const closeAboutModal = () => setEditAboutModal(false);
  const openAddPostModal = () => setAddPostModal(true);
  const closeAddPostModal = () => setAddPostModal(false);

  if (loading) return <Loading fullscreen={true} />;
  if (!page) return <p className="text-center mt-40">Page not found</p>;

  const isSelf = isOwner;

  return (
    <div className="px-5 xl:px-50 py-5 flex flex-col gap-5 w-full pt-[120px] bg-gray-100">
      <div className="flex justify-between">
        {/* ------------------ LEFT SECTION ------------------ */}
        <div className="w-full md:w-[70%]">
          {/* Header Card */}
          <Card padding={0}>
            <div className="w-full h-fit">
              <div className="relative w-full h-[200px]">
                {isSelf && (
                  <div
                    className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                    onClick={handleOnEditCover}
                  >
                    <EditIcon className="text-gray-600" />
                  </div>
                )}
                <img
                  className="w-full h-[200px] rounded-t-lg object-cover"
                  src={
                    page.cover_image || "https://via.placeholder.com/1200x400"
                  }
                  alt="Cover"
                />
                <div className="absolute top-24 left-6 z-10">
                  <img
                    src={page.logo || "https://via.placeholder.com/150"}
                    alt={page.name}
                    className="rounded-full h-35 w-35 border-4 border-white shadow-lg object-cover cursor-pointer"
                    onClick={isSelf ? handleCircularImage : undefined}
                  />
                </div>
              </div>

              <div className="mt-10 relative px-8 py-2">
                {isSelf && (
                  <div
                    onClick={openInfoModal}
                    className="absolute cursor-pointer top-0 right-3 z-20 w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                  >
                    <EditIcon className="text-gray-600" />
                  </div>
                )}

                <div className="w-full">
                  <h1 className="text-3xl font-bold">{page.name}</h1>
                  <p className="text-gray-600 text-xl">{page.tagline}</p>
                  <p className="text-gray-600">{page.industry}</p>

                  <div className="my-5 flex gap-4 flex-wrap">
                    {page.website && (
                      <a
                        href={
                          page.website.startsWith("http")
                            ? page.website
                            : `https://${page.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    )}
                    {page.linkedinUrl && (
                      <a
                        href={page.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="flex gap-4 flex-wrap text-sm text-gray-600">
                    <span>{page.type}</span>
                    <span>•</span>
                    <span>{page.size}</span>
                    <span>•</span>
                    <span>{page.organizationType}</span>
                    {page.founded && (
                      <>
                        <span>•</span>
                        <span>Founded {page.founded}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => console.log("Follow clicked!")}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition"
                >
                  Follow
                </button>
              </div>
            </div>
          </Card>

          {/* Add Post Section */}
          {isSelf && (
            <div className="my-5">
              <Card padding={1}>
                <div className="flex gap-2 items-center">
                  <img
                    src={page.logo || "https://via.placeholder.com/50"}
                    alt="Page Logo"
                    className="rounded-full h-12 w-12 border-2 border-white cursor-pointer object-cover"
                  />
                  <div
                    onClick={openAddPostModal}
                    className="w-full border border-gray-300 text-gray-600 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100"
                  >
                    Start a post
                  </div>
                </div>

                <div className="w-full flex mt-3">
                  <div
                    onClick={openAddPostModal}
                    className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"
                  >
                    <VideoCallIcon sx={{ color: "green" }} /> Video
                  </div>
                  <div
                    onClick={openAddPostModal}
                    className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"
                  >
                    <InsertPhotoIcon sx={{ color: "blue" }} /> Photo
                  </div>
                  <div
                    onClick={openAddPostModal}
                    className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"
                  >
                    <ArticleIcon sx={{ color: "orange" }} /> Article
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* About Section */}
          <div className="my-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">About</h1>
                {isSelf && (
                  <div
                    onClick={openAboutModal}
                    className="cursor-pointer w-[35px] h-[35px] flex items-center justify-center rounded-full p-1 bg-white shadow-md hover:bg-gray-100 transition"
                  >
                    <EditIcon className="text-gray-600" />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-gray-600 whitespace-pre-line">
                  {page.description || "No description added yet."}
                </p>
              </div>
            </Card>
          </div>

          {/* Activity Section */}
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Activity</h1>
              </div>
              <button className="px-3 py-1 cursor-pointer w-fit border bg-green-800 text-white rounded-full font-semibold">
                Posts
              </button>
              <div className="overflow-x-auto my-2 flex gap-1 overflow-y-hidden w-full">
                {postData?.map((item, index) => (
                  <Link
                    key={index}
                    to={`/profile/${id}/activities/${item._id}`}
                    className="shrink-0 w-[350px] h-[560px] cursor-pointer"
                  >
                    <Posts profile={1} item={item} personalData={ownData} />
                  </Link>
                ))}
              </div>
              {postData?.length > 5 && (
                <div className="w-full flex justify-center items-center">
                  <Link
                    to={`/profile/${id}/activities`}
                    className="px-5 py-2 cursor-pointer w-fit border border-gray-300 hover:bg-gray-300 rounded-full font-semibold"
                  >
                    Show All Posts <ArrowRightAltIcon />
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ------------------ RIGHT SECTION ------------------ */}
        <div className="w-[28%] py-1 hidden sm:block">
          <Advertisement />
        </div>
      </div>
      {/* ------------------ MODALS ------------------ */}
      {/* Image Upload Modal */}
      {imageModal && (
        <Modal title="Upload Image" closeModal={handleImageModal}>
          <PageImageModal
            handleEditFunction={handleEditFunction}
            pageData={page}
            isCircular={circularImage}
          />
        </Modal>
      )}
      {/* Add Post Modal */}
      {addPostModal && (
        <Modal title="Create Post" closeModal={closeAddPostModal}>
          <PagePostModal
            pageId={id}
            pageData={page}
            closeModal={closeAddPostModal}
            refreshPosts={refreshPosts}
          />
        </Modal>
      )}

      {editInfoModal && (
        <Modal title="Edit Page Info" closeModal={closeInfoModal}>
          <PageEditInfoModal
            handleEditFunction={handleEditFunction}
            pageData={page}
            closeModal={closeInfoModal}
          />
        </Modal>
      )}
      {/* Edit About Modal */}
      {editAboutModal && (
        <Modal title="Edit About" closeModal={closeAboutModal}>
          <PageAboutModal
            handleEditFunction={handleEditFunction}
            pageData={page}
            closeModal={closeAboutModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default PageDetails;
