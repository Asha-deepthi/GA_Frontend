// SectionSetupPage.jsx
import React, { useState } from 'react';

// --- STYLES ---
const styles = `
    /* ... Your styles remain the same ... */
    :root { --primary-color: #00A99D; --border-color: #E8E8E8; --label-color: #262626; --gray-color: #8C8C8C; --white-color: #FFFFFF; --light-gray-bg: #F5F5F5; --body-bg-color: #FAFAFA; }
    body { background-color: var(--white-color); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; }
    .page-container { max-width: 900px; margin: 32px auto; padding: 0 16px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title { color: var(--primary-color); font-size: 1.8rem; font-weight: 600; margin: 0; }
    .creator-tabs { display: flex; gap: 32px; border-bottom: 1px solid var(--border-color); margin-bottom: 30px; }
    .tab-item { text-decoration: none; color: var(--gray-color); padding: 0 4px 12px 4px; font-weight: 500; border-bottom: 3px solid transparent; font-size: 16px; }
    .tab-item.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .section-form-card { margin-bottom: 30px; }
    .section-title { color: var(--primary-color); font-size: 1.4rem; font-weight: 600; margin: 0 0 25px 0; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 25px; }
    .form-row .form-group:only-child { grid-column: 1 / 2; }
    .form-group { display: flex; flex-direction: column; }
    .form-group.full-width { grid-column: 1 / -1; }
    label { margin-bottom: 8px; font-weight: 500; font-size: 0.9rem; color: var(--label-color); }
    input[type="text"], input[type="number"], textarea, select { width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 1rem; box-sizing: border-box; font-family: inherit; background-color: var(--white-color); }
    textarea { min-height: 100px; resize: vertical; }
    .calculated-field { display: flex; align-items: center; background-color: #f5f5f5; color: #595959; padding: 0 12px; border: 1px solid var(--border-color); border-radius: 6px; height: 42px; box-sizing: border-box; font-size: 1rem; width: 100%; }
    .section-actions { display: flex; justify-content: flex-end; align-items: center; margin-top: 25px; }
    .add-section-container { display: flex; justify-content: center; margin-bottom: 30px; }
    .add-section-container .action-btn { width: 100%; border: 1px dashed #D9D9D9; background-color: #FAFAFA; color: var(--gray-color); padding: 12px; }
    .main-nav-actions { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color); }
    .action-btn { border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; }
    .btn-primary { background-color: var(--primary-color); color: var(--white-color); }
    .btn-secondary { background-color: var(--light-gray-bg); border: 1px solid var(--border-color); color: var(--label-color); }
`;


const SectionCard = ({ section, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate(section.id, name, value);
    };

    const numQuestions = parseFloat(section.numQuestions) || 0;
    const marksPerQuestion = parseFloat(section.marksPerQuestion) || 0;
    const negativeMarks = parseFloat(section.negativeMarks) || 0;
    const calculatedMaxMarks = numQuestions * marksPerQuestion;
    const calculatedMinMarks = -1 * (numQuestions * negativeMarks);

    return (
        <div className="section-form-card">
            <h2 className="section-title">{section.name || `Section ${section.id}`}</h2>
            <form>
                <div className="form-row">
                    <div className="form-group"><label>Section name</label><input type="text" name="name" value={section.name} onChange={handleChange} /></div>
                    <div className="form-group">
                        <label>Section type</label>
                        <select name="type" value={section.type} onChange={handleChange}>
                            <option value="">Select a type...</option>
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="Fill in the blank">Fill in the blank</option>
                            <option value="Subjective">Subjective type</option>
                            <option value="Audio based">Audio based</option>
                            <option value="Video based">Video based</option>
                            <option value="Paragraph">Paragraph</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Time limit </label><input type="text" name="timeLimit" value={section.timeLimit} onChange={handleChange} /></div>
                    <div className="form-group"><label>No of Questions</label><input type="number" name="numQuestions" value={section.numQuestions} onChange={handleChange} /></div>
                </div>
                <div className="form-row">
                        <div className="form-group"><label>Marks per question</label><input type="number" name="marksPerQuestion" value={section.marksPerQuestion} onChange={handleChange} /></div>
                        <div className="form-group"><label>Negative marks</label><input type="number" step="0.25" name="negativeMarks" value={section.negativeMarks} onChange={handleChange} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Max marks</label><div className="calculated-field">{calculatedMaxMarks}</div></div>
                        <div className="form-group"><label>Min marks</label><div className="calculated-field">{calculatedMinMarks}</div></div>
                    </div>
                <div className="form-group full-width">
                    <label>Section instructions</label>
                    <textarea name="instructions" value={section.instructions} onChange={handleChange}></textarea>
                </div>
            </form>
        </div>
    );
};

const SectionSetupPage = ({ onBack, onNext, initialQuizData }) => {
    const createNewSection = (id) => ({
        id, name: `Section ${id}`, type: 'Multiple Choice', timeLimit: '00:10:00', numQuestions: 5,
        marksPerQuestion: 1, negativeMarks: 0, instructions: ''
    });

const [sections, setSections] = useState(
    (initialQuizData?.sections && initialQuizData.sections.length > 0) 
    ? initialQuizData.sections 
    : [createNewSection(1)]
);
    
    const handleAddSection = () => {
        const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1;
        setSections([...sections, createNewSection(newId)]);
    };
    
    const handleUpdateSection = (id, fieldName, value) => {
        setSections(sections.map(s => s.id === id ? { ...s, [fieldName]: value } : s));
    };
    
    const handleProceedToNext = () => {
        const sectionsWithFinalMarks = sections.map(section => {
            const numQ = parseFloat(section.numQuestions) || 0;
            const marksQ = parseFloat(section.marksPerQuestion) || 0;
            const negMarks = parseFloat(section.negativeMarks) || 0;
            return { ...section, maxMarks: numQ * marksQ, minMarks: -1 * (numQ * negMarks) };
        });
        onNext({ sections: sectionsWithFinalMarks });
    };

    return (
        <div className="page-container">
            <style>{styles}</style>
            <div className="page-header"><h1 className="page-title">Create a quiz</h1></div>
            <nav className="creator-tabs"><a href="#" className="tab-item active">Sections</a><a href="#" className="tab-item">Questions</a><a href="#" className="tab-item">Settings</a><a href="#" className="tab-item">Preview</a></nav>
            {sections.map(section => (<SectionCard key={section.id} section={section} onUpdate={handleUpdateSection} />))}
            <div className="add-section-container"><button className="action-btn" onClick={handleAddSection}>Add Section</button></div>
            <div className="main-nav-actions"><button className="action-btn btn-secondary" onClick={onBack}>Back</button><button className="action-btn btn-primary" onClick={handleProceedToNext}>Next</button></div>
        </div>
    );
};

export default SectionSetupPage;