import React from "react";
import TimerDisplay    from "./TimerDisplay";
import QuestionPalette from "./QuestionPalette";
import LegendBar       from "./LegendBar";

export default function RightPanel({
  questions, currentQuestionId, onQuestionClick, getColor
}) {
  return (
    <div className="flex flex-col items-center bg-white">
      <TimerDisplay />
      <QuestionPalette
        questions={questions}
        currentQuestionId={currentQuestionId}
        onQuestionClick={onQuestionClick}
        getColor={getColor}
      />
      <LegendBar />
    </div>
  );
}