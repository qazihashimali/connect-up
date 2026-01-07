import React, { useState } from "react";

const EditInfoModal = ({ handleEditFunction, selfData }) => {
  const [data, setData] = useState({
    f_name: selfData.f_name,
    headline: selfData.headline,
    curr_company: selfData.curr_company,
    curr_location: selfData.curr_location,
  });
  const onChangeHandler = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleUpdate = async () => {
    let newData = { ...selfData, ...data };
    handleEditFunction(newData);
  };
  return (
    <div className="mt-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label htmlFor="name">Full Name*</label>
        <input
          onChange={(e) => onChangeHandler(e, "f_name")}
          value={data.f_name}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your name"
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="headline">Headline*</label>
        <textarea
          onChange={(e) => onChangeHandler(e, "headline")}
          value={data.headline}
          cols={10}
          rows={3}
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
        ></textarea>
      </div>
      <div className="w-full mb-4">
        <label htmlFor="company">Current Company*</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your company name"
          onChange={(e) => onChangeHandler(e, "curr_company")}
          value={data.curr_company}
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="location">Current Location*</label>
        <input
          onChange={(e) => onChangeHandler(e, "curr_location")}
          value={data.curr_location}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your location"
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white w-fit cursor-pointer rounded-full px-3 py-1"
      >
        Save
      </button>
    </div>
  );
};

export default EditInfoModal;
