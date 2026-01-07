// import React from "react";
// import { GoogleLogin } from "@react-oauth/google";

// const Googlelogin = () => {
//   const handleOnSuccess = (credentialResponse) => {
//     console.log("Login Success: currentUser:", credentialResponse);
//   };

//   const login = GoogleLogin({
//     onSuccess: (credentialResponse) => {
//       handleOnSuccess(credentialResponse);
//     },
//     onError: () => {
//       console.log("Login Failed");
//     },
//   });
//   return (
//     <div className="w-full">
//       <button
//         onClick={login}
//         className="mb-3 w-full max-w-sm bg-white py-3 px-4 rounded-3xl text-center text-black cursor-pointer border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
//       >
//         Continue with Google
//       </button>
//     </div>
//   );
// };

// export default Googlelogin;

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Googlelogin = (props) => {
  const navigate = useNavigate();
  const handleOnSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
      { token },
      { withCredentials: true }
    );
    console.log(res);
    toast.success("Login successful!");
    localStorage.setItem("isLogin", true);
    localStorage.setItem("userInfo", JSON.stringify(res.data.user));
    props.changeLoginvalue(true);
    navigate("/feed");
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleOnSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
        width="100%"
        size="large"
        shape="pill"
        text="large"
      />
    </div>
  );
};

export default Googlelogin;
