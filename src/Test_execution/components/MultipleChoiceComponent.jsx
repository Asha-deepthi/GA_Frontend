import React, { useState, useEffect } from 'react';

const MultipleChoiceComponent = ({ question, onAnswerUpdate, currentStatus, onNext, isLast, onLocalAnswerChange }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(currentStatus?.answer?.toString() || '');

  useEffect(() => {
    setSelectedAnswer(currentStatus?.answer?.toString() || '');
  }, [question.id, currentStatus?.answer]);

  const handleOptionClick = (option) => {
    const newAnswer = selectedAnswer === option.id.toString() ? '' : option.id.toString();
    setSelectedAnswer(newAnswer);
    if (onLocalAnswerChange) onLocalAnswerChange(newAnswer);
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
    </div>
  );
};

export default MultipleChoiceComponent;
