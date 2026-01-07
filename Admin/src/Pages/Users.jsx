import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../Components/Loading";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const companyToken = localStorage.getItem("token");

  // ✅ Fetch company users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/get-all-users`,
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );

      console.log("Fetched Users:", data);

      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) return <Loading fullscreen />;
  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left">
              <th className="px-4 py-3 font-medium max-sm:hidden">#</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Email</th>
              <th className="px-4 py-3 font-medium">Current Company</th>
              <th className="px-4 py-3 font-medium text-center">
                Current Location
              </th>
              <th className="px-4 py-3 font-medium max-sm:hidden">Joined</th>
            </tr>
          </thead>

          <tbody>
            {users?.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-all border-t border-gray-100 text-gray-700"
                >
                  <td className="px-4 py-3 max-sm:hidden text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.f_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {user.curr_company}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.curr_location}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-sm:hidden">
                    {moment(user.createdAt).format("ll")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
