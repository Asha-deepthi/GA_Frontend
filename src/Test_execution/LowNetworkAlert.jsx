import React from "react";

const LowNetworkAlert = ({ onDismiss, onReconnecting }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white w-[804px] h-[415px] rounded-[24px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-evenly w-full h-full">
          {/* Icon */}
          <div className="w-[150px] h-[150px] rounded-full bg-[#00A3981A] flex items-center justify-center">
            <img
              src="images/lownet.png"
              alt="low net"
              className="w-[72px] h-[72px] object-contain"
            />
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-[#1C0D0D] text-[22px] font-lexend font-bold">Low network is detected</p>
            <p className="text-[#1C0D0D] text-[16px] font-lexend font-medium">Your connection may effect the session.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              className="w-[348px] h-[40px] rounded-[8px] bg-[#ED3237] text-white font-semibold text-[14px]"
              onClick={onDismiss}
            >
              Dismiss
            </button>
            <button
              className="w-[348px] h-[40px] rounded-[8px] bg-[#00A398] text-white font-semibold text-[14px]"
              onClick={onReconnecting}
            >
              Try reconnecting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowNetworkAlert;
