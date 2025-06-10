import React from 'react';
import './QuizForm.css'; // Import the stylesheet

// For simplicity, icons are defined as components here.
// In a real app, you'd likely use a library like react-icons.
const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const CheckmarkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const QuizCreator = () => {
    return (
        <div className="quiz-page-container">
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
                {/* --- Stepper --- */}
                <div className="stepper">
                    <div className="step active">
                        <div className="step-circle">1</div>
                        <div className="step-label">Test Title</div>
                    </div>
                    <div className="connector"></div>
                    <div className="step">
                        <div className="step-circle">2</div>
                        <div className="step-label">Set interview questions</div>
                    </div>
                    <div className="connector"></div>
                    <div className="step">
                        <div className="step-circle">3</div>
                        <div className="step-label">Import candidates</div>
                    </div>
                    <div className="connector"></div>
                    <div className="step">
                        <div className="step-circle">4</div>
                        <div className="step-label">Send interview invitation</div>
                    </div>
                </div>

                {/* --- Form Container --- */}
                <div className="form-wrapper">
                    <div className="form-header">
                        <h1>Create a quiz</h1>
                        <button className="btn-secondary-dashed">Import Section from Old Quiz</button>
                    </div>

                    <div className="tabs">
                        <button className="tab-item active">Sections</button>
                        <button className="tab-item">Settings</button>
                        <button className="tab-item">Preview</button>
                    </div>

                    <div className="section-form-card">
                        <h2>Section 1</h2>
                        <form>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="section-name">Section name</label>
                                    <input type="text" id="section-name" defaultValue="Section 1" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="section-type">Section type</label>
                                    <input type="text" id="section-type" placeholder="e.g., Multiple Choice" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="time-limit">Time limit</label>
                                    <input type="text" id="time-limit" defaultValue="00:00:00" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="num-questions">No of Questions</label>
                                    <input type="number" id="num-questions" defaultValue="5" />
                                </div>
                            </div>
                            <div className="checkbox-options">
                                <label className="custom-checkbox">
                                    <div className="checkmark-box"><CheckmarkIcon/></div>
                                    Shuffle questions
                                </label>
                                <label className="custom-checkbox">
                                    <div className="checkmark-box"><CheckmarkIcon/></div>
                                    Shuffle answers
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="instructions">Section instructions</label>
                                <textarea id="instructions" rows="5"></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary">Back</button>
                                <button type="submit" className="btn btn-primary">Save Section</button>
                            </div>
                        </form>
                    </div>
                    <button className="btn-secondary-dashed add-section-btn">Add Section</button>
                </div>
            </main>
        </div>
    );
};

export default QuizCreator;