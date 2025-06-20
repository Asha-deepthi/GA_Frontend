import React, { useEffect, useState } from 'react';

const SubjectiveComponent = ({ question, onAnswerUpdate, currentStatus, onNext, isLast }) => {
  const [text, setText] = useState(currentStatus?.answer || '');

  useEffect(() => {
    setText(currentStatus?.answer || '');
  }, [question.id, currentStatus?.answer]);

  const handleAction = (markForReview = false) => {
    const trimmedText = text.trim();
    const hasAnswer = trimmedText !== '';
    const status = markForReview
      ? hasAnswer ? 'reviewed_with_answer' : 'reviewed'
      : hasAnswer ? 'answered' : 'skipped';

    onAnswerUpdate(question.id, {
      answer: hasAnswer ? trimmedText : null,
      markedForReview: markForReview,
      type: question.type,
      status,
    });

    if (!isLast && onNext) {
      onNext();
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{question.text || question.question_text}</h3>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
        placeholder="Type your answer here..."
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

export default SubjectiveComponent;
