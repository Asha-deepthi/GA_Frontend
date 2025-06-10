import React from "react";

const TabSwitchAlert = ({ onDismiss }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white w-[400px] h-[250px] rounded-[16px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-evenly w-full h-full">
          {/* Icon */}
          <div className="w-[64px] h-[64px] rounded-full bg-[#00A3981A] flex items-center justify-center">
            <img
              src="images/tabswitch.png"
              alt="No tab switch"
              className="w-[36px] h-[36px] object-contain"
            />
          </div>

          {/* Warning Text */}
          <p className="text-[#1C0D0D] text-[18px] font-bold leading-[24px] text-center">
            Please do not switch tabs during the session.
          </p>

          {/* Buttons */}
          <div className="flex justify-center">
            <button
              className="w-[100px] h-[40px] rounded-[8px] bg-[#ED3237] text-white font-semibold text-[14px]"
              onClick={onDismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabSwitchAlert;
