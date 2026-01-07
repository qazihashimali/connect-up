import React from "react";
import { Building2, Layers, School } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessTypeSelection = () => {
  const navigate = useNavigate();

  const types = [
    {
      title: "Company",
      description: "Small, medium, and large businesses",
      icon: <Building2 size={36} className="text-blue-800" />,
      path: "/company",
    },
    {
      title: "Personal Page",
      description: "Sub-pages associated with an existing page",
      icon: <Layers size={36} className="text-blue-800" />,
      path: "/personal",
    },
    {
      title: "Educational Institution",
      description: "Schools and universities",
      icon: <School size={36} className="text-blue-800" />,
      path: "/institute",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 relative overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10 mt-10 z-10">
        <h1 className="text-3xl font-semibold text-gray-700">
          Create a Business Page
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
          Connect with clients, employees, and your community. To get started,
          choose a page type.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full z-10">
        {types.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-gray-400 transition-all duration-200"
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Mockup Section */}
      <div className="relative mt-24 w-full flex justify-center z-0">
        {/* Laptop mockup */}
        <img
          src="https://static.licdn.com/aero-v1/sc/h/ev2ewp91pnvtl0gcyt4xht0b5"
          alt="Laptop Mockup"
          className="w-[85%] md:w-[65%] max-w-4xl"
        />

        {/* Phone mockup (overlay) */}
        <img
          src="https://static.licdn.com/aero-v1/sc/h/3v3wzhnr3kapuzwpk1zt6r1jt"
          alt="Phone Mockup"
          className="
         absolute
      bottom-4 right-[15%] w-[80px]              
      sm:bottom-6 sm:right-[18%] sm:w-[100px]   
      md:bottom-10 md:right-[20%] md:w-[140px]  
      lg:bottom-14 lg:right-[22%] lg:w-[180px]  
      xl:bottom-16 xl:right-[25%] xl:w-[200px]  
      translate-y-[20%]
      transition-all duration-300 ease-in-out
    "
        />
      </div>
    </div>
  );
};

export default BusinessTypeSelection;
