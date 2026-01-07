import axios from "axios";
import React, { useState } from "react";

const AboutModal = ({ handleEditFunction, selfData }) => {
  const [data, setData] = useState({
    about: selfData.about,
    skills: selfData.skills.join(", "),
    resume: selfData.resume,
  });
  const onChangeHandler = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleimageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LinkedinClone");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/drkicrttn/image/upload",
        formData
      );

      let imageUrl = res.data.secure_url;

      setData({ ...data, resume: imageUrl });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    console.log("saving");

    let array = data.skills.split(", ");
    let newData = {
      ...selfData,
      about: data.about,
      skills: array,
      resume: data.resume,
    };
    console.log(newData);

    handleEditFunction(newData);
  };
  return (
    <div className="my-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label htmlFor="headline">About*</label>
        <textarea
          onChange={(e) => onChangeHandler(e, "about")}
          value={data.about}
          cols={10}
          rows={3}
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
        ></textarea>
      </div>
      <div className="w-full mb-4">
        <label htmlFor="headline">Skills*(Add by seprating comma)</label>
        <textarea
          onChange={(e) => onChangeHandler(e, "skills")}
          value={data.skills}
          cols={10}
          rows={3}
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
        ></textarea>
      </div>
      <div className="w-full mb-4">
        <label
          htmlFor="resume-upload"
          className="p-2 bg-blue-500 text-white cursor-pointer rounded-full"
        >
          Upload Resume
        </label>
        <input
          onChange={handleimageChange}
          type="file"
          id="resume-upload"
          accept="image/*"
          hidden
        />

        {data.resume && <div className="mt-2">{data.resume}</div>}
        <p className="text-sm text-gray-500 mt-2">
          Only image files (JPG, PNG, etc.) are allowed.
        </p>
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500  text-white w-fit cursor-pointer rounded-full px-3 py-1"
      >
        Save
      </button>
    </div>
  );
};

export default AboutModal;
