import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { Link } from "react-router-dom";
import Googlelogin from "../Components/GoogleLogin";

const LandingPage = (props) => {
  return (
    <div className="my-4 py-[50px] md:pl-[120px] px-5 md:flex justify-between items-center gap-12">
      {/* Left Section */}
      <div className="md:w-[40%] flex flex-col items-start">
        {/* Heading */}
        <h1 className="text-4xl text-gray-500 font-semibold leading-snug mb-6">
          Welcome to your <br /> Professional Community
        </h1>

        {/* Google Sign-in */}
        <div className="mb-3 w-full max-w-sm">
          <Googlelogin changeLoginvalue={props.changeLoginvalue} />
        </div>

        {/* Email Sign-in */}
        <Link
          to="/login"
          className="flex items-center mb-3 w-full max-w-sm bg-white py-2 px-4 rounded-full  cursor-pointer border border-gray-300 hover:bg-blue-50"
        >
          {/* Email icon on the left */}
          <img
            src="https://cdn-icons-png.flaticon.com/128/5968/5968534.png"
            alt="Email"
            className="w-5 h-5 mr-3"
          />
          {/* Text stays centered-ish with flex-grow */}
          <span className="text-sm  flex-grow text-center">
            Sign in with Email
          </span>
        </Link>
        {/* Privacy Text */}
        <p className="text-sm text-gray-500 mt-5 max-w-sm">
          By continuing, you agree to our{" "}
          <Link to="#" className="text-blue-600 hover:underline">
            User Agreement
          </Link>{" "}
          and{" "}
          <Link to="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Join Now Link */}
        <p className="mt-5 text-gray-700 text-sm">
          New to our community?{" "}
          <Link
            to="/sign-up"
            className="text-blue-600 font-medium hover:underline"
          >
            Join Now
          </Link>
        </p>
      </div>

      {/* Right Section - Image */}
      <div className="md:w-[50%] mt-10 md:mt-0">
        <img
          src="https://avatars.mds.yandex.net/i?id=7b397c017a6d029f145dcff50944e3e7_l-5241638-images-thumbs&ref=rim&n=13&w=1300&h=745"
          alt="Professional Community"
          className="w-full h-auto rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default LandingPage;
