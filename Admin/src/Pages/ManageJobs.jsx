import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Get backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Get token directly from localStorage
  const companyToken = localStorage.getItem("token");

  // ✅ Fetch company jobs
  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      console.log("Fetch jobs response:", data);

      if (data.success) {
        setJobs(data.jobsData.reverse());
        console.log("Fetched Jobs:", data.jobsData);
      } else {
        toast.error(data.message || "Failed to load jobs");
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error(error.response?.data?.message || "Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle visibility
  const changeJobVisibility = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );

      if (data.success) {
        toast.success("Job visibility updated");
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === id ? { ...job, visible: !job.visible } : job
          )
        );
      } else {
        toast.error(data.message || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Visibility change error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  if (loading) return <Loading fullscreen />;
  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-3 font-medium max-sm:hidden">#</th>
              <th className="px-4 py-3 font-medium">Job Title</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Date</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Location</th>
              <th className="px-4 py-3 font-medium text-center">Applicants</th>
              <th className="px-4 py-3 font-medium text-center">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr
                  key={job._id}
                  className="hover:bg-gray-50 transition-all border-t border-gray-100 text-gray-700"
                >
                  <td className="px-4 py-3 max-sm:hidden text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {job.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                    {job.location || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-700">
                    {job.applicants}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      onChange={() => changeJobVisibility(job._id)}
                      className="scale-125 cursor-pointer accent-[#662d91]"
                      type="checkbox"
                      checked={job.visible}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/add-job")}
          className="bg-[#662d91] text-white px-5 py-2 rounded-full cursor-pointer transition-all shadow-sm"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
