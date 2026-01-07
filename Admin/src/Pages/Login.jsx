import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/login`,
        loginField
      );

      console.log("Login response:", res.data);
      toast.success("Login successful!");
      props.changeLoginvalue?.(true); // optional callback
      localStorage.setItem("isLogin", true);
      localStorage.setItem("userData", JSON.stringify(res.data.company));
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-lg box-border p-10 bg-white">
        <div className="text-3xl mb-5 text-center font-semibold text-gray-800">
          Welcome Back Admin!
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg text-lg px-5 py-2 mt-1"
              placeholder="Enter your email address"
              value={loginField.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg text-lg px-5 py-2 mt-1"
              placeholder="Enter your password"
              value={loginField.password}
              onChange={(e) => handleChange(e, "password")}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-800 hover:bg-blue-900 py-3 px-4 text-white rounded-full cursor-pointer text-center text-lg font-medium mt-4"
          >
            Login
          </button>
        </div>
      </div>

      <div className="mt-4 text-gray-700">
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="text-blue-600 hover:underline font-medium"
        >
          Join now
        </Link>
      </div>
    </div>
  );
};

export default Login;
