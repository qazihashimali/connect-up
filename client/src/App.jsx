import React, { useState } from "react";
import NavbarV1 from "./Components/NavbarV1";
import LandingPage from "./Pages/LandingPage";
import Footer from "./Components/Footer";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import NavbarV2 from "./Components/NavbarV2";
import Feed from "./Pages/Feed";
import MyNetwork from "./Pages/MyNetwork";
import Resume from "./Pages/Resume";
import Messages from "./Pages/Messages";
import Profile from "./Pages/Profile";
import Activites from "./Pages/Activites";
import SingleActivity from "./Pages/SingleActivity";
import Notification from "./Pages/Notification";
import { ToastContainer } from "react-toastify";
import Jobs from "./Pages/Jobs";
import ApplyJobs from "./Pages/ApplyJobs";
import BusinessTypeSelection from "./Pages/Business/BusinessTypeSelection";
import CreateCompany from "./Pages/Business/CreateCompany";
import Personal from "./Pages/Business/Personal";
import Institute from "./Pages/Business/Institute";
import PageDetails from "./Pages/Business/PageDetails";

const App = () => {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));

  const changeLoginvalue = (value) => {
    setIsLogin(value);
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-100 w-[100%] min-h-screen box-border">
        {isLogin ? <NavbarV2 /> : <NavbarV1 />}

        <Routes>
          <Route
            path="/"
            element={
              isLogin ? (
                <Navigate to="/feed" />
              ) : (
                <LandingPage changeLoginvalue={changeLoginvalue} />
              )
            }
          />
          <Route
            path="/sign-up"
            element={
              isLogin ? (
                <Navigate to="/feed" />
              ) : (
                <SignUp changeLoginvalue={changeLoginvalue} />
              )
            }
          />
          <Route
            path="/login"
            element={
              isLogin ? (
                <Navigate to="/feed" />
              ) : (
                <Login changeLoginvalue={changeLoginvalue} />
              )
            }
          />
          <Route
            path="/feed"
            element={isLogin ? <Feed /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-network"
            element={isLogin ? <MyNetwork /> : <Navigate to="/login" />}
          />
          <Route
            path="/resume"
            element={isLogin ? <Resume /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={isLogin ? <Messages /> : <Navigate to="/login" />}
          />
          <Route
            path="/jobs"
            element={isLogin ? <Jobs /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id"
            element={isLogin ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id/activities"
            element={isLogin ? <Activites /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id/activities/:postId"
            element={isLogin ? <SingleActivity /> : <Navigate to="/login" />}
          />
          <Route
            path="/apply-job/:id"
            element={isLogin ? <ApplyJobs /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={isLogin ? <Notification /> : <Navigate to="/login" />}
          />

          {/* Business Routes can be added here */}

          <Route path="/business" element={<BusinessTypeSelection />} />
          <Route path="/company" element={<CreateCompany />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/institute" element={<Institute />} />
          <Route path="/page/:id" element={<PageDetails />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
