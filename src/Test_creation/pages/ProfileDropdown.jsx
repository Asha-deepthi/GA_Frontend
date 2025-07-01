// src/components/ProfileDropdown.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // --- CHANGE: Import useNavigate

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // --- NEW: Initialize useNavigate

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCloseDropdown = () => {
    setOpen(false);
  };

  // --- NEW: Create a logout handler ---
  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    console.log("Logging out...");
    handleCloseDropdown(); // Close the dropdown
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-[130px] h-[30px] flex items-center gap-[8px] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
          <img
            src="https://i.pravatar.cc/30"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-[92px] h-[18px] flex items-center justify-between gap-[3px]">
          <div className="w-[71px] h-[18px] text-[12px] leading-[18px] text-[#5A5A5D] font-lato font-normal text-right">
            Arjun Pavan
          </div>
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L3 3.6L6 0H0Z" fill="#5A5A5D" />
            </svg>
          </div>
        </div>
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
          <ul className="text-sm text-gray-700">
            <li>
              <Link
                to="/profileSettings" 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleCloseDropdown}
              >
                Settings
              </Link>
            </li>

            {/* --- CHANGE 3: The "Logout" li is now a button with an onClick handler --- */}
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;