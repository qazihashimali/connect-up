import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./Layout/AdminLayout";
import Login from "./Pages/Login";
import SignUp from "./Pages/Signup";
import AddJob from "./Pages/AddJob";
import "quill/dist/quill.snow.css";
import ManageJobs from "./Pages/ManageJobs";
import ViewApplications from "./Pages/ViewApplications";
import AddNotice from "./Pages/AddNotice";

const App = () => {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));

  const changeLoginvalue = (value) => {
    setIsLogin(value);
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* ✅ Public (Auth) Routes */}
        <Route
          path="/"
          element={
            isLogin ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login changeLoginvalue={changeLoginvalue} />
            )
          }
        />
        <Route
          path="/sign-up"
          element={
            isLogin ? (
              <Navigate to="/dashboard" />
            ) : (
              <SignUp changeLoginvalue={changeLoginvalue} />
            )
          }
        />

        {/* ✅ Protected Admin Routes */}
        <Route element={isLogin ? <AdminLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/add-notice" element={<AddNotice />} />
          <Route path="/applications" element={<ViewApplications />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
