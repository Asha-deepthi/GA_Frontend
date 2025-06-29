import React, { useEffect, useState } from 'react';

const IntegerComponent = ({
  question,
  onAnswerUpdate,
  currentStatus,
  onNext,
  isLast,
  onLocalAnswerChange 
}) => {
  const [value, setValue] = useState(currentStatus?.answer?.toString() || '');

  useEffect(() => {
    const initial = currentStatus?.answer?.toString() || '';
    setValue(initial);
    if (onLocalAnswerChange) {
      onLocalAnswerChange(initial);
    }
  }, [question.id, currentStatus?.answer]);

  const handleChange = (e) => {
    const updated = e.target.value;
    setValue(updated);
    if (onLocalAnswerChange) {
      onLocalAnswerChange(updated);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
        placeholder="Enter a number"
      />
    </div>
  );
};

export default IntegerComponent;