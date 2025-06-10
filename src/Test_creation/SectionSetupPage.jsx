import React, { useState } from 'react';
import './SectionSetupPage.css'; // Import its own CSS file

const SectionCard = ({ section, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate(section.id, name, type === 'checkbox' ? checked : value);
    };

    return (
        <div className="section-form-card">
            <h2 className="section-title">{section.name || `Section ${section.id}`}</h2>
            <form>
                <div className="form-row"><div className="form-group"><label>Section name</label><input type="text" name="name" value={section.name} onChange={handleChange} /></div><div className="form-group"><label>Section type</label><select name="type" value={section.type} onChange={handleChange}><option value="">Select a type...</option><option value="mcq">Multiple Choice</option><option value="fib">Fill in the blanks</option><option value="audio">Audio</option><option value="video">Video</option><option value="paragraph">Paragraph</option></select></div></div>
                <div className="form-row"><div className="form-group"><label>Time Limit</label><input type="text" name="timeLimit" value={section.timeLimit} onChange={handleChange} /></div><div className="form-group"><label>No of Questions</label><input type="number" name="numQuestions" value={section.numQuestions} onChange={handleChange} /></div></div>
                <div className="form-row"><div className="form-group"><label>Marks per question</label><input type="number" name="marksPerQuestion" value={section.marksPerQuestion} onChange={handleChange} /></div><div className="form-group"><label>Max marks</label><input type="number" name="maxMarks" value={section.maxMarks} onChange={handleChange} /></div></div>
                <div className="form-row"><div className="form-group"><label>Min marks</label><input type="number" name="minMarks" value={section.minMarks} onChange={handleChange} /></div><div className="form-group"><label>Negative marks</label><input type="number" name="negativeMarks" value={section.negativeMarks} onChange={handleChange} /></div></div>
                <div className="form-row"><div className="checkbox-group"><input type="checkbox" name="shuffleQuestions" checked={section.shuffleQuestions} onChange={handleChange} /><label>Shuffle questions</label></div><div className="checkbox-group"><input type="checkbox" name="shuffleAnswers" checked={section.shuffleAnswers} onChange={handleChange} /><label>Shuffle answers</label></div></div>
                <div className="form-group full-width"><label>Section instructions</label><textarea name="instructions" value={section.instructions} onChange={handleChange}></textarea></div>
                <div className="section-actions"><button type="button" className="action-btn btn-secondary">Back</button><button type="button" className="action-btn btn-primary">Save Section</button></div>
            </form>
        </div>
    );
};

const SectionSetupPage = ({ onBack, onNext, initialQuizData }) => {
    const [sections, setSections] = useState([{ id: 1, name: initialQuizData.details.title || 'Section 1', type: 'mcq', timeLimit: '00:00:00', numQuestions: 5, shuffleQuestions: true, shuffleAnswers: true, instructions: '', marksPerQuestion: '', maxMarks: '', minMarks: '', negativeMarks: '' }]);
    const handleAddSection = () => { const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1; setSections([...sections, { id: newId, name: `Section ${newId}`, type: 'mcq', timeLimit: '00:00:00', numQuestions: 5, shuffleQuestions: true, shuffleAnswers: true, instructions: '', marksPerQuestion: '', maxMarks: '', minMarks: '', negativeMarks: '' }]); };
    const handleUpdateSection = (id, fieldName, value) => { setSections(sections.map(s => s.id === id ? { ...s, [fieldName]: value } : s)); };
    const handleProceedToNext = () => { onNext({ sections }); }

    return (
        <div className="page-container">
            <div className="container-header"><h1 className="container-title">Create a quiz</h1><button className="import-button">Import Section from Old Quiz</button></div>
            <nav className="creator-tabs"><a href="#" className="tab-item active">Sections</a><a href="#" className="tab-item">Settings</a><a href="#" className="tab-item">Preview</a></nav>
            {sections.map(section => <SectionCard key={section.id} section={section} onUpdate={handleUpdateSection} />)}
            <div className="add-section-container"><button className="action-btn btn-secondary" onClick={handleAddSection}>Add Section</button></div>
            <div className="main-nav-actions"><button className="action-btn btn-secondary" onClick={onBack}>Back</button><button className="action-btn btn-primary" onClick={handleProceedToNext}>Next</button></div>
        </div>
    );
};

export default SectionSetupPage;