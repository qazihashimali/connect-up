// import React, { useState } from "react";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import { toast } from "react-toastify";
// import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
// import CloseIcon from "@mui/icons-material/Close";

// const PagePostModal = ({ pageId, pageData, closeModal, refreshPosts }) => {
//   const [desc, setDesc] = useState("");
//   const [imageLink, setImageLink] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "LinkedinClone");

//     try {
//       setUploading(true);
//       const res = await axios.post(
//         "https://api.cloudinary.com/v1_1/drkicrttn/image/upload",
//         formData
//       );
//       setImageLink(res.data.secure_url);
//       toast.success("Image uploaded successfully!");
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to upload image");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImageLink("");
//   };

//   const handleSubmit = async () => {
//     if (!desc.trim() && !imageLink) {
//       toast.error("Please add some content or image to post");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/page/${pageId}/post`,
//         { desc, imageLink },
//         { withCredentials: true }
//       );
//       console.log(res.data);
//       toast.success("Post created successfully!");
//       closeModal();

//       // Refresh posts if callback provided
//       if (refreshPosts) {
//         refreshPosts();
//       } else {
//         // Fallback: reload page
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || "Failed to create post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-5 max-h-[80vh] overflow-y-auto">
//       {/* Page Header */}
//       <div className="flex items-center gap-3 mb-4 pb-4">
//         <img
//           src={pageData?.logo || "https://via.placeholder.com/50"}
//           alt={pageData?.name}
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <div>
//           <h3 className="font-semibold text-lg">{pageData?.name}</h3>
//           <p className="text-sm text-gray-500">Posting as page</p>
//         </div>
//       </div>

//       {/* Text Area */}
//       <div className="mb-4">
//         <textarea
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//           rows={6}
//           placeholder="What do you want to talk about?"
//         />
//       </div>

//       {/* Image Preview */}
//       {imageLink && (
//         <div className="mb-4 relative">
//           <img
//             src={imageLink}
//             alt="Upload preview"
//             className="h-8 w-8 object-cover"
//           />
//           <button
//             onClick={handleRemoveImage}
//             className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//           >
//             <CloseIcon className="text-gray-700" />
//           </button>
//         </div>
//       )}

//       {/* Upload Progress */}
//       {uploading && (
//         <Box className="flex justify-center my-4">
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Actions */}
//       <div className="flex justify-between items-center pt-4 border-t">
//         <div className="flex gap-2">
//           <label
//             htmlFor="page-post-image"
//             className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
//           >
//             <InsertPhotoIcon sx={{ color: "blue" }} />
//             <span className="text-gray-700">Photo</span>
//           </label>
//           <input
//             id="page-post-image"
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             hidden
//           />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading || uploading || (!desc.trim() && !imageLink)}
//           className={`px-6 py-2 rounded-full font-semibold transition ${
//             loading || uploading || (!desc.trim() && !imageLink)
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//               : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
//           }`}
//         >
//           {loading ? "Posting..." : "Post"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PagePostModal;

import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";

const PagePostModal = ({ pageId, pageData, closeModal, refreshPosts }) => {
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null); // the actual file
  const [imagePreview, setImagePreview] = useState(null); // for preview
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only images and videos are allowed");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    toast.success("Image ready to post");
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!desc.trim() && !imageFile) {
      toast.error("Please add some content or image to post");
      return;
    }

    const formData = new FormData();
    formData.append("desc", desc);
    if (imageFile) {
      formData.append("image", imageFile); // "image" must match backend multer.single("image")
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/page/${pageId}/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      toast.success("Post created successfully!");
      closeModal();

      // Refresh posts if callback provided
      if (refreshPosts) {
        refreshPosts();
      } else {
        // Fallback: reload page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-h-[80vh] overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-4 pb-4">
        <img
          src={pageData?.logo}
          alt={pageData?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{pageData?.name}</h3>
          <p className="text-sm text-gray-500">Posting as page</p>
        </div>
      </div>

      {/* Text Area */}
      <div className="mb-4">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder="What do you want to talk about?"
        />
      </div>

      {/* Image/Video Preview */}
      {imagePreview && (
        <div className="mb-4 relative">
          {imageFile?.type.startsWith("video/") ? (
            <video src={imagePreview} controls className="h-8 w-8 rounded-lg" />
          ) : (
            <img
              src={imagePreview}
              alt="Upload preview"
              className="h-8 w-8 rounded-lg object-contain border border-gray-300"
            />
          )}
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <CloseIcon className="text-gray-700" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          <label
            htmlFor="page-post-image"
            className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <InsertPhotoIcon sx={{ color: "blue" }} />
            <span className="text-gray-700">Photo</span>
          </label>
          <input
            id="page-post-image"
            type="file"
            accept="image/*,video/mp4,video/quicktime"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || (!desc.trim() && !imageFile)}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            loading || (!desc.trim() && !imageFile)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PagePostModal;
