import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const PageImageModal = ({ isCircular, pageData, handleEditFunction }) => {
  const [imageLink, setImageLink] = useState(
    isCircular ? pageData?.logo : pageData?.cover_image
  );
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    let data = { ...pageData };
    if (isCircular) {
      data = { ...data, logo: imageLink }; // Changed from profile_pic
    } else {
      data = { ...data, cover_image: imageLink }; // Changed from cover_pic
    }
    handleEditFunction(data);
  };

  return (
    <div className="p-5 relative flex items-center flex-col h-full">
      {isCircular ? (
        <img
          className="rounded-full h-[150px] w-[150px] object-cover"
          src={imageLink}
          alt="Logo"
        />
      ) : (
        <img
          className="w-full h-[200px] rounded-xl object-cover"
          src={imageLink}
          alt="Cover"
        />
      )}
      <label
        htmlFor="btn-submit"
        className="absolute bottom-10 left-0 p-3 bg-blue-500 text-white rounded-2xl cursor-pointer hover:bg-blue-600"
      >
        Upload
      </label>
      <input onChange={handleimageChange} type="file" id="btn-submit" hidden />
      {loading ? (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress sx={{ color: "blue" }} />
        </Box>
      ) : (
        <button
          onClick={handleSubmit}
          className="absolute bottom-10 right-0 p-3 bg-blue-500 text-white rounded-2xl cursor-pointer hover:bg-blue-600"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default PageImageModal;
