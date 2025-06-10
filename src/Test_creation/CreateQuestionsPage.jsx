import React, { useState, Suspense } from 'react';

// --- Imports ---
const ReactQuill = React.lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

// --- Child Components (These are fine and do not need changes) ---
const AnswerOption = ({ option, onUpdate, onDelete, inputType, name }) => ( <div className="answer-option"><div className="answer-option-fields"><div className="form-row"><div className="form-group"><label>Answer Text</label><input type="text" value={option.text} onChange={(e) => onUpdate(option.id, 'text', e.target.value)} placeholder="Option" /></div><div className="form-group"><label>Answer Weightage</label><input type="text" value={option.weightage} onChange={(e) => onUpdate(option.id, 'weightage', e.target.value)} placeholder="Weightage" /></div></div><div className="checkbox-group answer-correct-marker"><input type={inputType} id={`correct-${option.id}`} checked={option.isCorrect} onChange={(e) => onUpdate(option.id, 'isCorrect', e.target.checked)} name={name} /><label htmlFor={`correct-${option.id}`}>Mark as Correct</label></div></div><button type="button" className="delete-option-btn" onClick={() => onDelete(option.id)}>×</button></div> );
const SubQuestionForm = ({ type, onSave, onCancel }) => { /* ... Unchanged ... */ };

// --- Main Question Form Component ---
const QuestionForm = ({ sectionType, onSave, onCancel }) => {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState([ { id: 1, text: '', weightage: '', isCorrect: false }, { id: 2, text: '', weightage: '', isCorrect: false } ]);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [fibAnswer, setFibAnswer] = useState('');
    const [paragraphContent, setParagraphContent] = useState('');
    const [subQuestions, setSubQuestions] = useState([]);
    const [isAddingSubQuestion, setIsAddingSubQuestion] = useState(false);
    const [subQuestionType, setSubQuestionType] = useState('mcq');

    const handleAddOption = () => setAnswers([...answers, { id: Date.now(), text: '', weightage: '', isCorrect: false }]);
    const handleDeleteOption = (id) => setAnswers(answers.filter(a => a.id !== id));
    const handleAnswerUpdate = (id, field, value) => { let newAnswers = [...answers]; if (field === 'isCorrect' && value && !allowMultiple) { newAnswers = newAnswers.map(a => ({...a, isCorrect: false})); } const answerIndex = newAnswers.findIndex(a => a.id === id); if (answerIndex > -1) { newAnswers[answerIndex] = { ...newAnswers[answerIndex], [field]: value }; setAnswers(newAnswers); } };
    const handleSave = () => { onSave({ id: Date.now(), type: sectionType, text: questionText, answers: sectionType === 'mcq' ? answers : [{text: fibAnswer}], paragraph: paragraphContent, subQuestions }); };
    const handleSaveSubQuestion = (subQuestionData) => { setSubQuestions([...subQuestions, subQuestionData]); setIsAddingSubQuestion(false); };

    // This is the core logic. It will return null if the type is unknown, preventing a crash.
    let formContent = null;

    if (sectionType === 'mcq') {
        formContent = (<> <div className="form-group full-width"><label>Question Text</label><textarea value={questionText} onChange={e => setQuestionText(e.target.value)} /></div> <h3 className="answer-options-header">Answer Options</h3> {answers.map(opt => <AnswerOption key={opt.id} option={opt} onUpdate={handleAnswerUpdate} onDelete={handleDeleteOption} inputType={allowMultiple ? 'checkbox' : 'radio'} name={`correct-answer`} />)} </>);
    } else if (sectionType === 'fib') {
        formContent = ( <> <div className="form-group full-width"><label>Question Text (use `___` for blanks)</label><textarea value={questionText} onChange={e => setQuestionText(e.target.value)} /></div> <div className="form-group full-width"><label>Correct Answer</label><input type="text" value={fibAnswer} onChange={e => setFibAnswer(e.target.value)} placeholder="Enter the correct word for the blank" /></div> </> );
    } else if (sectionType === 'paragraph') {
        formContent = ( <> <div className="form-group full-width"><label>Paragraph Content</label><Suspense fallback={<div>Loading Editor...</div>}><ReactQuill theme="snow" value={paragraphContent} onChange={setParagraphContent} /></Suspense></div> <div className="sub-questions-container"><div className="sub-question-header"><h4>Sub-Questions ({subQuestions.length}/5)</h4>{subQuestions.length < 5 && !isAddingSubQuestion && (<div className="add-sub-question-controls"><select value={subQuestionType} onChange={e => setSubQuestionType(e.target.value)}><option value="mcq">Multiple Choice</option><option value="fib">Fill in the Blank</option></select><button type="button" className="action-btn btn-light" onClick={() => setIsAddingSubQuestion(true)}>Add Sub-Question</button></div>)}</div>{subQuestions.map((sq, i) => <div className="sub-question-item" key={sq.id}><strong>{i + 1}. ({sq.type.toUpperCase()})</strong> {sq.text}</div>)}{isAddingSubQuestion && <SubQuestionForm type={subQuestionType} onSave={handleSaveSubQuestion} onCancel={() => setIsAddingSubQuestion(false)} />}</div> </> );
    } else {
        formContent = <p>This section type is not configured for questions.</p>;
    }

    return (
        <div className="question-form-card">
            {formContent}
            
            <div className="question-form-actions">
                {sectionType === 'mcq' && (
                    <div className="mcq-actions-row">
                        <div className="checkbox-group"><input type="checkbox" id="allow-multiple" checked={allowMultiple} onChange={(e) => setAllowMultiple(e.target.checked)} /><label htmlFor="allow-multiple">Allow Multiple Correct Answers</label></div>
                        <button type="button" className="action-btn btn-light" onClick={handleAddOption}>Add More Options</button>
                    </div>
                )}
                <div className="final-form-actions">
                    <button type="button" className="action-btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="button" className="action-btn btn-primary" onClick={handleSave}>Save Question</button>
                </div>
            </div>
        </div>
    );
};


// --- The Main Page Component (No changes needed) ---
const CreateQuestionsPage = ({ onBack, onNext, quizData }) => {
    // ... This entire component remains the same as the last version
    const [sections, setSections] = useState(quizData.sections || []);
    const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null);
    const [addingQuestionTo, setAddingQuestionTo] = useState(null);
    const activeSection = sections.find(s => s.id === activeSectionId);
    
    const handleSaveQuestion = (questionData) => { const updatedSections = sections.map(sec => { if (sec.id === addingQuestionTo) { const existing = sec.questions || []; return { ...sec, questions: [...existing, questionData] }; } return sec; }); setSections(updatedSections); setAddingQuestionTo(null); };
    const handleTabClick = (id) => { setActiveSectionId(id); setAddingQuestionTo(null); };
    const getDisplayType = (type) => { switch(type) { case 'mcq': return 'Multiple Choice'; case 'fib': return 'Fill In The Blank'; case 'audio': return 'Audio'; case 'video': return 'Video'; case 'paragraph': return 'Paragraph'; default: return type.toUpperCase(); } };

    return (
        <div className="page-container">
            <div className="container-header"><h1 className="container-title">Create a quiz</h1></div>
            <nav className="creator-tabs"><a href="#" className="tab-item active">Sections</a><a href="#" className="tab-item">Settings</a><a href="#" className="tab-item">Preview</a></nav>
            <nav className="section-tabs">{sections.map(sec => <button key={sec.id} className={`section-tab-item ${sec.id === activeSectionId ? 'active' : ''}`} onClick={() => handleTabClick(sec.id)}>{sec.name}</button>)}</nav>
            {activeSection ? (<div><div className="section-details-card"><div className="form-row"><div className="form-group"><label>Section name</label><input type="text" value={activeSection.name} readOnly /></div><div className="form-group"><label>Section type</label><input type="text" value={getDisplayType(activeSection.type)} readOnly /></div></div><div className="form-row"><div className="form-group"><label>Time Limit</label><input type="text" value={activeSection.timeLimit} readOnly /></div><div className="form-group"><label>No of Questions</label><input type="text" value={activeSection.numQuestions} readOnly /></div></div><div className="form-row"><div className="checkbox-group"><input type="checkbox" checked={activeSection.shuffleQuestions} readOnly /><label>Shuffle questions</label></div><div className="checkbox-group"><input type="checkbox" checked={activeSection.shuffleAnswers} readOnly /><label>Shuffle answers</label></div></div><div className="form-group full-width"><label>Section instructions</label><textarea value={activeSection.instructions} readOnly></textarea></div></div>{activeSection.questions?.map((q, i) => <div className="section-details-card" key={q.id}><strong>Question {i+1}:</strong> {q.text || `Paragraph with ${q.subQuestions?.length || 0} sub-question(s)`}</div>)}{addingQuestionTo === activeSection.id ? (<QuestionForm sectionType={activeSection.type} onSave={handleSaveQuestion} onCancel={() => setAddingQuestionTo(null)} />) : (<div className="add-question-btn-container"><button className="action-btn btn-secondary" onClick={() => setAddingQuestionTo(activeSection.id)}>Add question</button></div>)}</div>) : <p>No sections available. Go back to create one.</p>}
            <div className="main-nav-actions"><button className="action-btn btn-secondary" onClick={onBack}>Back</button><button className="action-btn btn-primary" onClick={() => onNext({ sections })}>Next</button></div>
        </div>
    );
};

export default CreateQuestionsPage;