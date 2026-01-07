import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Institute = () => {
  const [formData, setFormData] = useState({
    type: "institute",
    name: "",
    linkedinUrl: "",
    website: "",
    industry: "",
    size: "",
    organizationType: "",
    tagline: "",
    logo: "",
  });

  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const isFormValid =
    formData.name && formData.linkedinUrl && formData.industry && formData.size;

  const handleSubmit = async () => {
    if (!isFormValid) return toast.error("Please fill all required fields!");
    if (!logo) return toast.error("Please upload a company logo!");

    setLoading(true);

    try {
      const data = new FormData();
      data.append("type", "institute");
      data.append("name", formData.name);
      data.append("linkedinUrl", formData.linkedinUrl);
      data.append("website", formData.website);
      data.append("industry", formData.industry);
      data.append("size", formData.size);
      data.append("organizationType", formData.organizationType);
      data.append("tagline", formData.tagline);
      data.append("image", logo);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/page`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Institute page created successfully!");
        navigate("/business");
      } else {
        toast.error(response.data.message || "Error creating company page");
      }
    } catch (error) {
      console.error("Error creating company page:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 mt-20">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-[60%_40%] gap-10">
        {/* --- Left Side: Form --- */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-400">
            <ArrowLeft
              onClick={() => navigate("/business")}
              className="inline-block mr-1 mb-1 cursor-pointer"
            />{" "}
            Let’s get started with a few details about your Institute
          </h2>

          <div className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block font-medium mb-1">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInput}
                placeholder="Add your organization’s name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block font-medium mb-1">
                LinkedIn.com/institute/*
              </label>
              <input
                type="text"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInput}
                placeholder="Add your unique LinkedIn address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block font-medium mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInput}
                placeholder="Begin with http:// or https://"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block font-medium mb-1">Industry*</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              >
                <option value="">Select industry</option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
              </select>
            </div>

            {/* Organization Size */}
            <div>
              <label className="block font-medium mb-1">
                Organization Size*
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              >
                <option value="">Select size</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="201-500">201–500</option>
                <option value="501-1000">501–1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>

            {/* Organization Type */}
            <div>
              <label className="block font-medium mb-1">
                Organization Type
              </label>
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              >
                <option value="">Select type</option>
                <option value="Public Company">Public Company</option>
                <option value="Private Company">Private Company</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="Government Agency">Government Agency</option>
              </select>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block font-medium mb-1">Logo</label>
              <div className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-3 py-6 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  name="logo"
                  onChange={handleLogoUpload}
                  className="text-sm text-gray-600"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Recommended (JPG, JPEG, PNG)
              </p>
            </div>

            {/* Tagline */}
            <div>
              <label className="block font-medium mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInput}
                placeholder="e.g. Helping small businesses succeed"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2">
              <input type="checkbox" id="verify" className="mt-1" />
              <label htmlFor="verify" className="text-sm text-gray-700">
                I verify that I am an authorized representative of this
                organization and have the right to act on its behalf.
              </label>
            </div>

            {/* Create Page Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                isFormValid
                  ? "bg-blue-800 text-white hover:bg-blue-900"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {loading ? "Creating..." : "Create Page"}
            </button>
          </div>
        </div>

        {/* --- Right Side: Live Preview --- */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Page Preview
          </h3>

          <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
            {/* Logo */}
            <div className="w-20 h-20 mx-auto bg-gray-100  rounded-md flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Logo</span>
              )}
            </div>

            {/* Company Name */}
            <h4 className="mt-3 font-bold text-gray-800 text-lg">
              {formData.name || "Institute name"}
            </h4>

            {/* Tagline */}
            <p className="text-sm text-gray-500 mt-1">
              {formData.tagline || "Tagline"}
            </p>

            {/* Industry */}
            <p className="text-xs text-gray-400 mt-1">
              {formData.industry || "Industry"}
            </p>

            {/* Follow Button */}
            <button className="mt-4 bg-blue-800 text-white text-sm px-5 py-1.5 rounded-full cursor-pointer transition">
              + Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Institute;
