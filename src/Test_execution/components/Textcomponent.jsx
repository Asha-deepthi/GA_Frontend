import React, { useState, useEffect } from 'react';

const TextQuestionComponent = ({ question, onAnswerUpdate, currentStatus, onNext }) => {
  const [answer, setAnswer] = useState(currentStatus?.answer || '');

  useEffect(() => {
    setAnswer(currentStatus?.answer || '');
  }, [question.id, currentStatus?.answer]);

  const handleChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSaveAndNext = () => {
    onAnswerUpdate(question.id, {
      answer: answer,
      markedForReview: false,
    });
    if (onNext) onNext();
  };

  const handleMarkForReview = () => {
    onAnswerUpdate(question.id, {
      answer: answer,
      markedForReview: true,
    });
    if (onNext) onNext();
  };

  return (
    <div>
      <p className="mb-4 font-semibold">{question.text}</p>
      <textarea
        value={answer}
        onChange={handleChange}
        rows={5}
        className="w-full border rounded p-2"
        placeholder="Type your answer here..."
      />

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSaveAndNext}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save and Next
        </button>
        <button
          onClick={handleMarkForReview}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Mark for Review
        </button>
      </div>
    </div>
  );
};

export default TextQuestionComponent;
