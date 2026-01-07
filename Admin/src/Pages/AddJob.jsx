import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import axios from "axios";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Karachi");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);
  const [questions, setQuestions] = useState([{ question: "", type: "text" }]);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const JobCategories = [
    "Programming",
    "Design",
    "Marketing",
    "Finance",
    "Sales",
    "Human Resources",
    "Customer Support",
    "Project Management",
    "Data Science",
    "Operations",
  ];

  const JobLocations = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Hyderabad",
    "Sialkot",
    "Remote",
  ];

  // ✅ Add, remove, and handle question input
  const addQuestion = () => {
    setQuestions([...questions, { question: "", type: "text" }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // ✅ Submit Job
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const description = quillRef.current.root.innerHTML;
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/post-job`,
        { title, description, location, category, level, salary, questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Job posted successfully!");
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
        setQuestions([{ question: "", type: "text" }]);
      } else {
        console.log(res.data.message);
        toast.error(res.data.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="container p-4 flex flex-col w-full items-start gap-4 overflow-y-auto"
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <div className="w-full">
        <p className="my-2 font-medium">Job Title</p>
        <input
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
          type="text"
          placeholder="Type your job title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      <div className="w-full max-w-lg">
        <p className="my-2 font-medium">Job Description</p>
        <div
          ref={editorRef}
          className="border border-gray-300 rounded p-2"
        ></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 font-medium">Job Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium">Job Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium">Job Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
          >
            <option value="Intern">Intern</option>
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 font-medium">Job Salary</p>
        <input
          min={0}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          type="number"
          placeholder="25000"
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
          required
        />
      </div>

      {/* ✅ Add Screening Questions */}
      <div className="w-full max-w-lg mt-6">
        <p className="font-medium mb-3">Add Screening Questions (Optional)</p>

        {questions.map((q, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter a question"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(index, "question", e.target.value)
              }
            />
            <select
              className="border border-gray-300 rounded px-2 py-2"
              value={q.type}
              onChange={(e) =>
                handleQuestionChange(index, "type", e.target.value)
              }
            >
              <option value="text">Text</option>
              <option value="yesno">Yes/No</option>
              <option value="select">Multiple Choice</option>
            </select>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="text-blue-600 font-medium hover:underline"
        >
          + Add another question
        </button>
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-[#662d91] text-white rounded cursor-pointer transition"
      >
        ADD
      </button>
    </form>
  );
};

export default AddJob;
