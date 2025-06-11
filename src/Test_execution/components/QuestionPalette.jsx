import React from "react";

const QuestionPalette = ({ questions= [], onClick, getColor }) => {
  return (
    <div className="w-[200px] h-[260px] p-4 flex flex-col flex-wrap gap-y-3 bg-white">
      {Array.from({ length: Math.ceil(questions.length / 3) }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3 w-[168px] h-[48px]">
          {questions
            .slice(rowIndex * 3, rowIndex * 3 + 3)
            .map((question, index) => (
              <button
                key={question.id}
                onClick={() => onClick(question.id)}
                className="w-[48px] h-[48px] rounded-[8px] border border-[#CFDBE8] bg-[#F7FAFC] flex items-center justify-center p-4"
                style={{ backgroundColor: getColor(question.id) }}
              >
                <span className="w-[10px] h-[20px] text-[#0D141C] font-lexend font-bold text-[16px] leading-[20px]">
                  {question.number}
                </span>
              </button>
            ))}
        </div>
      ))}
    </div>
  );
};

export default QuestionPalette;