import { useState } from 'react';

const MultipleChoiceComponent = ({ question }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:8000/test-execution/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: question.question_id,
        question_type: question.question_type,
        answer: selectedOption
      })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{question.question}</h3>
      {question.options.map((opt) => (
        <label key={opt.option}>
          <input
            type="radio"
            name="option"
            value={opt.value}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          {opt.option}. {opt.value}
        </label>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MultipleChoiceComponent;
