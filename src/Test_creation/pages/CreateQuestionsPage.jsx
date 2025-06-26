import React, { useState, useEffect } from 'react';

// --- STYLES FOR THIS PAGE ---
// Replace your entire `const styles = ...` block with this one.
const styles = `
  :root { --primary-color: #00A99D; --light-gray: #F0F2F5; --medium-gray: #D9D9D9; --dark-gray: #595959; --text-color: #262626; --border-color: #D9D9D9; --white: #FFFFFF; }
  .page-container {  margin: 32px auto; width: 100%; max-width: 900px; font-family: 'Inter', sans-serif; }
  .container-header { margin-bottom: 24px; }
  .container-title { font-size: 28px; font-weight: 600; color: var(--primary-color); margin: 0; }
  .creator-tabs { border-bottom: 1px solid var(--border-color); margin-bottom: 24px; display: flex; gap: 24px; }
  .creator-tabs a { text-decoration: none; color: var(--dark-gray); padding: 12px 4px; font-weight: 500; border-bottom: 2px solid transparent; }
  .creator-tabs a.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
  
  .section-tabs { display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 24px; }
  /* --- FIX 1: Corrected syntax and removed all borders/underlines --- */
  .section-tab-item { 
    text-decoration: none; 
    color: var(--dark-gray); 
    padding: 4px; 
    font-weight: 500; 
    background: none; 
    border: none; 
    cursor: pointer; 
    font-size: 16px; 
  }
  .section-tab-item.active { 
    color: var(--primary-color); 
    font-weight: 600; 
  }
  
  .section-details-card {margin-bottom: 24px;}
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px; }
  .form-group { display: flex; flex-direction: column; }
  .form-group label { font-weight: 500; margin-bottom: 8px; font-size: 14px; color: var(--text-color); }
  .form-group input[type="text"], .form-group input[type="number"], .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 14px; box-sizing: border-box; }
  .form-group input:read-only, .form-group textarea:read-only { background-color: var(--white); border-color: #e8e8e8; cursor: not-allowed; }
  .checkbox-group { display: flex; align-items: center; gap: 8px; }
  .add-question-btn-container { text-align: left; margin-top: 16px; }
  .action-btn { padding: 10px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
  .btn-primary { background-color: var(--primary-color); color: var(--white); }
  .btn-secondary { background-color: var(--light-gray); color: var(--dark-gray); border: 1px solid var(--border-color); }
  .main-nav-actions { display: flex; justify-content: space-between; margin-top: 32px; }

  /* --- FIX 2: No container/border for new question form --- */
  .question-form-card { 
    margin-top: 24px; 
  }

  h3 { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; }
  .answer-option { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
  .answer-option-fields { flex-grow: 1; }
  .delete-option-btn { background: none; border: none; font-size: 24px; color: #ff4d4f; cursor: pointer; line-height: 1; padding: 0; }
  .question-form-actions { margin-top: 24px; }

  /* --- FIX 3: No container for MCQ actions row --- */
  .mcq-actions-row { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
  }

  .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
  input:checked + .slider { background-color: var(--primary-color); }
  input:checked + .slider:before { transform: translateX(20px); }
  .final-form-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; }
  .sub-questions-container { margin-top: 24px; }
  .sub-question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  
  /* --- FIX 4: No container for sub-question editor --- */
  .sub-question-editor { 
    margin-bottom: 24px; 
  }

  .sub-question-editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .sub-question-option-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .sub-option-text { flex-grow: 1; }
  .btn-light { background-color: #f0f2f5; border: 1px solid #d1d5db; color: #374151; }
  .btn-small { padding: 6px 12px; font-size: 12px; }

  /* --- FIX 5: No container for saved question display --- */
  .saved-question-card { 
    margin-bottom: 24px;
  }
`;
const AnswerOption = ({ option, onUpdate, onDelete, inputType, name }) => (
    <div className="answer-option">
        <div className="answer-option-fields">
            <div className="form-row">
                <div className="form-group"><label>Answer Text</label><input type="text" value={option.text} onChange={(e) => onUpdate(option.id, 'text', e.target.value)} placeholder="Option" /></div>
                <div className="form-group"><label>Answer Weightage</label><input type="text" value={option.weightage} onChange={(e) => onUpdate(option.id, 'weightage', e.target.value)} placeholder="Weightage" /></div>
            </div>
            <div className="checkbox-group"><input type={inputType} id={`correct-${option.id}`} checked={option.isCorrect} onChange={(e) => onUpdate(option.id, 'isCorrect', e.target.checked)} name={name} /><label htmlFor={`correct-${option.id}`}>Mark as Correct</label></div>
        </div>
        <button type="button" className="delete-option-btn" onClick={() => onDelete(option.id)}>×</button>
    </div>
);

const QuestionForm = ({ sectionType, onSave, onCancel }) => {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState([{ id: 1, text: '', weightage: '', isCorrect: false }, { id: 2, text: '', weightage: '', isCorrect: false }]);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(''); 
    const [paragraphContent, setParagraphContent] = useState('');
    const [subQuestions, setSubQuestions] = useState([]);
    const [mediaTime, setMediaTime] = useState(60);
    

    const handleAddOption = () => setAnswers([...answers, { id: Date.now(), text: '', weightage: '', isCorrect: false }]);
    const handleDeleteOption = (id) => setAnswers(answers.filter(a => a.id !== id));
    const handleAnswerUpdate = (id, field, value) => { let newAnswers = [...answers]; if (field === 'isCorrect' && value && !allowMultiple) { newAnswers = newAnswers.map(a => ({ ...a, isCorrect: false })); } const answerIndex = newAnswers.findIndex(a => a.id === id); if (answerIndex > -1) { newAnswers[answerIndex][field] = value; setAnswers(newAnswers); } };
    const handleAddSubQuestion = () => {
        if (subQuestions.length >= 5) return;
        const newSubQuestion = {
            id: `sq-${Date.now()}`,
            type: 'Multiple Choice',
            text: '',
            // FIX: Add allowMultiple and mediaTime state to each new sub-question
            allowMultiple: false, 
            options: [
                { id: `sqo-${Date.now()}-1`, text: '', isCorrect: false },
                { id: `sqo-${Date.now()}-2`, text: '', isCorrect: false }
            ],
            correctAnswer: '',
            mediaTime: 60 
        };
        setSubQuestions([...subQuestions, newSubQuestion]);
    };

    const handleRemoveSubQuestion = (id) => setSubQuestions(subQuestions.filter(sq => sq.id !== id));
    const handleSubQuestionChange = (id, field, value) => {
        setSubQuestions(prev => prev.map(sq => {
            if (sq.id === id) {
                const updatedSq = { ...sq, [field]: value };
                if (field === 'allowMultiple' && value === false) {
                    let foundFirst = false;
                    updatedSq.options = updatedSq.options.map(opt => {
                        if (opt.isCorrect) {
                            if (foundFirst) {
                                return { ...opt, isCorrect: false };
                            }
                            foundFirst = true;
                        }
                        return opt;
                    });
                }
                return updatedSq;
            }
            return sq;
        }));
    };
    const handleAddSubQuestionOption = (id) => setSubQuestions(prev => prev.map(sq => sq.id === id ? { ...sq, options: [...sq.options, { id: `sqo-${Date.now()}`, text: '', isCorrect: false }] } : sq));
    const handleSubQuestionOptionChange = (subId, optId, field, value) => {
        setSubQuestions(prev => prev.map(sq => {
            if (sq.id === subId) {
                let newOptions = [...sq.options];
                if (field === 'isCorrect' && value && !sq.allowMultiple) {
                    newOptions = newOptions.map(opt => ({ ...opt, isCorrect: false }));
                }
                const optionIndex = newOptions.findIndex(opt => opt.id === optId);
                if (optionIndex > -1) {
                    newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
                }
                return { ...sq, options: newOptions };
            }
            return sq;
        }));
    };
    const handleRemoveSubQuestionOption = (subId, optId) => setSubQuestions(prev => prev.map(sq => (sq.id === subId && sq.options.length > 2) ? { ...sq, options: sq.options.filter(opt => opt.id !== optId) } : sq));
    
   const handleSave = () => {
        let finalCorrectAnswer = '';

        if (sectionType === 'Multiple Choice') {
            finalCorrectAnswer = answers
                .filter(opt => opt.isCorrect)
                .map(opt => opt.text)
                .join(','); // Use comma as separator as requested
        } else if (sectionType === 'Fill in the blank' || sectionType === 'Subjective') {
            finalCorrectAnswer = correctAnswer;
        }

        onSave({ 
            type: sectionType, 
            text: questionText, 
            answers: sectionType === 'Multiple Choice' ? answers : [], // Only send options for MCQ
            correctAnswer: finalCorrectAnswer, // Use the new consolidated field
            allowMultiple: allowMultiple,
            paragraph: paragraphContent, 
            subQuestions, 
            mediaTime 
        });
    };
 let formContent;
    switch (sectionType) {
        // --- CHANGE 3: JSX now uses the new 'correctAnswer' state ---
        case 'Multiple Choice':
            formContent = <><div className="form-group"><label>Question Text</label><textarea rows="3" value={questionText} onChange={e => setQuestionText(e.target.value)} /></div><h3>Answer Options</h3>{answers.map(opt => <AnswerOption key={opt.id} option={opt} onUpdate={handleAnswerUpdate} onDelete={handleDeleteOption} inputType={allowMultiple ? 'checkbox' : 'radio'} name="correct-answer" />)}</>;
            break;
        case 'Subjective':
             formContent = <>
                <div className="form-group"><label>Question Text</label><textarea rows="3" value={questionText} onChange={e => setQuestionText(e.target.value)} /></div>
                <div className="form-group">
                    <label>Model Answer / Grading Rubric</label>
                    <textarea rows="5" value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="Enter the ideal answer or points for grading."/>
                </div>
            </>;
            break;
        case 'Fill in the blank':
            formContent = <>
                <div className="form-group"><label>Question Text (use ___ for the blank)</label><textarea rows="3" value={questionText} onChange={e => setQuestionText(e.target.value)} /></div>
                <div className="form-group">
                    <label>Correct Answer</label>
                    <input type="text" value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="Enter the exact answer" />
                </div>
            </>;
            break;
        case 'Audio based': case 'Video based':
            formContent = <><div className="form-group"><label>Question/Prompt</label><textarea rows="3" value={questionText} onChange={e => setQuestionText(e.target.value)} /></div><div className="form-group"><label>Max Recording Time (seconds)</label><input type="number" value={mediaTime} onChange={e => setMediaTime(e.target.value)} /></div></>;
            break;
        // In CreateQuestionsPage.jsx, replace your QuestionForm component with this
        case 'Paragraph':
            formContent = (
                <>
                    <div className="form-group">
                        <label>Paragraph Content</label>
                        <textarea rows="8" value={paragraphContent} onChange={e => setParagraphContent(e.target.value)} />
                    </div>
                    <div className="sub-questions-container">
                        <div className="sub-question-header">
                            <h4>Sub-Questions ({subQuestions.length}/5)</h4>
                            {subQuestions.length < 5 && <button type="button" className="action-btn btn-light" onClick={handleAddSubQuestion}>+ Add Sub-Question</button>}
                        </div>
                        {subQuestions.map((sq, i) => (
                            <div key={sq.id} className="sub-question-editor">
                                <div className="sub-question-editor-header"><strong>Sub-Question {i + 1}</strong><button type="button" className="delete-option-btn" onClick={() => handleRemoveSubQuestion(sq.id)}>×</button></div>
                                <div className="form-row">
                                    <div className="form-group"><label>Question Text</label><input type="text" value={sq.text} onChange={e => handleSubQuestionChange(sq.id, 'text', e.target.value)} /></div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        {/* FIX 1: Add new types to the dropdown */}
                                        <select value={sq.type} onChange={e => handleSubQuestionChange(sq.id, 'type', e.target.value)}>
                                            <option>Multiple Choice</option>
                                            <option>Fill in the blank</option>
                                            <option>Subjective</option>
                                            <option>Audio based</option>
                                            <option>Video based</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* FIX 2: Add rendering logic for the new sub-question types */}
                                {sq.type === 'Multiple Choice' && (
                                    <>
                                        <label>Options</label>
                                        {sq.options.map(opt => (
                                            <div key={opt.id} className="sub-question-option-row">
                                                <input 
                                                    type={sq.allowMultiple ? 'checkbox' : 'radio'} 
                                                    name={`sq-correct-${sq.id}`} 
                                                    checked={opt.isCorrect} 
                                                    onChange={e => handleSubQuestionOptionChange(sq.id, opt.id, 'isCorrect', e.target.checked)} 
                                                />
                                                <input 
                                                    type="text" 
                                                    className="sub-option-text" 
                                                    value={opt.text} 
                                                    onChange={e => handleSubQuestionOptionChange(sq.id, opt.id, 'text', e.target.value)} 
                                                />
                                                <button type="button" className="delete-option-btn small" onClick={() => handleRemoveSubQuestionOption(sq.id, opt.id)}>×</button>
                                            </div>
                                        ))}
                                        <div className="mcq-actions-row" style={{ marginTop: '16px' }}>
                                            <div className="checkbox-group" style={{gap: '12px'}}>
                                                <label>Allow Multiple Correct Answers</label>
                                                <label className="toggle-switch">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={sq.allowMultiple} 
                                                        onChange={(e) => handleSubQuestionChange(sq.id, 'allowMultiple', e.target.checked)} 
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                            <button type="button" className="action-btn btn-light btn-small" onClick={() => handleAddSubQuestionOption(sq.id)}>Add Option</button>
                                        </div>
                                    </>
                                )}
                                {sq.type === 'Fill in the blank' && <div className="form-group"><label>Correct Answer</label><input type="text" value={sq.correctAnswer} onChange={e => handleSubQuestionChange(sq.id, 'correctAnswer', e.target.value)} /></div>}
                                {sq.type === 'Subjective' && <div className="form-group"><label>Model Answer</label><textarea rows="3" value={sq.correctAnswer} onChange={e => handleSubQuestionChange(sq.id, 'correctAnswer', e.target.value)} placeholder="Enter the ideal answer or points for grading."/></div>}
                                {(sq.type === 'Audio based' || sq.type === 'Video based') && <div className="form-group"><label>Max Recording Time (seconds)</label><input type="number" value={sq.mediaTime} onChange={e => handleSubQuestionChange(sq.id, 'mediaTime', e.target.value)} /></div>}
                            </div>
                        ))}
                    </div>
                </>
            );
            break;
        default: formContent = <p>This section type does not support questions.</p>;
        }
    return (
        <div className="question-form-card">
            {formContent}
            <div className="question-form-actions">
                {sectionType === 'Multiple Choice' && <div className="mcq-actions-row"><div className="checkbox-group" style={{gap: '12px'}}><label>Allow Multiple Correct Answers</label><label className="toggle-switch"><input type="checkbox" checked={allowMultiple} onChange={(e) => setAllowMultiple(e.target.checked)} /><span className="slider"></span></label></div><button type="button" className="action-btn btn-light" onClick={handleAddOption}>Add More Options</button></div>}
                <div className="final-form-actions"><button type="button" className="action-btn btn-secondary" onClick={onCancel}>Cancel</button><button type="button" className="action-btn btn-primary" onClick={handleSave}>Save Question</button></div>
            </div>
        </div>
    );
};
const CreateQuestionsPage = ({ quizData, onNext, onBack }) => {
    
    // --- FIX 1: SIMPLIFIED STATE AND USEEFFECT ---
    const [sections, setSections] = useState(quizData?.sections || []);
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [addingQuestionTo, setAddingQuestionTo] = useState(null);
    
    useEffect(() => {
        // This effect correctly re-syncs with the parent data
        setSections(quizData?.sections || []);
        const activeSectionStillExists = quizData?.sections?.some(s => s.id === activeSectionId);
        if (quizData?.sections?.length > 0 && !activeSectionStillExists) {
            setActiveSectionId(quizData.sections[0].id);
        }
    }, [quizData]);

    const activeSection = sections.find(s => s.id === activeSectionId);
    
    const handleSaveQuestion = (questionData) => {
        const updatedSections = sections.map(sec => {
            if (sec.id === addingQuestionTo) {
                const existingQuestions = sec.questions || [];
                return { ...sec, questions: [...existingQuestions, { ...questionData, id: `q-${Date.now()}` }] };
            }
            return sec;
        });
        setSections(updatedSections);
        setAddingQuestionTo(null);
    };
return (
        <div className="page-container">
            <style>{styles}</style>
            <div className="container-header"><h1 className="container-title">Create a quiz</h1></div>
            <nav className="creator-tabs"><a href="#">Sections</a><a href="#" className="active">Questions</a><a href="#">Settings</a><a href="#">Preview</a></nav>
            
            {/* FIX 2a: Use correct property `sec.name` */}
            <nav className="section-tabs">{sections.map(sec => <button key={sec.id} className={`section-tab-item ${sec.id === activeSectionId ? 'active' : ''}`} onClick={() => { setActiveSectionId(sec.id); setAddingQuestionTo(null); }}>{sec.name}</button>)}</nav>
            
            {activeSection ? <>
                {/* FIX 2b: Use correct properties `name`, `type`, `numQuestions`, etc. */}
                <div className="section-details-card">
                    <div className="form-row">
                        <div className="form-group"><label>Section name</label><input type="text" value={activeSection.name || ''} readOnly /></div>
                        <div className="form-group"><label>Section type</label><input type="text" value={activeSection.type || ''} readOnly /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Time limit</label><input type="text" value={activeSection.timeLimit || ''} readOnly /></div>
                        <div className="form-group"><label>No of Questions</label><input type="text" value={activeSection.numQuestions || ''} readOnly /></div>
                    </div>
                    <div className="form-group" style={{marginTop: '16px'}}><label>Section instructions</label><textarea value={activeSection.instructions || ''} readOnly rows="2"></textarea></div>
                </div>

                {activeSection.questions?.map((q, i) => <div className="saved-question-card" key={q.id}><strong>Question {i + 1}:</strong> {q.text || q.paragraph || 'Media-based Question'}</div>)}
                
                {addingQuestionTo === activeSection.id ? (
                    <QuestionForm sectionType={activeSection.type} onSave={handleSaveQuestion} onCancel={() => setAddingQuestionTo(null)} />
                ) : (
                    <div className="add-question-btn-container"><button className="action-btn btn-secondary" onClick={() => setAddingQuestionTo(activeSection.id)}>Add question</button></div>
                )}
            </> : <p>No section selected. Please go back and create a section first.</p>}
            
            {/* FIX 3: Correctly pass the updated sections data up to the parent */}
            <div className="main-nav-actions">
                <button className="action-btn btn-secondary" onClick={onBack}>Back</button>
                <button className="action-btn btn-primary" onClick={() => onNext({ sections })}>Next</button>
            </div>
        </div>
    );
};

export default CreateQuestionsPage;