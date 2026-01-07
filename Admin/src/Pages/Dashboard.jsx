import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const companyToken = localStorage.getItem("token");

  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      if (data.success) {
        setJobs(data.jobsData || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobs();
  }, [companyToken]);

  // ✅ Dashboard Stats
  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce(
    (acc, job) => acc + (job.applicants || 0),
    0
  );
  const activeJobs = jobs.filter((job) => job.visible === true).length;
  const hiddenJobs = jobs.filter((job) => job.visible === false).length;

  if (loading) return <Loading fullscreen />;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 rounded-2xl">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-blue-600">{totalJobs}</h2>
          <p className="text-gray-600 mt-2">Total Jobs</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-green-600">{activeJobs}</h2>
          <p className="text-gray-600 mt-2">Active Jobs</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-red-600">{hiddenJobs}</h2>
          <p className="text-gray-600 mt-2">In-Active Jobs</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-purple-600">
            {totalApplicants}
          </h2>
          <p className="text-gray-600 mt-2">Total Applicants</p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="mt-10 bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>

        {jobs.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 no-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Level</th>
                  <th className="p-3 text-left">Applicants</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">{job.category}</td>
                    <td className="p-3">{job.level}</td>
                    <td className="p-3">{job.applicants}</td>
                    <td className="p-3">
                      {job.visible ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          In-Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No jobs available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
