import React, { useEffect, useState } from 'react';

const SubjectiveComponent = ({
  question,
  onAnswerUpdate,
  currentStatus,
  onNext,
  isLast,
  onLocalAnswerChange // ✅ added
}) => {
  const [text, setText] = useState(currentStatus?.answer || '');

  useEffect(() => {
    const initial = currentStatus?.answer || '';
    setText(initial);
    if (onLocalAnswerChange) {
      onLocalAnswerChange(initial); // sync initial
    }
  }, [question.id, currentStatus?.answer]);

  const handleChange = (e) => {
    const updated = e.target.value;
    setText(updated);
    if (onLocalAnswerChange) {
      onLocalAnswerChange(updated); // live update to parent
    }
  };

  return (
    <div className="p-4">
      <textarea
        rows={6}
        value={text}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
        placeholder="Type your answer here..."
      />
    </div>
  );
};

export default SubjectiveComponent;