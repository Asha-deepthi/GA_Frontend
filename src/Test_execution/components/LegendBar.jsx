import React from "react";

const legends = [
  { label: "Answered", colorName: "Green" },
  { label: "Unanswered", colorName: "Red" },
  { label: "Marked as Review", colorName: "Violet" },
  { label: "Attempted", colorName: "Orange" },
];

const LegendBar = () => {
  return (
    <div className="w-[198px] h-[198px] bg-white">
      {[0, 1].map((row) => (
        <div key={row} className="flex border-t border-[#E5E8EB]">
          {legends.slice(row * 2, row * 2 + 2).map((legend, idx) => (
            <div
              key={idx}
              className="w-[99px] h-[99px] flex flex-col items-center justify-center pt-5 pb-5 text-center"
            >
              <span className="text-[#4A739C] font-lexend text-[14px] leading-[21px]">
                {legend.label}
              </span>
              <span className="text-[#0D141C] font-lexend text-[14px] leading-[21px] mt-1">
                {legend.colorName}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LegendBar;