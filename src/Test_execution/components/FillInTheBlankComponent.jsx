import React, { useState, useEffect } from 'react';

const FillInTheBlankComponent = ({
  question,
  onAnswerUpdate,
  currentStatus,
  onNext,
  isLast
}) => {
  const [answer, setAnswer] = useState(currentStatus?.answer?.toString() || '');

  // Load saved answer when question changes
  useEffect(() => {
    setAnswer(currentStatus?.answer?.toString() || '');
  }, [question.id, currentStatus?.answer]);

  const handleAction = (markForReview = false) => {
    const trimmedAnswer = answer.trim();
    const hasAnswer = trimmedAnswer !== '';

    const status = markForReview
      ? hasAnswer ? 'reviewed_with_answer' : 'reviewed'
      : hasAnswer ? 'answered' : 'skipped';

    onAnswerUpdate(question.id, {
      answer: hasAnswer ? trimmedAnswer : null,
      markedForReview: markForReview,
      type: question.type,
    });

    if (!isLast && onNext) {
      onNext();
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-2 font-semibold">{question.text}</h3>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here"
      />

      <div className="flex gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => handleAction(false)}
        >
          Save & Next
        </button>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => handleAction(true)}
        >
          Mark for Review & Next
        </button>
      </div>
    </div>
  );
};

export default FillInTheBlankComponent;
