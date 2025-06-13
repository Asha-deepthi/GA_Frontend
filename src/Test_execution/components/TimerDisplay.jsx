import React, { useEffect, useRef, useState } from "react";

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center gap-2 w-[58px] h-[93px]">
    <div className="w-[58px] h-[56px] rounded-[8px] bg-[#E8EDF5] flex justify-center items-center px-3">
      <span className="w-[34px] h-[23px] text-[#0D141C] font-lexend font-bold text-[18px] leading-[23px] text-center">
        {value.toString().padStart(2, "0")}
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

const TimerDisplay = ({ initialSeconds = 30 * 60, stopTimer = false, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (stopTimer) {
      clearInterval(intervalRef.current);
      return;
    }
 clearInterval(intervalRef.current); 
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = prev > 0 ? prev - 1 : 0;
        if (onTimeUpdate) onTimeUpdate(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [stopTimer, onTimeUpdate]);

  useEffect(() => {
  setTimeLeft(initialSeconds);
}, [initialSeconds]);


  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex justify-between w-[200px]">
      <TimeBox value={hours} label="Hours" />
      <TimeBox value={minutes} label="Minutes" />
      <TimeBox value={seconds} label="Seconds" />
    </div>
  );
};

export default TimerDisplay;
