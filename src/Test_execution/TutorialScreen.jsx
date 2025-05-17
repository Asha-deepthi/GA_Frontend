import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

export default function VideoInterviewGuide({ onNext }) {
  return (
    <div className="relative w-screen min-h-screen bg-white overflow-y-auto overflow-x-hidden font-overpass">
      {/* Top Colored Bar */}
      <div className="sticky top-0 left-0 w-full flex h-1 z-10">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-lime-400" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-20 py-4">
        <div className="w-44 h-6 bg-gray-300 " />
        <div className="flex items-center gap-4">
          <button
            className="flex items-center px-5 py-2 border border-[#E0302D] rounded-full bg-[#E0302D0D] gap-2"
          >
            <FaQuestionCircle className="text-[#E0302D] text-lg" />
            <span className="text-[#E0302D] text-base font-medium">FAQs</span>
          </button>
          <div className="h-6 w-[2px] bg-gray-300" />
          <div className="flex items-center gap-2 px-2">
            <img
              src="images/profilepic.png"
              alt="Avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-[#1A1A1A] text-base font-medium">Arjun</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center px-4 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">How to Complete Your AI Video Interview</h1>
        <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl">
          Follow these steps for a smooth interview experience. Make sure to have a quiet space,
          good lighting, and a stable internet connection.
        </p>

        <div className="mt-12 flex justify-center">
        <img
          src="/images/video.png"
          alt="AI Interview Guide"
          className="rounded-xl w-[640px] h-auto shadow-md"
        />
        </div>

        <button
          onClick={onNext}
          className="mt-11 px-11 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-base font-semibold shadow-md"
        >
          Next
        </button>
      </div>

      {/* Optional Decorative Star */}
      
    </div>
  );
}

