import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignUp = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);

  const [registerField, setRegisterField] = useState({
    f_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e, key) => {
    setRegisterField({ ...registerField, [key]: e.target.value });
  };

  const handleNext = () => {
    const { f_name, email, password } = registerField;
    if (!f_name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all the fields");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    try {
      if (!image) {
        toast.error("Please upload your company logo");
        return;
      }

      const formData = new FormData();
      formData.append("name", registerField.f_name);
      formData.append("email", registerField.email);
      formData.append("password", registerField.password);
      formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/company/register`,
        formData
      );

      if (data.success) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-gray-50">
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-lg box-border p-10 bg-white">
        <div className="text-3xl text-center mb-5 font-semibold text-gray-800">
          Create Your Admin Account
        </div>
        {step === 1 ? (
          <>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg text-lg px-4 py-2"
                  placeholder="Enter your full name"
                  value={registerField.f_name}
                  onChange={(e) => handleChange(e, "f_name")}
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg text-lg px-4 py-2"
                  placeholder="Enter your email address"
                  value={registerField.email}
                  onChange={(e) => handleChange(e, "email")}
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg text-lg px-4 py-2"
                  placeholder="Enter your password"
                  value={registerField.password}
                  onChange={(e) => handleChange(e, "password")}
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-800 hover:bg-blue-900 py-3 px-4 text-white rounded-full cursor-pointer text-center text-xl my-2"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-lg mb-5">
              Upload Your Company Logo
            </div>
            <div className="flex flex-col items-center gap-4">
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center"
              >
                <img
                  className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
                  src={image ? URL.createObjectURL(image) : ""}
                  alt=""
                />
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <span className="text-gray-500 text-sm mt-2">
                  Click to upload logo
                </span>
              </label>

              <button
                onClick={handleRegister}
                className="w-full bg-blue-800 hover:bg-blue-900 py-3 px-4 text-white rounded-full text-xl"
              >
                Register
              </button>

              <button
                onClick={() => setStep(1)}
                className="text-blue-600 text-sm underline mt-3"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 mb-10">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
