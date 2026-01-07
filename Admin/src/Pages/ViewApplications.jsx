import axios from "axios";
import { ArrowDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { toast } from "react-toastify";

const ViewApplications = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [applicants, setApplicants] = useState([]);

  // For modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCompanyJobApplications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(data.applications.reverse());
      console.log("Applications fetched:", data.applications);
    } catch (error) {
      console.error("Fetch applications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        fetchCompanyJobApplications();
        toast.success(`Application ${status}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Change status error:", error);
      toast.error("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (token) fetchCompanyJobApplications();
  }, [token]);

  if (loading) return <Loading fullscreen />;

  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto relative h-[600px] overflow-visible">
        <table className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-visible text-sm relative z-0">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">User Name</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Job Title</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Location</th>
              <th className="px-4 py-3 font-medium">Resume</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {applicants?.map((applicant, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-all border-t border-gray-100 relative"
              >
                <td className="px-4 py-3 text-center text-gray-500">
                  {index + 1}
                </td>

                <td className="px-4 py-3 flex items-center">
                  <img
                    className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                    src={applicant.userId.profile_pic}
                    alt={applicant.userId.f_name}
                  />
                  <span className="font-medium text-gray-800">
                    {applicant.userId.f_name}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                  {applicant.jobId.title}
                </td>

                <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                  {applicant?.userId?.curr_location}
                </td>

                <td className="px-4 py-3">
                  <a
                    href={applicant.userId.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg inline-flex gap-2 items-center hover:bg-blue-100 transition-all"
                  >
                    Resume <ArrowDown width={16} />
                  </a>
                </td>

                {/* Action Column */}
                <td className="px-4 py-3 text-right relative">
                  {applicant.status === "Pending" ? (
                    <div className="relative inline-block text-left group">
                      {/* Trigger */}
                      <button className="text-gray-600 font-bold text-lg px-2 cursor-pointer hover:text-gray-800">
                        ⋮
                      </button>

                      {/* Dropdown */}
                      <div className="absolute right-0 top-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-[9999]">
                        <button
                          onClick={() =>
                            updateApplicationStatus(applicant._id, "Accepted")
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-gray-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            updateApplicationStatus(applicant._id, "Rejected")
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => openDetailsModal(applicant)}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-50"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>{applicant.status}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Details Modal */}
      {isModalOpen && selectedApplicant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[99999]">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-1 text-gray-800">
              {selectedApplicant.jobId.title}
            </h2>
            <p className="text-gray-600 mb-4">
              Applicant:{" "}
              <span className="font-medium">
                {selectedApplicant.userId.f_name}
              </span>
            </p>

            <div className="border-t border-gray-200 pt-3 space-y-3 max-h-80 overflow-y-auto">
              {selectedApplicant.answers.length > 0 ? (
                selectedApplicant.answers.map((ans, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-800">
                      Q{i + 1}: {ans.question}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <span className="font-semibold">Answer:</span>{" "}
                      {ans.answer || "No answer provided"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No answers available.</p>
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
