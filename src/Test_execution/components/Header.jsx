import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { Bell } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define nav items and their target paths
  const navItems = [
    { label: "Dashboard", path: "/dashboard", width: "w-[74px]" },
    { label: "Tests", path: "/tets", width: "w-[37px]" },
    { label: "Candidates", path: "/candidates", width: "w-[77px]" },
    { label: "Create test", path: "/importform", width: "w-[78px]" },
  ];

  return (
    <div className="w-[1440px] h-[65px] bg-white flex items-center px-6 justify-between">
      {/* Left: Logo / Name */}
      <div className="w-[193px] text-[#00A398] text-[18px] font-bold leading-[23px] font-inter">
        GA Proctored Test
      </div>

      {/* Right: Nav + Notification + Profile */}
      <div className="flex items-center gap-[36px]">
        {/* Navigation */}
        <div className="flex gap-[32px] font-inter text-[14px] font-medium leading-[21px] text-[#121417]">
          {navItems.map(({ label, path, width }) => {
            const isActive = location.pathname === path;
            return (
              <div
                key={label}
                onClick={() => navigate(path)}
                className={`cursor-pointer flex flex-col items-center justify-center ${width} ${
                  isActive ? "text-[#00A398] font-semibold border-b border-[#00A398]" : "text-[#121417]"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Notification icon */}
        <div className="w-[40px] h-[40px] rounded-full bg-[#F5F5F5] flex items-center justify-center px-[10px]">
          <Bell size={18} color="#555" />
        </div>

        {/* Profile Dropdown */}
        <div className="w-[130px] h-[30px]">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;
