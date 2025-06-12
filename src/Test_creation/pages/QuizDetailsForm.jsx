// QuizDetailsForm.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './QuizDetailsForm.css'; // Import its own CSS file

const QuizDetailsForm = ({ onNext }) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { title, level, description, duration, tags, startDate, endDate };
    onNext({ details: formData });
  };

  return (
    <div className="quiz-details-container">
      <div className="quiz-details-header">
        <div className="title-block">
          <h2>Quiz Details</h2>
          <p>Enter the basic information about your quiz.</p>
        </div>
        <button className="import-button">Import from Old Quiz</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group"><label htmlFor="quiz-title">Quiz Title</label><input type="text" id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., History Quiz" /></div>
          <div className="form-group"><label htmlFor="level">Level</label><input type="text" id="level" value={level} onChange={(e) => setLevel(e.target.value)} required /></div>
        </div>
        <div className="form-group full-width"><label htmlFor="description">Description</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea></div>
        <div className="form-row">
            <div className="form-group"><label htmlFor="duration">Total Duration (minutes)</label><input type="number" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 60" required /></div>
            <div className="form-group"><label htmlFor="tags">Tags</label><input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., History, World War II" /></div>
        </div>
        <div className="form-row">
            <div className="form-group"><label htmlFor="start-date">Start Date/Time</label><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} id="start-date" placeholderText="Select Date/Time" showTimeSelect dateFormat="Pp" required /></div>
            <div className="form-group"><label htmlFor="end-date">End Date/Time</label><DatePicker selected={endDate} onChange={(date) => setEndDate(date)} id="end-date" placeholderText="Select Date/Time" showTimeSelect dateFormat="Pp" minDate={startDate} required /></div>
        </div>
        <div className="form-actions"><button type="submit" className="next-button">Next</button></div>
      </form>
    </div>
  );
};

export default QuizDetailsForm;