import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const WelcomeScreen = () => {
  return (
    <div className="w-screen min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-6 font-overpass relative overflow-hidden">
      {/* Top Color Bar */}
      <div className="absolute top-0 left-0 w-full h-[10px] flex z-10">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between px-4 md:px-10 py-4 mt-8 z-10">
        <div className="w-36 h-6 rounded" style={{ background: "#00000033" }} />
        <button
          className="flex items-center"
          style={{
            width: "107px",
            height: "44px",
            gap: "10px",
            padding: "10px 22px 10px 20px",
            background: "#E0302D0D",
            border: "1px solid #E0302D",
            borderRadius: "70px",
          }}
        >
          <FaQuestionCircle style={{ fontSize: "18px", color: "#E0302D" }} />
          <span
            style={{
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              textAlign: "center",
              color: "#E0302D",
            }}
          >
            FAQs
          </span>
        </button>
      </header>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center justify-center mt-8 px-4 md:px-0">
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-extrabold text-[32px] sm:text-[36px] md:text-[40px] leading-tight text-center text-black">
            Welcome
          </h1>
          <img
            src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/waving-hand-light-skin-tone.png"
            alt="hand"
            className="w-8 h-8 mt-1"
          />
        </div>

        <p className="text-center text-[16px] sm:text-[18px] md:text-[20px] text-black/70 mt-2 max-w-[500px]">
          Thank you for joining our interview invitation.
        </p>

        {/* 3D Card Box */}
        <div
          className="mt-8 w-full max-w-md border-r-4 border-b-4 border-teal-500 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] rounded-xl p-6"
          style={{
            background: `linear-gradient(0deg, rgba(0, 163, 152, 0.03), rgba(0, 163, 152, 0.03)), #FFFFFF`,
          }}
        >
          <div>
            <h2 className="text-black font-bold text-[24px] md:text-[28px] mb-4">
              Accept Your Interview
            </h2>
            <p className="text-gray-500 text-[14px] md:text-[16px]">
              Please confirm your availability to proceed with the interview or choose to reschedule.
            </p>
          </div>
          <div className="flex justify-end">
            <button className="bg-[#00A398] text-white px-6 py-2 rounded-3xl mt-6 font-bold text-[16px]">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
