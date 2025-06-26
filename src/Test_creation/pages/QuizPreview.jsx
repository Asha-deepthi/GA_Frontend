// QuizPreview.jsx
import React, { useState } from 'react';

// --- Helper Icon Components ---
const DragHandleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"></path></svg>
);
const ChevronIcon = ({ isOpen }) => (
    <svg className={`chevron-icon ${isOpen ? 'open' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

// --- All CSS is now embedded in the component ---
const styles = `
    :root {
        --primary-color: #00A99D;
        --primary-color-dark: #008f87;
        --bg-color: #f8f9fa;
        --card-bg-color: #ffffff;
        --border-color: #e9ecef;
        --text-dark: #343a40;
        --text-light: #6c757d;
        --border-radius-md: 8px;
    }

    /* The main wrapper for the preview content */
    .preview-wrapper { 
        max-width: 800px; 
        margin: 40px auto; 
        padding: 0 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    }

    /* The .preview-header CSS rules have been removed. */

    .details-section { 
        margin-bottom: 40px; 
    }
    
    .collapsible-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    .collapsible-header h2 {
        font-size: 1.5rem;
        color: var(--text-dark);
        margin: 0;
    }
    .chevron-icon {
        color: var(--text-light);
        transition: transform 0.3s ease;
    }
    .chevron-icon.open {
        transform: rotate(180deg);
    }
    
    .section-block h3 { 
        font-size: 1.25rem; 
        font-weight: 600; 
        margin: 25px 0 20px 0;
        color: var(--primary-color-dark);
    }

    .details-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 20px 30px; 
    }

    .detail-item { 
        display: flex; 
        flex-direction: column; 
        gap: 5px; 
    }

    .detail-item.description { 
        grid-column: 1 / -1; 
    }

    .detail-label { 
        font-size: 0.9rem; 
        color: var(--text-light); 
        font-weight: 500; 
    }

    .detail-value { 
        font-size: 1rem; 
        color: var(--text-dark); 
    }

    .question-list { 
        list-style: none; 
        padding: 0; 
        margin: 20px 0 0 0; 
        display: flex; 
        flex-direction: column; 
        gap: 15px; 
    }

    .question-list-item { 
        display: flex; 
        align-items: center; 
        gap: 15px; 
        background-color: var(--bg-color); 
        padding: 15px; 
        border-radius: var(--border-radius-md); 
        border: 1px solid var(--border-color); 
    }

    .drag-handle-icon { 
        color: #b0bec5; 
        cursor: grab; 
    }

    .question-info { 
        display: flex; 
        flex-direction: column; 
        gap: 4px; 
    }

    .question-text { 
        font-weight: 500; 
        color: var(--text-dark); 
    }

    .question-type { 
        font-size: 0.85rem; 
        color: var(--text-light); 
    }

    .preview-footer-actions { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-top: 50px; 
        padding-top: 20px; 
        border-top: 1px solid var(--border-color); 
    }

    .btn { 
        padding: 12px 28px; 
        border: none; 
        border-radius: var(--border-radius-md); 
        font-size: 1rem; 
        font-weight: 600; 
        cursor: pointer; 
        transition: all 0.2s ease; 
    }

    .btn-primary { 
        background-color: var(--primary-color); 
        color: white; 
    }

    .btn-primary:hover { 
        background-color: var(--primary-color-dark); 
    }
    
    .btn-secondary { 
        background-color: #f1f3f5; 
        color: var(--text-dark); 
        border: 1px solid #dee2e6; 
    }
    
    .btn-secondary:hover { 
        background-color: #e9ecef; 
    }
`;

const QuizPreview = ({ quizData = {}, onBack, handleSubmit }) => {
    
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);

    const formatValue = (key, value) => {
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (!value) return 'Not set';
        if (key === 'attempts' && value === 'limited') {
            return `Limited (${quizData.settings?.numberOfAttempts || 'N/A'} attempts)`;
        }
        return (value.charAt(0).toUpperCase() + value.slice(1)).replace(/_/g, ' ');
    };

    return (
        <div className="preview-wrapper">
            <style>{styles}</style>
           <nav className="creator-tabs"><a href="#" className="tab-item">Sections</a><a href="#" className="tab-item">Questions</a><a href="#" className="tab-item">Settings</a><a href="#" className="tab-item active">Preview</a></nav>

            <div className="details-section">
                <div className="collapsible-header" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
                    <h2>Quiz Details</h2>
                    <ChevronIcon isOpen={isDetailsOpen} />
                </div>
                {isDetailsOpen && (
                    <div className="details-grid">
                        <div className="detail-item"><span className="detail-label">Quiz Title</span><span className="detail-value">{quizData.details?.title || 'N/A'}</span></div>
                        <div className="detail-item description"><span className="detail-label">Description</span><span className="detail-value">{quizData.details?.description || 'N/A'}</span></div>
                        <div className="detail-item"><span className="detail-label">Level</span><span className="detail-value">{quizData.details?.level || 'N/A'}</span></div>
                        <div className="detail-item"><span className="detail-label">Duration</span><span className="detail-value">{quizData.details?.duration ? `${quizData.details.duration} minutes` : 'N/A'}</span></div>
                    </div>
                )}
            </div>

            <div className="details-section">
                <div className="collapsible-header">
                    <h2>Sections</h2>
                </div>
                {quizData.sections?.map((section, index) => (
                    <div key={section.id || index} className="section-block">
                        <h3>{`Section ${index + 1}: ${section.name || 'Untitled Section'}`}</h3>
                        <div className="details-grid">
                            <div className="detail-item"><span className="detail-label">Instructions</span><span className="detail-value">{section.instructions || 'None'}</span></div>
                            <div className="detail-item"><span className="detail-label">Time Limit</span><span className="detail-value">{section.timeLimit || 'None'}</span></div>
                            <div className="detail-item"><span className="detail-label">Total Questions</span><span className="detail-value">{section.questions?.length || 0}</span></div>
                        </div>
                        {section.questions && section.questions.length > 0 && (
                            <ul className="question-list">
                                {section.questions.map((question, qIndex) => (
                                    <li key={question.id || qIndex} className="question-list-item">
                                        <div className="drag-handle-icon"><DragHandleIcon /></div>
                                        <div className="question-info">
                                            <span className="question-text">{`Question ${qIndex + 1}: ${question.text || `Paragraph with ${question.subQuestions?.length || 0} sub-question(s)`}`}</span>
                                            <span className="question-type">{question.type || 'N/A'}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="details-section">
                <div className="collapsible-header">
                    <h2>Settings</h2>
                 </div>
                <div className="details-grid">
                    <div className="detail-item"><span className="detail-label">Passing Percentage</span><span className="detail-value">{quizData.settings?.passingPercentage ? `${quizData.settings.passingPercentage}%` : 'N/A'}</span></div>
                    <div className="detail-item"><span className="detail-label">Scoring</span><span className="detail-value">{formatValue('scoring', quizData.settings?.scoring)}</span></div>
                    <div className="detail-item"><span className="detail-label">Negative Marking</span><span className="detail-value">{formatValue('negativeMarking', quizData.settings?.negativeMarking)}</span></div>
                    <div className="detail-item"><span className="detail-label">Back Navigation</span><span className="detail-value">{formatValue('backNavigation', quizData.settings?.backNavigation)}</span></div>
                    <div className="detail-item"><span className="detail-label">Results Display</span><span className="detail-value">{formatValue('results', quizData.settings?.results)}</span></div>
                    <div className="detail-item"><span className="detail-label">Attempts</span><span className="detail-value">{formatValue('attempts', quizData.settings?.attempts)}</span></div>
                </div>
            </div>

            <div className="preview-footer-actions">
                <button className="btn btn-secondary" onClick={onBack}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Publish Quiz</button>
            </div>
        </div>
    );
};

export default QuizPreview;