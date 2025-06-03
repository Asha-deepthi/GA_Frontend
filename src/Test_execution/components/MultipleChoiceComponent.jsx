import React,{ useState, useEffect } from 'react';

const MultipleChoiceComponent = ({ question, onAnswerUpdate, currentStatus, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(currentStatus?.answer || '');

  useEffect(() => {
    // Set the answer if returning to a previously answered question
    setSelectedAnswer(currentStatus?.answer || '');
  }, [question.question_id]);

  const handleOptionClick = (option) => {
    setSelectedAnswer((prev) => (prev === option ? '' : option));
  };

  const handleSaveAndNext = () => {
    onAnswerUpdate(question.question_id, {
      answer: selectedAnswer,
      markedForReview: false,
    });
    if (onNext) onNext();
  };

  const handleMarkForReview = () => {
    onAnswerUpdate(question.question_id, {
      answer: selectedAnswer,
      markedForReview: true,
    });
    if (onNext) onNext();
  };

  return (
    <div>
      <p className="mb-4 font-semibold">{question.question}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(opt)}
            className={`border rounded px-4 py-2 cursor-pointer transition ${
              selectedAnswer === opt
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {opt}
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
