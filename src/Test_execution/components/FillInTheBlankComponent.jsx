import { useState, useEffect } from 'react';

const FillInTheBlankComponent = ({ 
  question, 
  onAnswerUpdate, 
  currentStatus,
  onNext
}) => {
  const [answer, setAnswer] = useState('');

  // Load saved answer when component mounts or when question changes
  useEffect(() => {
    if (currentStatus?.answer) {
      setAnswer(currentStatus.answer);
    } else {
      setAnswer('');
    }
  }, [question.question_id]);

  const handleAction = async (markForReview = false) => {
    const trimmedAnswer = answer.trim();
    const hasAnswer = trimmedAnswer !== '';

    const status = markForReview
      ? hasAnswer ? 'reviewed_with_answer' : 'reviewed'
      : hasAnswer ? 'answered' : 'skipped';

    // Notify parent with updated answer and status
    onAnswerUpdate(question.question_id, {
      answer: hasAnswer ? trimmedAnswer : null,
      markedForReview: markForReview,
      status,
    });
    onNext();
  };

  return (
    <div className="p-4">
      <h3 className="mb-2 font-semibold">{question.question}</h3>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
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
