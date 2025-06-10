import React, { useEffect, useState} from 'react';
import { FaQuestionCircle } from "react-icons/fa";

const TopHeader = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return setUserName('Guest');

    fetch(`http://127.0.0.1:8000/test-execution/get-user/${id}/`)
      .then(res => res.json())
      .then(profile => setUserName(profile.name))
      .catch(() => setUserName('Guest'));
  }, []);

  return (
    <div className="relative w-full bg-white font-lexend">
      {/* Top Multi-Colored Bar */}
      <div className="sticky top-0 left-0 w-full flex h-[6px] z-20">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-300" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-teal-500" />
      </div>

      {/* Main Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#E5E7EB] h-[64px]">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img src="/images/pin-icon.png" alt="Pin" className="w-4 h-4" />
          <span className="text-[#008080] text-sm font-semibold">GA Proctored Test</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* FAQs Button */}
          <button
            className="flex items-center px-4 py-1.5 border border-[#E0302D] rounded-full bg-[#E0302D0D] gap-2"
          >
            <FaQuestionCircle className="text-[#E0302D] text-sm" />
            <span className="text-[#E0302D] text-sm font-medium">FAQs</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-gray-300" />

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <img
              src="/images/profilepic.png"
              alt="Avatar"
              className="w-7 h-7 rounded-full"
            />
            <span className="text-[#1A1A1A] text-sm font-medium">{userName ?? 'Loading...'}</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopHeader;