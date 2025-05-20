import React, { useEffect, useRef } from "react";
import { FaMicrophone, FaVideo, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useStream } from './StreamContext'; // <-- Import StreamContext

const CodingQuestionScreen = () => {
  const navigate = useNavigate();
  const { webcamStream } = useStream(); // <-- Use webcam stream
  const videoRef = useRef(null);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current.play().catch((err) => console.error("Webcam play error:", err));
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [webcamStream]);

  const handleBack = () => {
    navigate("/mcqquestion");
  };

  const handleFullscreen = () => {
    navigate("/fullscreen");
  };

  const handleSubmit = () => {
    navigate("/result");
  };

  return (
    <div className="w-screen h-screen bg-white font-sans overflow-auto">
      {/* Top Colored Bar */}
      <div className="flex w-full h-1">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center px-20 py-10">
        <div className="w-36 h-6 bg-gray-300" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-500 font-semibold bg-red-100 px-4 py-1 rounded-full border border-red-300">
            <FaClock className="text-sm" />
            <span>20:00</span>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="flex items-center gap-2">
            <img
              src="/images/profilepic.png"
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-sm text-gray-700 font-semibold">Arjun</div>
          </div>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="relative w-full mt-4 mb-6 h-6">
        <button onClick={handleBack} className="absolute left-[110px] text-gray-600 bg-white flex items-center gap-2">
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="flex justify-center absolute inset-0 items-center gap-4">
          <div className="w-20 h-1 bg-teal-500 rounded-full" />
          <div className="w-20 h-1 bg-teal-500 rounded-full" />
          <div className="w-20 h-1 bg-teal-500 rounded-full" />
          <div className="w-20 h-1 bg-teal-500 rounded-full" />
        </div>

        <div className="absolute right-[160px] top-0 text-sm font-semibold text-gray-700">
          (04/04)
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 md:px-20 w-full mt-10 pb-12">
        <h1 className="text-3xl text-black font-bold mb-6">Coding Question</h1>

        <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-start mt-6">
          {/* Left Box */}
          <div className="border border-teal-200 p-6 rounded-xl w-[396px] h-[410px] shadow-md">
            <p className="text-gray-700">
              1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod ?
            </p>
          </div>

          {/* Right Box */}
          <div className="border w-[610px] h-[410px] rounded-xl shadow-md flex flex-col items-center justify-center bg-gray-50 p-4">
            <img
              src="/images/codeblock.png"
              alt="Code Display"
              className="w-[580px] h-[329px] rounded-[5px] pt-[1%] pb-[1%] object-cover"
            />
            <div className="flex justify-end items-center gap-[10px] w-[425px] h-[36px] mt-2">
              <button className="bg-green-500 active:bg-green-600 text-white font-semibold px-4 py-1 rounded-full text-sm h-full focus:outline-none">
                Save Code
              </button>
              <button className="bg-orange-400 active:bg-orange-500 text-white font-semibold px-4 py-1 rounded-full text-sm h-full focus:outline-none">
                RUN the Code
              </button>
              <button onClick={handleFullscreen} className="bg-white border border-orange-300  text-orange-500 font-semibold px-4 py-1 rounded-full text-sm h-full focus:outline-none">
                See Full Screen
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button onClick={handleSubmit} className="bg-teal-500 active:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full focus:outline-none">
            Submit & Continue
          </button>
        </div>
      </div>

      {/* Bottom Aligned Footer Section */}
      <div className="relative w-full">
        {/* Centered Note */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-black font-medium">
          Note : Do not refresh the page or you'll lose your data
        </div>

        {/* Webcam Box with Icons */}
        <div className="absolute bottom-2 right-4 flex gap-2 items-end">
          <div className="flex flex-col gap-2 items-start justify-end mr-2">
            <div className="flex items-center gap-1 text-gray-700">
              <FaMicrophone className="mr-1" />
              <div className="w-1 h-2 bg-gray-300" />
              <div className="w-1 h-3 bg-yellow-500" />
              <div className="w-1 h-4 bg-green-500" />
              <div className="w-1 h-5 bg-green-500" />
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <FaVideo className="mr-1" />
              <div className="w-1 h-2 bg-gray-300" />
              <div className="w-1 h-3 bg-yellow-500" />
              <div className="w-1 h-4 bg-green-500" />
              <div className="w-1 h-5 bg-green-500" />
            </div>
          </div>

          {/* Live Webcam Feed */}
          <div className="w-28 h-20 rounded-lg overflow-hidden bg-black border border-gray-300">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingQuestionScreen;
