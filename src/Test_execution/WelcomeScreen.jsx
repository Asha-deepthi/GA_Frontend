import React from "react";
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";
import { useParams } from 'react-router-dom';

const WelcomeScreen = () => {
    const navigate = useNavigate();
    
    // --- FIX 2: Get the testId from this page's URL ---
    // This works because your App.jsx has the route: /welcome/:testId
    const { testId } = useParams();

    const handleAccept = () => {
        // --- FIX 3: Include the testId when navigating to the next page ---
        if (testId) {
            navigate(`/tutorialscreen/${testId}`);
        } else {
            // This is a safety check in case the URL is wrong
            alert("Error: Test ID is missing. Cannot proceed.");
            console.error("testId is missing from URL parameters in WelcomeScreen.");
        }
    };
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center px-4 pt-6 font-overpass relative overflow-hidden">
      {/* Top Color Bar */}
      <div className="w-full h-[10px] flex absolute top-0 left-0 z-10">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="w-full max-w-[1250px] flex items-center justify-between px-4 md:px-10 py-4 mt-12 z-10 h-11">
        <div className="w-[197.78px] h-[40px] bg-black/20" />
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[#E0302D] bg-[#E0302D0D] rounded-full">
          <FaQuestionCircle className="text-[#E0302D] text-lg" />
          <span className="font-medium text-base text-center text-[#E0302D]">
            FAQs
          </span>
        </button>
      </header>

      {/* Main Content */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 md:px-0 max-w-[456px] overflow-hidden">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-black font-extrabold text-[40px] leading-[48px] flex items-center gap-2">
            <span>Welcome</span>
            <img
              src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/waving-hand-light-skin-tone.png"
              alt="hand"
              className="w-8 h-8"
            />
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black/70 mt-1">
            Thank you for joining our interview invitation.
          </p>
        </div>

        {/* Interview Box */}
        <div className="my-auto w-full max-h-[340px] p-6 rounded-xl border border-r-4 border-b-4 border-teal-500 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] bg-teal-50 bg-opacity-[0.97] flex flex-col justify-between">
          <div>
            <h2 className="text-black font-bold text-[28px] leading-[36px] mb-2">
              Accept Your Interview
            </h2>
            <p className="text-gray-500 text-base leading-6">
              Please confirm your availability to proceed with the interview or choose to reschedule.
            </p>
          </div>

          <div className="flex justify-end">
            <button onClick={handleAccept} className="bg-[#00A398] text-white px-6 py-2 rounded-3xl font-bold text-[16px]">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
