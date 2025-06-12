import React from 'react';
import './QuizPreview.css'; // We'll create this CSS file next

// --- Helper Icon Components ---
const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const DragHandleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"></path></svg>
);


// --- Sample Data to Populate the Preview (in a real app, this would be props) ---
/*const sampleQuizData = {
    title: 'Advanced Calculus',
    description: 'This quiz assesses advanced calculus concepts, including multivariable calculus, differential equations, and vector calculus.',
    level: 'Advanced',
    sections: [
        {
            id: 1,
            title: 'Limits and Continuity',
            instructions: 'Answer all questions in this section.',
            timeLimit: '30 minutes',
            questions: [
                { id: 'q1a', number: 1, text: 'Evaluate the limit of the function f(x) = (x^2 - 4) / (x - 2) as x approaches 2.', type: 'Multiple Choice' },
                { id: 'q1b', number: 2, text: 'Determine if the function g(x) = |x| is continuous at x = 0.', type: 'Multiple Choice' },
            ],
            questionCount: 5,
        },
        {
            id: 2,
            title: 'Differentiation',
            instructions: 'Answer all questions in this section.',
            timeLimit: '45 minutes',
            questions: [
                { id: 'q2a', number: 1, text: 'Find the derivative of the function h(x) = 3x^4 - 2x^2 + 5x - 1.', type: 'Multiple Choice' },
                { id: 'q2b', number: 2, text: 'Calculate the second derivative of the function k(x) = e^(2x).', type: 'Multiple Choice' },
            ],
            questionCount: 7,
        }
    ]
};*/


const QuizPreview = ({ quizData, onBack, handleSubmit }) => {
    
    // --- CHANGE: Helper function to format setting values for display ---
    const formatValue = (key, value) => {
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (!value) return 'Not set';
        if (key === 'attempts' && value === 'limited') {
            return `Limited (${quizData.settings.numberOfAttempts || 'N/A'} attempts)`;
        }
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
                <div className="preview-wrapper">
                    <div className="preview-header">
                        <h1>Quiz Preview</h1>
                        <p>This is how your quiz will appear to candidates.</p>
                    </div>

           {/* --- CHANGE: Details are now populated from the quizData prop --- */}
            <div className="details-section">
                <h2>Quiz Details</h2>
                <div className="details-grid">
                    <div className="detail-item"><span className="detail-label">Quiz Title</span><span className="detail-value">{quizData.details?.title || 'N/A'}</span></div>
                    <div className="detail-item description"><span className="detail-label">Description</span><span className="detail-value">{quizData.details?.description || 'N/A'}</span></div>
                    <div className="detail-item"><span className="detail-label">Level</span><span className="detail-value">{quizData.details?.level || 'N/A'}</span></div>
                    <div className="detail-item"><span className="detail-label">Duration</span><span className="detail-value">{quizData.details?.duration ? `${quizData.details.duration} minutes` : 'N/A'}</span></div>
                </div>
            </div>

            {/* --- CHANGE: Sections are now mapped and populated from the quizData prop --- */}
            <div className="details-section">
                <h2>Sections</h2>
                {quizData.sections?.map((section, index) => (
                    <div key={section.id} className="section-block">
                        <h3>{`Section ${index + 1}: ${section.name}`}</h3>
                        <div className="details-grid">
                            <div className="detail-item"><span className="detail-label">Instructions</span><span className="detail-value">{section.instructions || 'None'}</span></div>
                            <div className="detail-item"><span className="detail-label">Time Limit</span><span className="detail-value">{section.timeLimit || 'None'}</span></div>
                            <div className="detail-item"><span className="detail-label">Questions</span><span className="detail-value">{section.questions?.length || 0}</span></div>
                        </div>
                        <ul className="question-list">
                            {section.questions?.map((question, qIndex) => (
                                <li key={qIndex} className="question-list-item">
                                    <div className="drag-handle-icon"><DragHandleIcon /></div>
                                    <div className="question-info">
                                        <span className="question-text">{`Question ${qIndex + 1}: ${question.text || `Paragraph with ${question.subQuestions?.length || 0} sub-question(s)`}`}</span>
                                        <span className="question-type">{question.type}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            {/* --- CHANGE: Added a new section to display the configured settings --- */}
            <div className="details-section">
                <h2>Settings</h2>
                <div className="details-grid">
                    <div className="detail-item"><span className="detail-label">Passing Percentage</span><span className="detail-value">{quizData.settings?.passingPercentage ? `${quizData.settings.passingPercentage}%` : 'N/A'}</span></div>
                    <div className="detail-item"><span className="detail-label">Scoring</span><span className="detail-value">{formatValue('scoring', quizData.settings?.scoring)}</span></div>
                    <div className="detail-item"><span className="detail-label">Negative Marking</span><span className="detail-value">{formatValue('negativeMarking', quizData.settings?.negativeMarking)}</span></div>
                    <div className="detail-item"><span className="detail-label">Back Navigation</span><span className="detail-value">{formatValue('backNavigation', quizData.settings?.backNavigation)}</span></div>
                    <div className="detail-item"><span className="detail-label">Results Display</span><span className="detail-value">{formatValue('results', quizData.settings?.results)}</span></div>
                    <div className="detail-item"><span className="detail-label">Attempts</span><span className="detail-value">{formatValue('attempts', quizData.settings?.attempts)}</span></div>
                </div>
            </div>

            {/* --- CHANGE: Buttons now call the onBack and handleSubmit props --- */}
            <div className="preview-footer-actions">
                <button className="btn btn-secondary" onClick={onBack}>Back to Settings</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Publish Quiz</button>
            </div>
        </div>
    );
};
export default QuizPreview;