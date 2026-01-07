import React, { useState } from "react";

const ExperienceModal = ({ handleEditFunction, selfData, updateExp }) => {
  console.log(updateExp);

  const [data, setData] = useState({
    designation: updateExp?.clicked ? updateExp?.datas.designation : "",
    company_name: updateExp?.clicked ? updateExp?.datas.company_name : "",
    duration: updateExp?.clicked ? updateExp?.datas.duration : "",
    location: updateExp?.clicked ? updateExp?.datas.location : "",
  });
  const onChangeHandler = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleAddExperience = async () => {
    if (updateExp?.clicked) return updateExpSave();
    let expArr = [...selfData.experience, data];
    let newData = { ...selfData, experience: expArr };
    handleEditFunction(newData);
  };
  const updateExpSave = async () => {
    let newFilterData = selfData.experience.filter(
      (item) => item._id !== updateExp?.datas?._id
    );
    let newArr = [...newFilterData, data];
    let newData = { ...selfData, experience: newArr };
    handleEditFunction(newData);
  };

  const handleDeleteExperience = () => {
    let newFilterData = selfData.experience.filter(
      (item) => item._id !== updateExp?.datas?._id
    );
    let newData = { ...selfData, experience: newFilterData };
    handleEditFunction(newData);
  };
  return (
    <div className="mt-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label htmlFor="role">Role*</label>
        <input
          onChange={(e) => onChangeHandler(e, "designation")}
          value={data.designation}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your Role"
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="company">Company or organization*</label>
        <input
          onChange={(e) => onChangeHandler(e, "company_name")}
          value={data.company_name}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your company name"
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="duration">Duration*</label>
        <input
          onChange={(e) => onChangeHandler(e, "duration")}
          value={data.duration}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="e.g. 2018 - 2022"
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="place">Location*</label>
        <input
          onChange={(e) => onChangeHandler(e, "location")}
          value={data.location}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter Place"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleAddExperience}
          className="bg-blue-500 text-white w-fit cursor-pointer rounded-full px-3 py-1"
        >
          Save
        </button>
        {updateExp?.clicked && (
          <button
            onClick={handleDeleteExperience}
            className="bg-red-500 text-white w-fit cursor-pointer rounded-full px-3 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ExperienceModal;
