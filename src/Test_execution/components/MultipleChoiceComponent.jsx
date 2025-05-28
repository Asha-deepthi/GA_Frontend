import React, { useState, useEffect } from "react";

const MultipleChoiceComponent = ({
  question,
  savedAnswer,
  isMarkedForReview,
  onSaveAnswer,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState(savedAnswer || null);
  const [marked, setMarked] = useState(isMarkedForReview || false);

  useEffect(() => {
    setSelectedOption(savedAnswer || null);
  }, [savedAnswer]);

  useEffect(() => {
    setMarked(isMarkedForReview || false);
  }, [isMarkedForReview]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleMarkForReviewToggle = () => {
    const newMarked = !marked;
    setMarked(newMarked);
    onSaveAnswer(question.question_id, selectedOption, newMarked);
  };

  const handleSaveAndNext = (e) => {
    e.preventDefault();
    onSaveAnswer(question.question_id, selectedOption, marked);
    onNext();
  };

  return (
    <form onSubmit={handleSaveAndNext} className="p-4 border rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{question.question}</h2>

      <div className="space-y-2">
        {question.options?.map((opt) => (
          <label
            key={opt.option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="mcq"
              value={opt.value}
              onChange={() => handleOptionChange(opt.value)}
              checked={selectedOption === opt.value}
            />
            <span>{opt.option}. {opt.value}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded ${marked ? "bg-yellow-400 text-black" : "bg-gray-300 text-black"}`}
          onClick={handleMarkForReviewToggle}
        >
          {marked ? "Marked for Review" : "Mark for Review"}
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save & Next
        </button>
      </div>
    </form>
  );
};

export default MultipleChoiceComponent;
