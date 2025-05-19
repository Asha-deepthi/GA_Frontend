import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AudioQuestion = () => {
  const [isRecording, setIsRecording] = useState(false);

    const handleMicClick = () => {
        setIsRecording(prev => !prev);
    };
    const navigate = useNavigate();
          const handleBack = () => {
          navigate("/demoquestion");
          };
          const handleSubmit = () => {
          navigate("/videoquestion");
            };

  return (
    <div className="w-screen min-h-screen bg-white font-overpass relative overflow-x-hidden overflow-y-auto pb-24">
      {/* Top Color Bar */}
      <div className="fixed top-0 left-0 w-full h-[10px] flex z-50">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header (absolute) */}
      <header
        className="absolute top-[50px] left-1/2 z-40 flex items-center justify-between px-4 sm:px-8 w-full max-w-[1250px] transform -translate-x-1/2 h-[44px] bg-white"
      >
        {/* Logo */}
        <div className="w-[100px] sm:w-[144px] h-[24px] bg-black/20 rounded" />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center px-3 sm:px-6 py-2 rounded-[70px] bg-[#FFEAEA] border border-[#E0302D] gap-2 sm:gap-2"
            style={{ minWidth: '90px' }}
          >
            <FaClock className="text-[#E0302D] text-lg" />
            <span className="font-medium text-[#E0302D] text-sm sm:text-base">05:00</span>
          </div>

          <div className="h-6 w-[2px] bg-gray-300 hidden sm:block" />

          <div className="flex items-center gap-2 px-2 sm:px-4" style={{ minWidth: '80px' }}>
            <img
              src="/images/profilepic.png"
              alt="Avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="font-medium text-[#1A1A1A] text-sm sm:text-base whitespace-nowrap">
              Arjun
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative max-w-[1250px] mx-auto px-4 sm:px-8 pb-10 pt-[130px] flex flex-col items-center text-center">
        {/* Progress Bar and Back Button */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between mb-10 w-full max-w-[1036px]"
          style={{ gap: '1rem' }}
        >
          <button
            onclick={handleBack} className="text-sm font-medium border border-white bg-white text-black px-4 py-2 rounded-full mb-4 sm:mb-0 self-start sm:self-auto"
          >
            &larr; Back
          </button>

          <div className="flex gap-2 items-center justify-center mb-4 sm:mb-0">
            <div
              className="w-20 sm:w-32 h-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: 'rgba(0, 163, 152, 0.4)' }}
            />
            <div
              className="w-20 sm:w-32 h-1 rounded-full"
              style={{ background: 'rgba(0, 163, 152, 0.10)' }}
            />
            <div
              className="w-20 sm:w-32 h-1 rounded-full"
              style={{ background: 'rgba(0, 163, 152, 0.10)' }}
            />
            <div
              className="w-20 sm:w-32 h-1 rounded-full"
              style={{ background: 'rgba(0, 163, 152, 0.10)' }}
            />
          </div>

          <span className="text-sm font-medium text-black ml-0 sm:ml-8 whitespace-nowrap">(01/04)</span>
        </div>

        {/* Question Section */}
        <h2 className="text-3xl sm:text-[40px] font-extrabold text-black mb-6 px-2 sm:px-0 max-w-[900px]">
          Audio Question
        </h2>

        <p className="text-base sm:text-xl text-gray-600 max-w-[900px] mb-12 leading-relaxed px-2 sm:px-0">
          1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ?
        </p>

        {/* Recording Box */}
        <div
          className="w-full max-w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex items-center justify-center px-4 sm:px-[362px] mb-14 bg-[linear-gradient(0deg,rgba(0,163,152,0.03),rgba(0,163,152,0.03)),#FFFFFF]"
        >
          <button
            onClick={handleMicClick}
            className={`w-18 h-18 rounded-full p-1 flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-transparent'
              } shadow-md transition duration-300`}
            aria-label="Toggle Recording"
          >
            <img
              src="/images/Audio Recording.png"
              alt="Mic Icon"
              className="w-full h-full object-contain"
            />
          </button>
        </div>

        {/* Submit Button */}
        <button
          onclick={handleSubmit} className="w-[218px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition flex items-center justify-center mb-8 mx-auto"
        >
          Submit & Continue
        </button>
      </main>

      {/* Centered Note fixed at bottom center */}
<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-4">
  <p className="text-xs text-gray-500 text-center max-w-xs sm:max-w-md">
    Note: Do not refresh the page or you'll lose your data
  </p>
</div>

{/* Webcam Box fixed bottom right */}
<div className="absolute bottom-6 right-6 flex items-center gap-2 z-40">
  {/* Voice Signal Image */}
  <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-white">
    <img
      src="/images/signal.png"
      alt="Voice Signal"
      className="w-full h-full object-contain"
    />
  </div>

  <div
    className="w-[150px] h-[100px] rounded-md bg-gray-200 border border-gray-400 overflow-hidden"
  >
    <img
      src="/images/Webcam pic.png"
      alt="Webcam"
      className="w-full h-full object-cover"
    />
  </div>
</div>

    </div>
  );
};

export default AudioQuestion;
