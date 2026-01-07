import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Googlelogin from "../Components/GoogleLogin";
import { toast } from "react-toastify";
import axios from "axios";

const Login = (props) => {
  const [loginField, setLoginField] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e, key) => {
    setLoginField({ ...loginField, [key]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      if (!loginField.email.trim() || !loginField.password.trim()) {
        toast.error("Please fill all the fields");
        return; // stop execution
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        loginField,
        { withCredentials: true }
      );

      // Success handling (optional)
      toast.success("Login successful!");
      props.changeLoginvalue(true);
      localStorage.setItem("isLogin", true);
      localStorage.setItem("userInfo", JSON.stringify(res.data.userExist));
      navigate("/feed");

      console.log("Login response:", res.data);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-4xl mb-5">Welcome Back</div>

      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box-border p-10">
        {/* Google Sign-in */}
        <div className="mb-3 w-full max-w-sm">
          <Googlelogin changeLoginvalue={props.changeLoginvalue} />
        </div>

        <div className="flex items-center gap-2 my-5">
          <div className="border-b border-gray-400 w-[45%]" />
          <div>or</div>
          <div className="border-b border-gray-400 w-[45%]" />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
              placeholder="Enter your email address"
              value={loginField.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg text-xl px-5 py-1"
              placeholder="Enter your password"
              value={loginField.password}
              onChange={(e) => handleChange(e, "password")}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-800 hover:bg-blue-900 py-3 px-4 text-white rounded-full cursor-pointer text-center text-xl my-2"
          >
            Login
          </button>
        </div>
      </div>

      <div className="mt-4 mb-10">
        New to Linkedin?{" "}
        <Link to="/sign-up" className="text-blue-600 hover:underline">
          Join now
        </Link>
      </div>
    </div>
  );
};

export default Login;
