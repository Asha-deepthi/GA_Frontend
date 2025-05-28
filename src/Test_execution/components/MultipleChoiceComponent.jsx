import React, { useState } from "react";

const MultipleChoiceComponent = ({ question, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleSubmit = async (isReview = false) => {
    await fetch("http://localhost:8000/api/submit-answer/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id: question.question_id,
        selected_answer: selectedOption || null,
        is_marked_for_review: isReview,
      }),
    });

    onNext(); // Move to the next question
  };

  return (
    <div className="p-4 border rounded-xl shadow-md max-w-xl mx-auto">
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleSubmit(false)}
        >
          Save & Next
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => handleSubmit(true)}
        >
          Mark for Review
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceComponent;
