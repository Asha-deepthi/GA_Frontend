import React, { useEffect, useRef } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useStream } from './StreamContext'; // Import your webcam stream context

export default function ConnectionStrengthScreen() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { webcamStream } = useStream();

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [webcamStream]);

  const handleAccept = () => {
    navigate("/demoquestion");
  };

  const data = [
    {
      title: 'Your camera is ready to record.',
      subtitle: 'Ensure you have good lighting for a clear video.',
      levels: 8,
      filled: 6,
      color: 'bg-teal-400',
      bg: 'bg-blue-50',
    },
    {
      title: 'Your microphone is working properly.',
      subtitle: 'Make sure your surroundings are quiet to capture clear audio.',
      levels: 8,
      filled: 4,
      color: 'bg-orange-400',
      bg: 'bg-blue-50',
    },
    {
      title: 'Your internet connection is stable.',
      subtitle: 'A strong connection ensures a smooth interview experience.',
      levels: 8,
      filled: 6,
      color: 'bg-green-400',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="relative w-screen h-screen bg-white overflow-auto font-overpass">
      {/* Top Bar */}
      <div className="sticky top-0 w-full flex h-1 z-10">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-lime-400" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-20 py-4">
        <div className="w-40 h-6 bg-gray-300 " />
        <div className="flex items-center gap-4">
          <button className="flex items-center px-5 py-2 border border-[#E0302D] rounded-full bg-[#E0302D0D] gap-2">
            <FaQuestionCircle className="text-[#E0302D] text-xl" />
            <span className="text-[#E0302D] text-base font-medium">FAQs</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src="images/profilepic.png" alt="Avatar" className="w-6 h-6 rounded-full" />
            <span className="text-gray-900 text-base font-medium">Arjun</span>
          </div>
        </div>
      </header>

      {/* Title & Subtitle */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-gray-900">Check Your Connection Strength</h1>
        <p className="mt-2 text-lg text-gray-600 max-w-xl mx-auto">
          Ensure optimal performance by checking your video, microphone, and internet connection strengths.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 px-4 mt-10 max-w-[1100px] mx-auto">
        {/* Camera Box */}
        <div className="relative w-full md:w-1/2 bg-blue-50 p-6 rounded-xl drop-shadow-md border-b-4 border-r-4 border-teal-400">
          <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-4 font-semibold text-gray-900">{data[0].title}</p>
          <p className="text-sm text-gray-600 mt-1">{data[0].subtitle}</p>
          <div className="absolute bottom-6 right-6 flex space-x-1">
            {Array.from({ length: data[0].levels }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-10 ${i < data[0].filled ? data[0].color : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Right Boxes */}
        <div className="flex flex-col gap-12 w-full md:w-1/3">
          {/* Microphone */}
          <div className="relative bg-blue-50 p-6 rounded-xl drop-shadow-md border-b-4 border-r-4 border-teal-400">
            <p className="font-semibold text-gray-900">{data[1].title}</p>
            <p className="text-sm text-gray-600 mt-1">{data[1].subtitle}</p>
            <div className="flex space-x-1 mt-4">
              {Array.from({ length: data[1].levels }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 ${i < data[1].filled ? data[1].color : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Internet */}
          <div className="relative bg-blue-50 p-6 rounded-xl drop-shadow-md border-b-4 border-r-4 border-teal-400">
            <p className="font-semibold text-gray-900">{data[2].title}</p>
            <p className="text-sm text-gray-600 mt-1">{data[2].subtitle}</p>
            <div className="flex space-x-1 mt-4">
              {Array.from({ length: data[2].levels }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 ${i < data[2].filled ? data[2].color : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-10 mb-10">
        <button
          onClick={handleAccept}
          className="px-10 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
}
