import React from "react";
import TimerDisplay from "./TimerDisplay";
import QuestionPalette from "./QuestionPalette";
import LegendBar from "./LegendBar";

const RightPanel = () => {
  return (
    <div
      className="flex flex-col items-center justify-start bg-white"
      style={{
        width: "233px",
        height: "646px",
        padding: "0px",
        gap: "0px",
      }}
    >
      {/* Timer Display */}
      <div
        className="w-full"
        style={{
          height: "141px",
          paddingTop: "24px",
          paddingRight: "16px",
          paddingBottom: "24px",
          paddingLeft: "16px",
        }}
      >
        <TimerDisplay />
      </div>

      {/* Question Palette + Legend */}
      <div
        style={{
          width: "220px",
          height: "505px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
        }}
      >
        <QuestionPalette />
        <LegendBar />
      </div>
    </div>
  );
};

export default RightPanel;