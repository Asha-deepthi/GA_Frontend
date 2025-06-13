import React, { useEffect, useState } from 'react';

const IntegerComponent = ({ question, onAnswerUpdate, currentStatus, onNext, isLast }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (currentStatus?.answer !== undefined && currentStatus?.answer !== null) {
      setValue(currentStatus.answer);
    } else {
      setValue('');
    }
  }, [question.id]);

  const handleAction = (markForReview = false) => {
    const trimmedValue = value.trim();
    const hasAnswer = trimmedValue !== '';
    const status = markForReview
      ? hasAnswer ? 'reviewed_with_answer' : 'reviewed'
      : hasAnswer ? 'answered' : 'skipped';

    onAnswerUpdate(question.id, {
      answer: hasAnswer ? trimmedValue : null,
      markedForReview: markForReview,
      status
    });
    if (!isLast && onNext){
       onNext();
      }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <div className="flex gap-4">
        <button onClick={() => handleAction(false)} className="bg-green-600 text-white px-4 py-2 rounded">
          Save & Next
        </button>
        <button onClick={() => handleAction(true)} className="bg-purple-600 text-white px-4 py-2 rounded">
          Mark for Review & Next
        </button>
      </div>
    </div>
  );
};

export default IntegerComponent;
