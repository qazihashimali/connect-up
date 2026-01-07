import React, { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "react-toastify";
import axios from "axios";

const AddModal = (props) => {
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null); // the actual file
  const [imagePreview, setImagePreview] = useState(null); // for preview

  const handlePost = async () => {
    if (!desc.trim() && !imageFile) {
      toast.error("Post cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("desc", desc);
    if (imageFile) {
      formData.append("image", imageFile); // "image" must match backend multer.single("image")
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post created successfully");
      window.location.reload(); // or better: close modal + refetch posts
    } catch (error) {
      console.error("Post failed:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

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

  return (
    <div className="">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <img
            src={props?.personalData?.profile_pic || "/default-avatar.png"}
            className="w-12 h-12 rounded-full object-cover"
            alt="profile"
          />
        </div>
        <h1 className="text-xl font-medium">
          {props?.personalData?.f_name} {props?.personalData?.l_name}
        </h1>
      </div>

      {/* Textarea */}
      <textarea
        rows={5}
        placeholder="What do you want to talk about?"
        className="w-full my-4 outline-none text-lg resize-none bg-transparent"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      {/* Image/Video Preview */}
      {imagePreview && (
        <div className="my-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-96 rounded-lg object-contain border border-gray-300"
          />
          {/* If you want to support video preview later */}
          {imageFile.type.startsWith("video/") && (
            <video
              src={imagePreview}
              controls
              className="max-h-50 rounded-lg"
            />
          )}
        </div>
      )}

      {/* Footer: Upload + Post Button */}
      <div className="flex justify-between items-center mt-6">
        <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
          <ImageIcon sx={{ fontSize: 36, color: "#666" }} />
          <input
            type="file"
            accept="image/*,video/mp4,video/quicktime"
            onChange={handleImageChange}
            hidden
          />
        </label>

        <button
          onClick={handlePost}
          disabled={!desc.trim() && !imageFile}
          className={`px-6 py-2.5 rounded-full font-medium transition ${
            desc.trim() || imageFile
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default AddModal;
