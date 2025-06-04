import React,{ useEffect, useState } from 'react';

const SubjectiveComponent = ({ question, onAnswerUpdate, currentStatus, onNext }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (currentStatus?.answer) {
      setText(currentStatus.answer);
    } else {
      setText('');
    }
  }, [question.question_id]);

  const handleAction = (markForReview = false) => {
    const trimmedText = text.trim();
    const hasAnswer = trimmedText !== '';
    const status = markForReview
      ? hasAnswer ? 'reviewed_with_answer' : 'reviewed'
      : hasAnswer ? 'answered' : 'skipped';

    onAnswerUpdate(question.question_id, {
      answer: hasAnswer ? trimmedText : null,
      markedForReview: markForReview,
      status
    });
    onNext();
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
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

export default SubjectiveComponent;
