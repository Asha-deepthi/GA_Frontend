// CreateQuestionsPage.jsx

import React, { useState } from 'react';

// --- Child Component 1: AnswerOption ---
// Used for displaying a single answer option in an MCQ question.
const AnswerOption = ({ option, onUpdate, onDelete, inputType, name }) => (
    <div className="answer-option">
        <div className="answer-option-fields">
            <div className="form-row">
                <div className="form-group">
                    <label>Answer Text</label>
                    <input type="text" value={option.text} onChange={(e) => onUpdate(option.id, 'text', e.target.value)} placeholder="Option" />
                </div>
                <div className="form-group">
                    <label>Answer Weightage</label>
                    <input type="text" value={option.weightage} onChange={(e) => onUpdate(option.id, 'weightage', e.target.value)} placeholder="Weightage" />
                </div>
            </div>
            <div className="checkbox-group answer-correct-marker">
                <input type={inputType} id={`correct-${option.id}`} checked={option.isCorrect} onChange={(e) => onUpdate(option.id, 'isCorrect', e.target.checked)} name={name} />
                <label htmlFor={`correct-${option.id}`}>Mark as Correct</label>
            </div>
        </div>
        <button type="button" className="delete-option-btn" onClick={() => onDelete(option.id)}>×</button>
    </div>
);


// --- Child Component 2: QuestionForm ---
// This component contains all the logic for creating any type of question.
const QuestionForm = ({ sectionType, onSave, onCancel }) => {
    // State for all possible question fields
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState([ { id: 1, text: '', weightage: '', isCorrect: false }, { id: 2, text: '', weightage: '', isCorrect: false } ]);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [fibAnswer, setFibAnswer] = useState('');
    const [paragraphContent, setParagraphContent] = useState('');
    const [subQuestions, setSubQuestions] = useState([]);
    const [videoTime, setVideoTime] = useState(60);
    const [audioTime, setAudioTime] = useState(60);

    // --- All Handler Functions ---
    const handleAddOption = () => setAnswers([...answers, { id: Date.now(), text: '', weightage: '', isCorrect: false }]);
    const handleDeleteOption = (id) => setAnswers(answers.filter(a => a.id !== id));
    const handleAnswerUpdate = (id, field, value) => { let newAnswers = [...answers]; if (field === 'isCorrect' && value && !allowMultiple) { newAnswers = newAnswers.map(a => ({...a, isCorrect: false})); } const answerIndex = newAnswers.findIndex(a => a.id === id); if (answerIndex > -1) { newAnswers[answerIndex] = { ...newAnswers[answerIndex], [field]: value }; setAnswers(newAnswers); } };
    
    const handleAddSubQuestion = () => {
        if (subQuestions.length >= 5) return;
        const newSubQuestion = {
            id: `sq-${Date.now()}`, type: 'mcq', text: '',
            options: [{ id: `sqo-${Date.now()}-1`, text: '', isCorrect: false }, { id: `sqo-${Date.now()}-2`, text: '', isCorrect: false }],
            correctAnswer: '',
            videoTime: 60,
            audioTime: 60,
        };
        setSubQuestions([...subQuestions, newSubQuestion]);
    };
    const handleRemoveSubQuestion = (subQuestionId) => setSubQuestions(subQuestions.filter(sq => sq.id !== subQuestionId));
    const handleSubQuestionChange = (subQuestionId, field, value) => setSubQuestions(prev => prev.map(sq => sq.id === subQuestionId ? { ...sq, [field]: value } : sq));
    const handleAddSubQuestionOption = (subQuestionId) => setSubQuestions(prev => prev.map(sq => sq.id === subQuestionId ? { ...sq, options: [...sq.options, { id: `sqo-${Date.now()}`, text: '', isCorrect: false }] } : sq));
    const handleSubQuestionOptionChange = (subQuestionId, optionId, field, value) => setSubQuestions(prev => prev.map(sq => sq.id === subQuestionId ? { ...sq, options: sq.options.map(opt => opt.id === optionId ? { ...opt, [field]: value } : opt) } : sq));
    const handleRemoveSubQuestionOption = (subQuestionId, optionId) => setSubQuestions(prev => prev.map(sq => (sq.id === subQuestionId && sq.options.length > 2) ? { ...sq, options: sq.options.filter(opt => opt.id !== optionId) } : sq));

    const handleSave = () => {
        onSave({
            type: sectionType,
            text: questionText,
            answers: sectionType === 'mcq' ? answers : (sectionType === 'fib' ? [{ text: fibAnswer }] : []),
            paragraph: paragraphContent,
            subQuestions: subQuestions,
            videoTime: videoTime,
            audioTime: audioTime
        });
    };

    let formContent = null;

    if (sectionType === 'mcq') {
        formContent = (
            <>
                <div className="form-group full-width"><label>Question Text</label><textarea value={questionText} onChange={e => setQuestionText(e.target.value)} /></div>
                <h3 className="answer-options-header">Answer Options</h3>
                {answers.map(opt => <AnswerOption key={opt.id} option={opt} onUpdate={handleAnswerUpdate} onDelete={handleDeleteOption} inputType={allowMultiple ? 'checkbox' : 'radio'} name="correct-answer" />)}
            </>
        );
    } else if (sectionType === 'fib') {
        formContent = (
            <>
                <div className="form-group full-width"><label>Question Text (use ___ for blanks)</label><textarea value={questionText} onChange={e => setQuestionText(e.target.value)} /></div>
                <div className="form-group full-width"><label>Correct Answer</label><input type="text" value={fibAnswer} onChange={e => setFibAnswer(e.target.value)} placeholder="Enter the correct word for the blank" /></div>
            </>
        );
    } else if (sectionType === 'paragraph') {
        formContent = (
            <>
                <div className="form-group full-width"><label>Paragraph Content</label><textarea rows="8" value={paragraphContent} onChange={(e) => setParagraphContent(e.target.value)} placeholder="Enter the passage text here..." /></div>
                <div className="sub-questions-container">
                    <div className="sub-question-header">
                        <h4>Sub-Questions ({subQuestions.length}/5)</h4>
                        {subQuestions.length < 5 && <button type="button" className="action-btn btn-light" onClick={handleAddSubQuestion}>+ Add Sub-Question</button>}
                    </div>
                    {subQuestions.map((sq, index) => (
                        <div key={sq.id} className="sub-question-editor">
                            <div className="sub-question-editor-header"><strong>Sub-Question {index + 1}</strong><button type="button" className="delete-option-btn" onClick={() => handleRemoveSubQuestion(sq.id)}>×</button></div>
                            <div className="form-row">
                                <div className="form-group"><label>Question Text</label><input type="text" value={sq.text} onChange={e => handleSubQuestionChange(sq.id, 'text', e.target.value)} /></div>
                                <div className="form-group"><label>Question Type</label><select value={sq.type} onChange={e => handleSubQuestionChange(sq.id, 'type', e.target.value)}><option value="mcq">Multiple Choice</option><option value="fib">Fill in the Blank</option><option value="audio">Audio Response</option><option value="video">Video Response</option></select></div>
                            </div>
                            {sq.type === 'mcq' && (
                                <div className="sub-question-options">
                                    <label>Answer Options</label>
                                    {sq.options.map(opt => (
                                        <div key={opt.id} className="sub-question-option-row">
                                            <input type="checkbox" checked={opt.isCorrect} onChange={e => handleSubQuestionOptionChange(sq.id, opt.id, 'isCorrect', e.target.checked)} />
                                            <input type="text" className="sub-option-text" value={opt.text} onChange={e => handleSubQuestionOptionChange(sq.id, opt.id, 'text', e.target.value)} placeholder="Option text" />
                                            <button type="button" className="delete-option-btn small" onClick={() => handleRemoveSubQuestionOption(sq.id, opt.id)}>×</button>
                                        </div>
                                    ))}
                                    <button type="button" className="action-btn btn-light btn-small" onClick={() => handleAddSubQuestionOption(sq.id)}>Add Option</button>
                                </div>
                            )}
                            {sq.type === 'fib' && (
                                <div className="form-group"><label>Correct Answer for Fill-in-the-Blank</label><input type="text" value={sq.correctAnswer} onChange={e => handleSubQuestionChange(sq.id, 'correctAnswer', e.target.value)} /></div>
                            )}
                            {sq.type === 'audio' && (
                                <div className="form-group">
                                    <label>Max Audio Recording Time (seconds)</label>
                                    <input 
                                        type="number" 
                                        value={sq.audioTime || 60} 
                                        onChange={e => handleSubQuestionChange(sq.id, 'audioTime', e.target.value)} 
                                    />
                                </div>
                            )}

                            {/* --- ADDED: Rendering logic for Video sub-questions --- */}
                            {sq.type === 'video' && (
                                <div className="form-group">
                                    <label>Max Video Recording Time (seconds)</label>
                                    <input 
                                        type="number" 
                                        value={sq.videoTime || 60} 
                                        onChange={e => handleSubQuestionChange(sq.id, 'videoTime', e.target.value)} 
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </>
        );
    } else if (sectionType === 'audio' || sectionType === 'video' || sectionType === 'text') {
        formContent = (
            <>
                <div className="form-group full-width">
                    <label>Question/Prompt Text</label>
                    <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder={`Enter the prompt for the ${sectionType} response...`} />
                </div>
                {sectionType === 'audio' && <div className="form-group"><label>Max Recording Time (seconds)</label><input type="number" value={audioTime} onChange={e => setAudioTime(e.target.value)} /></div>}
                {sectionType === 'video' && <div className="form-group"><label>Max Recording Time (seconds)</label><input type="number" value={videoTime} onChange={e => setVideoTime(e.target.value)} /></div>}
            </>
        );
    } else {
        formContent = <p>This section does not have a defined question type. Please go back and select a type for this section.</p>;
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

// --- The Main Page Component ---
const CreateQuestionsPage = ({ onBack, onNext, quizData }) => {
    // This state logic is fine. It manages the sections and questions for this page.
    const [sections, setSections] = useState(quizData?.sections || []);
    const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null);
    const [addingQuestionTo, setAddingQuestionTo] = useState(null);
    const activeSection = sections.find(s => s.id === activeSectionId);
    
    // This handler correctly adds a new question to the local state.
    const handleSaveQuestion = (questionData) => {
        const updatedSections = sections.map(sec => {
            if (sec.id === addingQuestionTo) {
                const existingQuestions = sec.questions || [];
                return { ...sec, questions: [...existingQuestions, questionData] };
            }
            return sec;
        });
        setSections(updatedSections);
        setAddingQuestionTo(null);
    };

    const handleTabClick = (id) => {
        setActiveSectionId(id);
        setAddingQuestionTo(null);
    };

    const getDisplayType = (type) => {
        const types = { mcq: 'Multiple Choice', fib: 'Fill In The Blank', audio: 'Audio', video: 'Video', paragraph: 'Paragraph', text: 'Text Answer' };
        return types[type] || type.toUpperCase();
    };

    return (
        <div className="page-container">
            <div className="container-header"><h1 className="container-title">Create a quiz</h1></div>
            <nav className="creator-tabs">
                <a href="#" className="tab-item active">Sections</a>
                <a href="#" className="tab-item">Settings</a>
                <a href="#" className="tab-item">Preview</a>
            </nav>
            <nav className="section-tabs">
                {sections.map(sec => (
                    <button key={sec.id} className={`section-tab-item ${sec.id === activeSectionId ? 'active' : ''}`} onClick={() => handleTabClick(sec.id)}>
                        {sec.name}
                    </button>
                ))}
            </nav>
            
            {activeSection ? (
                <div>
                    {/* The read-only section details card */}
                    <div className="section-details-card">
                        <div className="form-row"><div className="form-group"><label>Section name</label><input type="text" value={activeSection.name} readOnly /></div><div className="form-group"><label>Section type</label><input type="text" value={getDisplayType(activeSection.type)} readOnly /></div></div>
                        <div className="form-row"><div className="form-group"><label>Time Limit</label><input type="text" value={activeSection.timeLimit} readOnly /></div><div className="form-group"><label>No of Questions</label><input type="text" value={activeSection.numQuestions} readOnly /></div></div>
                        <div className="form-row"><div className="checkbox-group"><input type="checkbox" checked={activeSection.shuffleQuestions} readOnly /><label>Shuffle questions</label></div><div className="checkbox-group"><input type="checkbox" checked={activeSection.shuffleAnswers} readOnly /><label>Shuffle answers</label></div></div>
                        <div className="form-group full-width"><label>Section instructions</label><textarea value={activeSection.instructions} readOnly></textarea></div>
                    </div>

                    {/* Display already added questions */}
                    {activeSection.questions?.map((q, i) => (
                        <div className="section-details-card" key={q.id}>
                            <strong>Question {i+1}:</strong> {q.text || `Paragraph with ${q.subQuestions?.length || 0} sub-question(s)`}
                        </div>
                    ))}
                    
                    {/* Conditionally render the QuestionForm or the "Add question" button */}
                    {addingQuestionTo === activeSection.id ? (
                        <QuestionForm 
                            sectionType={activeSection.type} 
                            onSave={handleSaveQuestion} 
                            onCancel={() => setAddingQuestionTo(null)} 
                        />
                    ) : (
                        <div className="add-question-btn-container">
                            <button className="action-btn btn-secondary" onClick={() => setAddingQuestionTo(activeSection.id)}>Add question</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>No sections available. Go back to create one.</p>
            )}

            <div className="main-nav-actions">
                <button className="action-btn btn-secondary" onClick={onBack}>Back</button>
                <button className="action-btn btn-primary" onClick={() => onNext({ sections })}>Next</button>
            </div>
        </div>
    );
};

export default CreateQuestionsPage;