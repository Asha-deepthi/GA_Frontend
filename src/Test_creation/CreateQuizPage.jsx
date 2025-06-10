import React, { useState, Suspense } from 'react';
// Note: I have renamed the CSS file in the import to keep things consistent.
// Make sure your CSS file is named App.css or change this import.
// import './CreateQuizForm.css'; 

// Dynamically import ReactQuill to prevent server-side errors
const ReactQuill = React.lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

// --- Reusable Answer Option Component ---
const AnswerOption = ({ option, onUpdate, onDelete, inputType, name }) => {
    return (
        <div className="answer-option">
            <div className="answer-option-fields">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor={`answer-text-${option.id}`}>Answer Text</label>
                        <input type="text" id={`answer-text-${option.id}`} value={option.text} placeholder={`Option ${option.id}`} onChange={(e) => onUpdate(option.id, 'text', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`answer-weight-${option.id}`}>Answer Weightage</label>
                        <input type="text" id={`answer-weight-${option.id}`} value={option.weightage} placeholder="Weightage" onChange={(e) => onUpdate(option.id, 'weightage', e.target.value)} />
                    </div>
                </div>
                <div className="checkbox-group answer-correct-marker">
                    <input type={inputType} id={`answer-correct-${option.id}`} checked={option.isCorrect} onChange={(e) => onUpdate(option.id, 'isCorrect', e.target.checked)} name={name} />
                    <label htmlFor={`answer-correct-${option.id}`}>Mark as Correct</label>
                </div>
            </div>
            <button type="button" className="delete-option-btn" onClick={() => onDelete(option.id)}>×</button>
        </div>
    );
};

// --- Main Question Form Component ---
const QuestionForm = ({ section, onSave, onCancel }) => {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState([ { id: 1, text: '', weightage: '', isCorrect: false }, { id: 2, text: '', weightage: '', isCorrect: false }, { id: 3, text: '', weightage: '', isCorrect: false }, { id: 4, text: '', weightage: '', isCorrect: false }, ]);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [paragraphContent, setParagraphContent] = useState('');
    const handleAddOption = () => { const newId = answers.length > 0 ? Math.max(...answers.map(a => a.id)) + 1 : 1; setAnswers([...answers, { id: newId, text: '', weightage: '', isCorrect: false }]); };
    const handleDeleteOption = (idToDelete) => { setAnswers(answers.filter(a => a.id !== idToDelete)); };
    const handleAnswerUpdate = (id, field, value) => { let newAnswers = [...answers]; const answerIndex = newAnswers.findIndex(a => a.id === id); if (field === 'isCorrect' && value === true && !allowMultiple) { newAnswers = newAnswers.map(a => ({ ...a, isCorrect: false })); } newAnswers[answerIndex] = { ...newAnswers[answerIndex], [field]: value }; setAnswers(newAnswers); };
    const handleSaveQuestion = () => { const questionData = { id: Date.now(), type: section.type, text: questionText, paragraph: paragraphContent, answers: section.type === 'mcq' ? answers : [], }; onSave(questionData); onCancel(); };
    const renderFormContent = () => { switch (section.type) { case 'mcq': return ( <> <div className="form-group full-width"> <label htmlFor="question-text">Question Text - 1</label> <textarea id="question-text" value={questionText} onChange={e => setQuestionText(e.target.value)}></textarea> </div> <h3 className="answer-options-header">Answer Options</h3> {answers.map(opt => ( <AnswerOption key={opt.id} option={opt} onUpdate={handleAnswerUpdate} onDelete={handleDeleteOption} inputType={allowMultiple ? 'checkbox' : 'radio'} name={`correct-answer-${section.id}`} /> ))} <div className="actions-footer"> <div className="toggle-switch-group"> <label className="toggle-switch"> <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} /> <span className="toggle-slider"></span> </label> <span>Allow Multiple Correct Answers</span> </div> <button type="button" className="action-btn btn-light" onClick={handleAddOption}>Add More Options</button> </div> </> ); case 'fib': return ( <div className="form-group full-width"> <label htmlFor="question-text">Question Text</label> <p>Use three underscores `___` to indicate where the blank should be.</p> <textarea id="question-text" value={questionText} onChange={e => setQuestionText(e.target.value)}></textarea> </div> ); case 'paragraph': return ( <> <div className="form-group full-width"> <label>Paragraph Content</label> <Suspense fallback={<div>Loading Editor...</div>}> <ReactQuill theme="snow" value={paragraphContent} onChange={setParagraphContent} /> </Suspense> </div> <p>After saving the paragraph, you will be able to add up to 5 questions (MCQ or Fill in the blanks) related to it.</p> </> ); default: return <p>Select a section type to see question options.</p>; } };
    return ( <div className="question-form-card"> {renderFormContent()} <div className="actions-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '30px' }}> <div></div> <div className="actions-right"> <button type="button" className="action-btn btn-secondary" onClick={onCancel}>Cancel</button> <button type="button" className="action-btn btn-primary" onClick={handleSaveQuestion}>Save Question</button> </div> </div> </div> );
};


// --- Main Page Component ---
const CreateQuizPage = ({ onBack, quizDetails }) => {
    const [sections, setSections] = useState([ { id: 1, name: quizDetails.title || 'Section 1', type: 'mcq', timeLimit: '00:30:00', numQuestions: 5, shuffleQ: true, shuffleA: true, instructions: '', questions: [] }, { id: 2, name: 'Section 2', type: 'fib', timeLimit: '00:15:00', numQuestions: 3, shuffleQ: false, shuffleA: false, instructions: '', questions: [] }, { id: 3, name: 'Section 3', type: 'paragraph', timeLimit: '00:45:00', numQuestions: 1, shuffleQ: false, shuffleA: false, instructions: '', questions: [] }, ]);
    const [activeSectionId, setActiveSectionId] = useState(1);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const activeSection = sections.find(s => s.id === activeSectionId);
    const handleSaveQuestion = (questionData) => { const updatedSections = sections.map(sec => { if (sec.id === activeSectionId) { return { ...sec, questions: [...sec.questions, questionData] }; } return sec; }); setSections(updatedSections); setShowQuestionForm(false); console.log("Updated Sections State:", updatedSections); };

    return (
        <div className="quiz-creator-container">
            <h1 className="creator-title">Create a quiz</h1>
            <nav className="section-tabs"> {sections.map(sec => ( <button key={sec.id} className={`section-tab-item ${sec.id === activeSectionId ? 'active' : ''}`} onClick={() => setActiveSectionId(sec.id)}> {sec.name} </button> ))} </nav>
            {activeSection && ( <div className="section-details-card"> <div className="form-row"> <div className="form-group"><label>Section name</label><input type="text" value={activeSection.name} readOnly /></div> <div className="form-group"><label>Section type</label><input type="text" value={activeSection.type.toUpperCase()} readOnly /></div> </div> <div className="form-row"> <div className="form-group"><label>Time Limit</label><input type="text" value={activeSection.timeLimit} readOnly /></div> <div className="form-group"><label>No of Questions</label><input type="text" value={activeSection.numQuestions} readOnly /></div> </div> <div className="form-row"> <div className="checkbox-group"><input type="checkbox" checked={activeSection.shuffleQ} readOnly /><label>Shuffle questions</label></div> <div className="checkbox-group"><input type="checkbox" checked={activeSection.shuffleA} readOnly /><label>Shuffle answers</label></div> </div> </div> )}
            {activeSection && activeSection.questions.length > 0 && ( <div className="existing-questions-list"> <h3 className="card-title">Added Questions</h3> {activeSection.questions.map((q, index) => <div key={q.id} className="section-details-card"><p><strong>{index + 1}. {q.type.toUpperCase()}:</strong> {q.text || "Paragraph Question"}</p></div>)} </div> )}
            {showQuestionForm ? ( <QuestionForm section={activeSection} onSave={handleSaveQuestion} onCancel={() => setShowQuestionForm(false)} /> ) : ( <button className="action-btn btn-secondary add-question-btn" onClick={() => setShowQuestionForm(true)}>Add question</button> )}
            <div className="actions-footer">
                <button className="action-btn btn-secondary" onClick={onBack}>Back</button>
                <button className="action-btn btn-primary">Next</button>
            </div>
        </div>
    );
};

export default CreateQuizPage;