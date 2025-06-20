import React from "react";

const CameraOffAlert = ({ onDismiss,onEnable }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white w-[560px] h-[240px] rounded-[24px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-evenly w-full h-full">
          {/* Icon */}
          <div className="w-[92px] h-[92px] rounded-full bg-[#00A3981A] flex items-center justify-center">
            <img
              src="/images/camoff.png"
              alt="Camera off"
              className="w-[48px] h-[48px] object-contain"
            />
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-[#1C0D0D] text-[16px] font-lexend font-bold">Camera is off</p>
            <p className="text-[#1C0D0D] text-[10px] font-lexend font-medium">Please turn it on to continue.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              className="w-[200px] h-[32px] rounded-[4px] bg-[#ED3237] text-white font-lexend font-bold text-[12px]"
              onClick={onDismiss}
            >
              Dismiss
            </button>
            <button
              className="w-[200px] h-[32px] rounded-[4px] bg-[#00A398] text-white font-lexend font-bold text-[12px]"
              onClick={onEnable}
            >
              Enable camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraOffAlert;
