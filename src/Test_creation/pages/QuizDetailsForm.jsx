// QuizDetailsForm.jsx
/*import React, { useState } from 'react';
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

export default QuizDetailsForm;*/

import React, { useState, useEffect } from 'react';

// This component only knows how to display the form and tell the parent when it's done.
const QuizDetailsForm = ({ onNext, onBack, initialData, onOpenImportModal }) => {
  // Local state for the form fields
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');

  // This `useEffect` is important! It pre-fills the form
  // if the user clicks "Back" from a future step.
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setLevel(initialData.level || '');
      setDescription(initialData.description || '');
      setDuration(initialData.duration || '');
      setTags(initialData.tags || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { title, level, description, duration, tags };
    // Pass the collected data UP to the parent component (QuizCreationFlow)
    onNext({ details: formData });
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      maxWidth: '64rem',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#14b8a6', fontWeight: '600', fontSize: '1.5rem' }}>
            Quiz Details
          </h2>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Enter the basic information about your quiz
          </p>
        </div>
        <button 
          type="button" 
          onClick={onOpenImportModal} 
          style={{ backgroundColor: 'transparent', border: '1px solid #d1d5db', color: '#6b7280', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Import from Old Quiz
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form fields are unchanged */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Quiz Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., History Quiz" style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} required style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
              <option value="" disabled>Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Enter quiz description..." rows={4} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Total Duration (minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required placeholder="e.g., 60" style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Tags</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., History, World War II" style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
          {/* Note: We removed the "Back" button for simplicity, but you could add it and call onBack */}
          <button type="submit" style={{ border: 'none', padding: '0.625rem 2rem', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '500', backgroundColor: '#14b8a6', color: 'white' }}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizDetailsForm;