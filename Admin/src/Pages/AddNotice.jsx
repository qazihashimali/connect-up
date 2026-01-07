import React, { useEffect, useState } from "react";
import { Trash, X, Edit } from "lucide-react";
import axios from "axios";
import Loading from "../Components/Loading";

const AddNotice = () => {
  const companyToken = localStorage.getItem("token");
  const [notice, setNotice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "Low",
    date: new Date().toISOString().split("T")[0],
    active: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "General",
      priority: "Low",
      date: new Date().toISOString().split("T")[0],
      active: true,
    });
    setEditMode(false);
    setEditNoticeId(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const priorityMap = {
        Low: 1,
        Medium: 2,
        High: 3,
        Critical: 4,
      };

      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category.toLowerCase(),
        priority: priorityMap[formData.priority] || 1,
        expiryDate: formData.date,
        isActive: formData.active,
        attachments: [],
      };

      if (editMode) {
        // Update existing notice
        const { data } = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/notice/update/${editNoticeId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${companyToken}`,
            },
          }
        );

        if (data.success) {
          setNotice((prev) =>
            prev.map((n) => (n._id === editNoticeId ? data.notice : n))
          );
          setShowModal(false);
          resetForm();
        }
      } else {
        // Create new notice
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/notice/create-notice`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${companyToken}`,
            },
          }
        );

        if (data.success) {
          setNotice((prev) => [data.data, ...prev]);
          setShowModal(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllNotices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notice/get-all-notices`,
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );

      setNotice(data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (noticeItem) => {
    const priorityNameMap = {
      1: "Low",
      2: "Medium",
      3: "High",
      4: "Critical",
    };

    setEditMode(true);
    setEditNoticeId(noticeItem._id);
    setFormData({
      title: noticeItem.title,
      content: noticeItem.content,
      category:
        noticeItem.category.charAt(0).toUpperCase() +
        noticeItem.category.slice(1),
      priority: priorityNameMap[noticeItem.priority] || "Low",
      date: noticeItem.expiryDate || new Date().toISOString().split("T")[0],
      active: noticeItem.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notice/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );

      if (data.success) {
        setNotice((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.error(
        "Error deleting notice:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  useEffect(() => {
    getAllNotices();
  }, []);

  if (loading) return <Loading fullscreen />;

  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-3 font-medium max-sm:hidden">#</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Category</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Posted On</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notice?.length > 0 ? (
              notice.map((noticeItem, index) => (
                <tr
                  key={noticeItem._id}
                  className="hover:bg-gray-50 transition-all border-t border-gray-100 text-gray-700"
                >
                  <td className="px-4 py-3 max-sm:hidden text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {noticeItem.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-sm:hidden capitalize">
                    {noticeItem.category}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                    {new Date(noticeItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <Edit
                        onClick={() => handleEdit(noticeItem)}
                        size={20}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
                      />
                      <Trash
                        onClick={() => handleDelete(noticeItem._id)}
                        size={20}
                        className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No Notices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#662d91] text-white px-5 py-2 rounded-full cursor-pointer transition-all shadow-sm hover:bg-[#552576]"
        >
          Create Notice
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? "Edit Notice" : "Create Notice"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Notice Title */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  Notice Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Important Update..."
                  className="w-full px-4 py-3 border-2 border-[#662d91] rounded-xl focus:outline-none focus:border-[#662d91] transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter the details of the notice here..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-[#662d91] rounded-xl focus:outline-none focus:border-[#662d91] transition-colors resize-none bg-gray-50"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#662d91] rounded-xl focus:outline-none focus:border-[#662d91] transition-colors bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option>General</option>
                    <option>Announcement</option>
                    <option>Urgent</option>
                    <option>Event</option>
                    <option>Policy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#662d91] rounded-xl focus:outline-none focus:border-[#662d91] transition-colors bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-[#662d91] rounded-xl focus:outline-none focus:border-[#662d91] transition-colors bg-gray-50 cursor-pointer"
                />
              </div>

              {/* Active Status Toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-gray-800 font-semibold text-lg">
                    Active Status
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Show this notice on dashboard
                  </p>
                </div>
                <button
                  onClick={handleToggle}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    formData.active ? "bg-[#662d91]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      formData.active ? "translate-x-8" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Publish/Update Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#662d91] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#552576] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : editMode
                  ? "Update Notice"
                  : "Publish Notice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNotice;
