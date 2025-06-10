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
const sampleQuizData = {
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
};


const QuizPreview = () => {
    return (
        <div className="quiz-preview-page">
            {/* --- Header --- */}
            <header className="page-header">
                <div className="logo-container">
                    <span className="logo-icon">GA</span>
                    <span className="logo-text">GA Proctored Test</span>
                </div>
                <nav className="main-nav">
                    <a href="#">Dashboard</a>
                    <a href="#">Tests</a>
                    <a href="#">Candidates</a>
                    <a href="#" className="active">Create test</a>
                </nav>
                <div className="user-controls">
                    <button className="icon-button"><BellIcon /></button>
                    <div className="user-profile">
                        <div className="avatar"></div>
                        <span>Arjun Pavan</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="main-content">
                <div className="preview-wrapper">
                    <div className="preview-header">
                        <h1>Quiz Preview</h1>
                        <p>This is how your quiz will appear to candidates.</p>
                    </div>

                    <div className="details-section">
                        <h2>Quiz Details</h2>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Quiz Title</span>
                                <span className="detail-value">{sampleQuizData.title}</span>
                            </div>
                            <div className="detail-item description">
                                <span className="detail-label">Description</span>
                                <span className="detail-value">{sampleQuizData.description}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Level</span>
                                <span className="detail-value">{sampleQuizData.level}</span>
                            </div>
                        </div>
                    </div>

                    <div className="details-section">
                        <h2>Sections</h2>
                        {sampleQuizData.sections.map(section => (
                            <div key={section.id} className="section-block">
                                <h3>{`Section ${section.id}: ${section.title}`}</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Instructions</span>
                                        <span className="detail-value">{section.instructions}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Time Limit</span>
                                        <span className="detail-value">{section.timeLimit}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Questions</span>
                                        <span className="detail-value">{section.questionCount}</span>
                                    </div>
                                </div>
                                <ul className="question-list">
                                    {section.questions.map(question => (
                                        <li key={question.id} className="question-list-item">
                                            <div className="drag-handle-icon">
                                                <DragHandleIcon />
                                            </div>
                                            <div className="question-info">
                                                <span className="question-text">{`Question ${question.number}: ${question.text}`}</span>
                                                <span className="question-type">{question.type}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="preview-footer-actions">
                        <button className="btn btn-secondary">Edit Steps</button>
                        <button className="btn btn-primary">Publish Quiz</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizPreview;