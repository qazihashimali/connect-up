import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profilecard from "../Components/Profilecard";
import Advertisement from "../Components/Advertisement";
import axios from "axios";
import Loading from "../Components/Loading";
import moment from "moment";

const Jobs = () => {
  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get stored user
    const storedUser = localStorage.getItem("userInfo");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUserData(parsedUser);
    console.log("====================================");
    console.log(parsedUser);
    console.log("====================================");

    // Fetch jobs from backend
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/jobs`
        );

        console.log("Fetched Jobs:", data);

        if (data.success) {
          setJobs(data.jobs.reverse());
        } else {
          console.error("Failed to load jobs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (parsedUser) fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/apply-job/${jobId}`);
  };
  console.log(jobs);
  if (loading) return <Loading fullscreen />;

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit sticky top-19">
          <Profilecard data={userData} />
        </div>
      </div>

      {/* Middle side */}
      <div className="w-[100%] sm:w-[50%] py-5">
        <h2 className="text-2xl font-semibold mb-5">
          Jobs you might be interested in
        </h2>

        {jobs?.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {jobs?.map((job) => (
              <div
                key={job._id}
                onClick={() => handleJobClick(job._id)}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.companyId.name}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {moment(job.postedAt).format("ll")}
                  </span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {job.level}
                  </span>
                </div>
                {/* <p className="text-xs text-gray-400 mt-1">
                  Applicants: {job.applicants || 0}
                </p> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="w-[26%] py-5 hidden md:block">
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Jobs;
