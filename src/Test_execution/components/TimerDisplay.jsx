import React from "react";

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center gap-2 w-[58px] h-[93px]">
    <div className="w-[58px] h-[56px] rounded-[8px] bg-[#E8EDF5] flex justify-center items-center px-3">
      <span className="w-[34px] h-[23px] text-[#0D141C] font-lexend font-bold text-[18px] leading-[23px] text-center">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <div
      className="text-[#0D141C] font-lexend font-normal text-[14px] leading-[21px] text-center"
      style={{ width: label === "Hours" ? "41px" : label === "Minutes" ? "54px" : "57px" }}
    >
      {label}
    </div>
  </div>
);

const TimerDisplay = ({ timer= { hours: 0, minutes: 0, seconds: 0 } }) => {
  const { hours, minutes, seconds } = timer;

  return (
    <div className="flex justify-between w-full">
      <TimeBox value={hours} label="Hours" />
      <TimeBox value={minutes} label="Minutes" />
      <TimeBox value={seconds} label="Seconds" />
    </div>
  );
};

export default TimerDisplay;