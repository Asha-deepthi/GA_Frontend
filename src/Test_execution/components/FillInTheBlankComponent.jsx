import React, { useState, useEffect } from 'react';

const FillInTheBlankComponent = ({
  question,
  onAnswerUpdate,
  currentStatus,
  onNext,
  isLast,
  onLocalAnswerChange
}) => {
  const [answer, setAnswer] = useState(currentStatus?.answer?.toString() || '');

  useEffect(() => {
    const initial = currentStatus?.answer?.toString() || '';
    setAnswer(initial);
    if (onLocalAnswerChange) {
      onLocalAnswerChange(initial); 
   }
  }, [question.id, currentStatus?.answer]);

  const handleChange = (e) => {
    const updated = e.target.value;
    setAnswer(updated);
    if (onLocalAnswerChange) {
      onLocalAnswerChange(updated); 
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        value={answer}
        onChange={handleChange}
        placeholder="Type your answer here"
      />
    </div>
  );
};

export default FillInTheBlankComponent;