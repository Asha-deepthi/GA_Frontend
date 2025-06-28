import React, { useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaQuestionCircle } from 'react-icons/fa';
import AuthContext from "../Test_creation/contexts/AuthContext"; // Adjust path as needed
import TopHeader from './components/TopHeader'; // Adjust path if in a different folder

export default function VideoInterviewGuide() {
  const { user } = useContext(AuthContext);
  const userName = user?.name || 'Guest';
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("👤 User from context in TutorialScreen:", user);
  }, [user]);

  const handleAccept = () => {
    if (testId) {
      navigate(`/Permission/${testId}`);
    } else {
      alert("Error: Test ID is missing.");
    }
  };

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden font-overpass flex flex-col">
      {/* Top Header */}
      <TopHeader userName={userName} />

      {/* Main Content */}
      <div className="w-full flex-1 px-4 sm:px-8 lg:px-0 mx-auto flex flex-col items-center gap-6 justify-center max-w-[856px] overflow-hidden">
        {/* Heading and Paragraph */}
        <div className="w-full flex flex-col items-center gap-[10px]">
          <h1 className="text-[32px] sm:text-[36px] md:text-[40px] leading-[44px] md:leading-[48px] font-extrabold text-gray-900 text-center">
            How to Complete Your AI Video Interview
          </h1>
          <p className="font-overpass text-[18px] sm:text-[20px] leading-[28px] font-normal text-gray-600 text-center max-w-[772px]">
            Follow these steps for a smooth interview experience. Make sure to have a quiet space,
            good lighting, and a stable internet connection.
          </p>
        </div>

        {/* Image */}
        <div className="w-full max-w-[768px] h-auto rounded-[10px] overflow-hidden shadow-md">
          <img
            src="/images/video.png"
            alt="AI Interview Guide"
            className="w-full max-h-[300px] object-contain"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAccept}
          className="px-11 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-base font-semibold shadow-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}