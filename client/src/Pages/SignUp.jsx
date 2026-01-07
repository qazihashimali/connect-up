import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Googlelogin from "../Components/GoogleLogin";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = (props) => {
  const [registerField, setRegisterField] = useState({
    email: "",
    password: "",
    f_name: "",
  });

  const navigate = useNavigate();
  const handleChange = (e, key) => {
    setRegisterField({ ...registerField, [key]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      if (
        !registerField.email.trim() ||
        !registerField.password.trim() ||
        !registerField.f_name.trim()
      ) {
        alert("Please fill all the fields");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        registerField
      );
      toast.success("Registration successful! Please log in.");
      setRegisterField({
        ...registerField,
        email: "",
        password: "",
        f_name: "",
      });
      navigate("/login");
      console.log("Registration response:", res.data);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-4xl mb-5">
        Make the most of your professional life
      </div>
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box-border p-10">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
              placeholder="Enter your full name"
              value={registerField.f_name}
              onChange={(e) => handleChange(e, "f_name")}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
              placeholder="Enter your email address"
              value={registerField.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </div>
          <div>
            <label htmlFor="name">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
              placeholder="Enter your password"
              value={registerField.password}
              onChange={(e) => handleChange(e, "password")}
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-blue-800 hover:bg-blue-900 py-3 px-4 text-white rounded-full cursor-pointer text-center text-xl my-2"
          >
            Register
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-b-1 border-gray-400 w-[45%]" /> <div>or</div>{" "}
          <div className="border-b-1 border-gray-400 w-[45%] my-6" />
        </div>
        {/* Google Sign-in */}
        <div className="mb-3 w-full max-w-sm">
          <Googlelogin changeLoginvalue={props.changeLoginvalue} />
        </div>
      </div>
      <div className="mt-4 mb-10">
        Already on Linkedin?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
