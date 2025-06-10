import React from 'react';

const SectionForm = ({ sectionData, onSectionChange, onRemoveSection, isFirstSection }) => {
  const { id, name, type, timeLimit, numQuestions, shuffleQuestions, shuffleAnswers, instructions } = sectionData;

  // Generic handler to call the parent's update function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onSectionChange(id, name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="section-form-container">
      <div className="section-header">
        <h2>{name || 'New Section'}</h2>
        {!isFirstSection && (
          <button 
            className="btn-remove"
            onClick={() => onRemoveSection(id)}
          >
            Remove
          </button>
        )}
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`section-name-${id}`}>Section name</label>
          <input
            type="text"
            id={`section-name-${id}`}
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`section-type-${id}`}>Section type</label>
          <input
            type="text"
            id={`section-type-${id}`}
            name="type"
            value={type}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`time-limit-${id}`}>Time limit</label>
          <input
            type="text"
            id={`time-limit-${id}`}
            name="timeLimit"
            value={timeLimit}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`num-questions-${id}`}>No of Questions</label>
          <input
            type="number"
            id={`num-questions-${id}`}
            name="numQuestions"
            value={numQuestions}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="checkbox-grid">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id={`shuffle-questions-${id}`}
            name="shuffleQuestions"
            checked={shuffleQuestions}
            onChange={handleChange}
          />
          <label htmlFor={`shuffle-questions-${id}`}>Shuffle questions</label>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id={`shuffle-answers-${id}`}
            name="shuffleAnswers"
            checked={shuffleAnswers}
            onChange={handleChange}
          />
          <label htmlFor={`shuffle-answers-${id}`}>Shuffle answers</label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`section-instructions-${id}`}>Section instructions</label>
        <textarea
          id={`section-instructions-${id}`}
          name="instructions"
          rows="6"
          value={instructions}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
};

export default SectionForm;