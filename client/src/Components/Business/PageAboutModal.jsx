import React, { useState } from "react";

const PageAboutModal = ({ handleEditFunction, pageData, closeModal }) => {
  const [data, setData] = useState({
    description: pageData.description || "",
  });

  const onChangeHandler = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleUpdate = async () => {
    let newData = {
      ...pageData,
      description: data.description,
    };
    handleEditFunction(newData);
    closeModal();
  };

  return (
    <div className="my-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label htmlFor="description">About the Company*</label>
        <textarea
          onChange={(e) => onChangeHandler(e, "description")}
          value={data.description}
          cols={10}
          rows={10}
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Tell us about your company, mission, values, and what makes you unique..."
        ></textarea>
        <p className="text-sm text-gray-500 mt-2">
          Provide a detailed description of your company to help visitors
          understand your business.
        </p>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-600 text-white w-fit cursor-pointer rounded-full px-5 py-2"
      >
        Save
      </button>
    </div>
  );
};

export default PageAboutModal;
