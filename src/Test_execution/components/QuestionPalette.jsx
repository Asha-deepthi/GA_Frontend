import React from "react";

export default function QuestionPalette({
  questions, currentQuestionId, onQuestionClick, getColor
}) {
  return (
    <div className="w-[200px] p-4 bg-white flex flex-col items-center gap-4">
      <h3 className="text-sm font-semibold">Questions</h3>
      <div className="grid grid-cols-3 gap-2">
        {questions.map(q => {
          const bg = getColor(q.id);
          const isActive = q.id === currentQuestionId;
          return (
            <button
              key={q.id}
              onClick={() => onQuestionClick(q.id)}
              className={`w-10 h-10 rounded border
                ${isActive ? "ring-2 ring-blue-500" : "border-gray-200"}`}
              style={{ backgroundColor: bg }}
            >
              {q.number}
            </button>
          );
        })}
      </div>
      {/* legend… */}
    </div>
  );
}