import { useState } from 'react';

const FillInTheBlankComponent = ({ question }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:8000/test-execution/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: question.question_id,
        question_type: question.question_type,
        answer
      })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{question.question}</h3>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FillInTheBlankComponent;
