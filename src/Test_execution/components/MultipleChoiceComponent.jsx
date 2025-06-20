import React, { useState, useEffect } from 'react';

const MultipleChoiceComponent = ({ question, onAnswerUpdate, currentStatus, onNext, isLast }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(currentStatus?.answer?.toString() || '');

  useEffect(() => {
    setSelectedAnswer(currentStatus?.answer?.toString() || '');
  }, [question.id, currentStatus?.answer]);

  const handleOptionClick = (option) => {
    setSelectedAnswer((prev) => (prev === option.id.toString() ? '' : option.id.toString()));
  };

  const handleSaveAndNext = () => {
    onAnswerUpdate(question.id, {
      answer: selectedAnswer,
      markedForReview: false,
      type: question.type,
    });
    if (!isLast && onNext) {
      onNext();
    }
  };

  const handleMarkForReview = () => {
    onAnswerUpdate(question.id, {
      answer: selectedAnswer,
      markedForReview: true,
      type: question.type,
    });
    if (!isLast && onNext) {
      onNext();
    }
  };

  return (
    <div>
      <p className="mb-4 font-semibold">{question.text}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt, index) => (
          <div
            key={opt.id || index}
            onClick={() => handleOptionClick(opt)}
            className={`border rounded px-4 py-2 cursor-pointer transition ${
              selectedAnswer === opt.id.toString()
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {opt.text}
          </div>
        ))}
      </div>

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

export default MultipleChoiceComponent;
