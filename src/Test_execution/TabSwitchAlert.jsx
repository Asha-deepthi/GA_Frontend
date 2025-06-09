import React from "react";

const TabSwitchAlert = ({ onDismiss, onContinue }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white w-[822px] h-[428px] rounded-[24px] flex flex-col items-center justify-center">
        <div className="w-[746px] h-[348px] flex flex-col items-center justify-evenly">
          {/* Icon */}
          <div className="w-[150px] h-[150px] rounded-full bg-[#00A3981A] flex items-center justify-center">
            <img
              src="images/tabswitch.png"
              alt="No tab switch"
              className="w-[72px] h-[72px] object-contain"
            />
          </div>

          {/* Warning Text */}
          <p className="text-[#1C0D0D] text-[25px] font-bold leading-[24px] text-center">
            Please do not switch tabs during the session.
          </p>

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
              onClick={onContinue}
            >
              Continue in this tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabSwitchAlert;
