import React from "react";

const IdentityMismatchAlert = ({ onDismiss, onContinue }) => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-auto">
    <div className="bg-white w-[560px] h-[240px] rounded-[24px] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-evenly w-full h-full">
        {/* Icon */}
        <div className="w-[92px] h-[92px] rounded-full bg-[#ED32371A] flex items-center justify-center">
          <img
            src="/images/identity-mismatch.png" // 🖼️ Use your own image path
            alt="Identity mismatch"
            className="w-[48px] h-[48px] object-contain"
          />
        </div>

        {/* Warning Text */}
        <p className="text-[#1C0D0D] text-[16px] font-lexend font-bold leading-[24px] text-center">
          ⚠ Identity mismatch! Please stay in front of the camera.
        </p>

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
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default IdentityMismatchAlert;
