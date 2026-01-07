import React, { useState } from "react";

const EduModal = ({ handleEditFunction, selfData, updateEdu }) => {
  console.log({ Education: updateEdu });

  const [data, setData] = useState({
    school: updateEdu?.clicked ? updateEdu?.datas.school : "",
    degree: updateEdu?.clicked ? updateEdu?.datas.degree : "",
    field_of_study: updateEdu?.clicked ? updateEdu?.datas.field_of_study : "",
    duration: updateEdu?.clicked ? updateEdu?.datas.duration : "",
  });

  const onChangeHandler = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleAddEducation = async () => {
    if (updateEdu?.clicked) return updateEduSave();
    let eduArr = [...selfData.education, data];
    let newData = { ...selfData, education: eduArr };
    handleEditFunction(newData);
  };

  const updateEduSave = async () => {
    let newFilterData = selfData.education.filter(
      (item) => item._id !== updateEdu?.datas?._id
    );
    let newArr = [...newFilterData, data];
    let newData = { ...selfData, education: newArr };
    handleEditFunction(newData);
  };

  const handleDeleteEducation = () => {
    let newFilterData = selfData.education.filter(
      (item) => item._id !== updateEdu?.datas?._id
    );
    let newData = { ...selfData, education: newFilterData };
    handleEditFunction(newData);
  };

  return (
    <div className="mt-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label htmlFor="school">School / University*</label>
        <input
          onChange={(e) => onChangeHandler(e, "school")}
          value={data.school}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your School or University"
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="degree">Degree*</label>
        <input
          onChange={(e) => onChangeHandler(e, "degree")}
          value={data.degree}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your Degree"
        />
      </div>
      <div className="w-full mb-4">
        <label htmlFor="field">Field of Study*</label>
        <input
          onChange={(e) => onChangeHandler(e, "field_of_study")}
          value={data.field_of_study}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter your Field of Study"
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
      <div className="flex justify-between">
        <button
          onClick={handleAddEducation}
          className="bg-blue-500 text-white w-fit cursor-pointer rounded-full px-3 py-1"
        >
          Save
        </button>
        {updateEdu?.clicked && (
          <button
            onClick={handleDeleteEducation}
            className="bg-red-500 text-white w-fit cursor-pointer rounded-full px-3 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default EduModal;
