import { useState } from 'react';

const IntegerComponent = ({ question }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/store-answer/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: question.question_id,
        question_type: question.question_type,
        answer: parseInt(answer)
      })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{question.question}</h3>
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default IntegerComponent;
