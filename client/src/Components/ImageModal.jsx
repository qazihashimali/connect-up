import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ImageModal = ({ isCircular, selfData, handleEditFunction }) => {
  const [imageLink, setImageLink] = useState(
    isCircular ? selfData?.profile_pic : selfData?.cover_pic
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
    let { data } = { ...selfData };
    if (isCircular) {
      data = { ...data, ["profile_pic"]: imageLink };
    } else {
      data = { ...data, ["cover_pic"]: imageLink };
    }
    handleEditFunction(data);
  };
  return (
    <div className="p-5 relative flex items-center flex-col h-full">
      {isCircular ? (
        <img
          className="rounded-full h-[150px] w-[150px]"
          src={imageLink}
          alt=""
        />
      ) : (
        <img
          className="w-full h-[200px] rounded-xl object-cover"
          src={imageLink}
          alt=""
        />
      )}
      <label
        htmlFor="btn-submit"
        className="absolute bottom-10 left-0 p-3 bg-blue-500 text-white rounded-2xl cursor-pointer"
      >
        Upload
      </label>
      <input onChange={handleimageChange} type="file" id="btn-submit" hidden />
      {loading ? (
        <Box sx={{ position: "absolute", left: 350, top: 100 }}>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : (
        <button
          onClick={handleSubmit}
          className="absolute bottom-10 right-0 p-3 bg-blue-500 text-white rounded-2xl cursor-pointer"
        >
          Submit
        </button>
      )}{" "}
    </div>
  );
};

export default ImageModal;
