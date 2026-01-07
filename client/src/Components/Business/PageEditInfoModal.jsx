import React, { useState } from "react";

const PageEditInfoModal = ({ handleEditFunction, pageData, closeModal }) => {
  const [data, setData] = useState({
    name: pageData.name || "",
    tagline: pageData.tagline || "",
    industry: pageData.industry || "",
    website: pageData.website || "",
    linkedinUrl: pageData.linkedinUrl || "",
    type: pageData.type || "",
    size: pageData.size || "",
    organizationType: pageData.organizationType || "",
    founded: pageData.founded || "",
  });

  const onChangeHandler = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleUpdate = async () => {
    let newData = { ...pageData, ...data };
    handleEditFunction(newData);
    closeModal();
  };

  return (
    <div className="mt-8 w-full max-h-[50vh] overflow-y-auto">
      <div className="w-full mb-4">
        <label htmlFor="name">Page Name*</label>
        <input
          onChange={(e) => onChangeHandler(e, "name")}
          value={data.name}
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter page name"
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="tagline">Tagline*</label>
        <textarea
          onChange={(e) => onChangeHandler(e, "tagline")}
          value={data.tagline}
          cols={10}
          rows={2}
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter tagline"
        ></textarea>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="industry">Industry*</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="Enter industry"
          onChange={(e) => onChangeHandler(e, "industry")}
          value={data.industry}
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="https://example.com"
          onChange={(e) => onChangeHandler(e, "website")}
          value={data.website}
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="linkedinUrl">LinkedIn URL</label>
        <input
          type="url"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="https://linkedin.com/company/..."
          onChange={(e) => onChangeHandler(e, "linkedinUrl")}
          value={data.linkedinUrl}
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="type">Company Type*</label>
        <select
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          onChange={(e) => onChangeHandler(e, "type")}
          value={data.type}
        >
          <option value="">Select type</option>
          <option value="Public Company">Public Company</option>
          <option value="Private Company">Private Company</option>
          <option value="Non-profit">Non-profit</option>
          <option value="Startup">Startup</option>
          <option value="Educational">Educational</option>
          <option value="Government">Government</option>
        </select>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="size">Company Size*</label>
        <select
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          onChange={(e) => onChangeHandler(e, "size")}
          value={data.size}
        >
          <option value="">Select size</option>
          <option value="1-10 employees">1-10 employees</option>
          <option value="11-50 employees">11-50 employees</option>
          <option value="51-200 employees">51-200 employees</option>
          <option value="201-500 employees">201-500 employees</option>
          <option value="501-1000 employees">501-1000 employees</option>
          <option value="1001-5000 employees">1001-5000 employees</option>
          <option value="5001-10000 employees">5001-10000 employees</option>
          <option value="10000+ employees">10000+ employees</option>
        </select>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="organizationType">Organization Type*</label>
        <select
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          onChange={(e) => onChangeHandler(e, "organizationType")}
          value={data.organizationType}
        >
          <option value="">Select organization type</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Partnership">Partnership</option>
          <option value="Privately Held">Privately Held</option>
          <option value="Public Company">Public Company</option>
          <option value="Non-profit">Non-profit</option>
          <option value="Educational Institution">
            Educational Institution
          </option>
          <option value="Government Agency">Government Agency</option>
        </select>
      </div>

      {/* <div className="w-full mb-4">
        <label htmlFor="founded">Founded Year</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
          placeholder="e.g., 2020"
          onChange={(e) => onChangeHandler(e, "founded")}
          value={data.founded}
          min="1800"
          max={new Date().getFullYear()}
        />
      </div> */}

      <button
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-600 text-white w-fit cursor-pointer rounded-full px-5 py-2"
      >
        Save
      </button>
    </div>
  );
};

export default PageEditInfoModal;
