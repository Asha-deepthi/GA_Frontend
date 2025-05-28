import React, { useState, useEffect } from "react";

const FillInTheBlankComponent = ({
  question,
  savedAnswer,
  isMarkedForReview,
  onSaveAnswer,
  onNext,
}) => {
  const [answer, setAnswer] = useState(savedAnswer);
  const [marked, setMarked] = useState(isMarkedForReview);

  useEffect(() => {
    setAnswer(savedAnswer);
  }, [savedAnswer]);

  useEffect(() => {
    setMarked(isMarkedForReview);
  }, [isMarkedForReview]);

  const handleMarkForReviewToggle = () => {
    const newMarked = !marked;
    setMarked(newMarked);
    onSaveAnswer(question.question_id, answer, newMarked);
  };

  const handleSaveAndNext = (e) => {
    e.preventDefault();
    onSaveAnswer(question.question_id, answer, marked);
    onNext();
  };

  return (
    <form onSubmit={handleSaveAndNext}>
      <h3 className="mb-4 font-semibold text-lg">{question.question}</h3>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border border-gray-400 rounded px-3 py-2 mb-4 w-full max-w-md"
      />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleMarkForReviewToggle}
          className={`px-4 py-2 rounded ${
            marked ? "bg-yellow-400 text-black" : "bg-gray-300 text-black"
          }`}
        >
          {marked ? "Marked for Review" : "Mark for Review"}
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Save and Next
        </button>
      </div>
    </form>
  );
};

export default FillInTheBlankComponent;
