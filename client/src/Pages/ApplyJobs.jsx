import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const ApplyJob = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState([]);

  // ✅ Fetch user's applied jobs
  const fetchUserApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/applied-jobs`, {
        withCredentials: true,
      });
      if (data?.success) {
        setUserApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  // ✅ Fetch job details
  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data?.success) setJobData(data.job);
      else toast.error(data?.message || "Failed to fetch job details");
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Something went wrong while fetching the job.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Apply button (opens modal)
  const handleApplyClick = () => {
    if (isAlreadyApplied) return;

    // ✅ Normalize questions
    const questions = Array.isArray(jobData?.questions)
      ? jobData.questions.filter((q) => q?.question?.trim() !== "")
      : [];

    if (questions.length > 0) {
      setShowModal(true);
    } else {
      applyHandler({});
    }
  };
  // ✅ Submit Application + Answers
  const applyHandler = async (answersObj) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/apply`,
        { jobId: jobData._id, answers: answersObj },
        { withCredentials: true }
      );

      if (data?.success) {
        toast.success(data.message || "Applied successfully!");
        setIsAlreadyApplied(true);
        setShowModal(false);
        fetchUserApplications();
      } else {
        toast.error(data?.message || "Failed to apply.");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if user already applied
  const checkAlreadyApplied = () => {
    if (!jobData?._id || userApplications.length === 0) return;
    const hasApplied = userApplications.some(
      (app) => app?.jobId?._id === jobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  useEffect(() => {
    fetchUserApplications();
  }, []);

  useEffect(() => {
    checkAlreadyApplied();
  }, [jobData, userApplications]);

  if (loading) return <Loading fullscreen />;
  if (!jobData)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg text-gray-600">
        No job details found.
      </div>
    );

  // ✅ Handle answer change
  const handleAnswerChange = (index, question, answer) => {
    setAnswers((prevAnswers) => {
      const existingIndex = prevAnswers.findIndex(
        (ans) => ans.question === question
      );
      if (existingIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingIndex] = { question, answer };
        return updatedAnswers;
      }
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = { question, answer };
      return updatedAnswers;
    });
  };

  // ✅ Handle modal submission
  const handleSubmitAnswers = () => {
    setLoading(true);
    try {
      if (Object.keys(answers).length < jobData?.questions?.length) {
        return toast.error("Please answer all questions before submitting.");
      }
      applyHandler(answers);
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Something went wrong while submitting your answers.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullscreen />;

  return (
    <>
      <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-10 bg-gray-100">
        <div className=" text-black rounded-lg w-full">
          {/* Header section */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData?.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <BusinessIcon fontSize="small" />
                    {jobData?.companyId?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <LocationOnIcon fontSize="small" />
                    {jobData?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUpIcon fontSize="small" />
                    {jobData?.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={handleApplyClick}
                className={`p-2.5 px-10 text-white rounded cursor-pointer ${
                  isAlreadyApplied
                    ? "bg-gray-500"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isAlreadyApplied}
              >
                {isAlreadyApplied ? "Already Applied" : "Easy Apply"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData?.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <div>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{
                    __html:
                      jobData?.description ||
                      "<p>No description available.</p>",
                  }}
                ></div>
                <button
                  onClick={handleApplyClick}
                  className={`mt-10 p-2.5 px-10 text-white rounded ${
                    isAlreadyApplied
                      ? "bg-gray-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isAlreadyApplied}
                >
                  {isAlreadyApplied ? "Already Applied" : "Easy Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal for questions */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80  flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-lg w-[90%] max-w-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Answer the Questions
            </h2>
            {jobData?.questions?.length > 0 ? (
              jobData.questions.map((q, index) => (
                <div key={index} className="mb-3">
                  <p className="font-medium mb-1">{q.question}</p>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    value={answers[index]?.answer || ""}
                    onChange={(e) =>
                      handleAnswerChange(index, q.question, e.target.value)
                    }
                  />
                </div>
              ))
            ) : (
              <p>No additional questions for this job.</p>
            )}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAnswers}
                className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyJob;
