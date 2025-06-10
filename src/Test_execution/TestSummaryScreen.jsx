import React, { useState, useMemo } from 'react';
import './TestSummaryScreen.css';

// Sample data to simulate real quiz answers
const sampleSections = [
    {
        name: "Mathematics",
        questions: [
            { id: 1, title: "Question 1", answer: "12" },
            { id: 2, title: "Question 2", answer: "25" },
            { id: 3, title: "Question 3", answer: "7" },
        ]
    },
    {
        name: "English",
        questions: [
            { id: 4, title: "Question 1", answer: "The quick brown fox jumps over the lazy dog." },
            { id: 5, title: "Question 2", answer: "A" },
            { id: 6, title: "Questio...", answer: null }, // Unanswered question
        ]
    },
    {
        name: "Science",
        questions: [
            { id: 7, title: "Question 1", answer: "Photosynthesis" },
            { id: 8, title: "Question 2", answer: "H2O" },
        ]
    },
    {
        name: "General Knowledge",
        questions: [
            { id: 9, title: "Question 1", answer: "Paris" },
            { id: 10, title: "Question 2", answer: "1969" },
        ]
    }
];

const TestSummaryScreen = () => {
    const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false);

    // --- EVENT HANDLERS FOR BUTTONS ---

    const handleEditClick = (questionId) => {
        // In a real app, this would likely navigate back to the specific question
        // or open a modal for editing.
        console.log(`User wants to edit question with ID: ${questionId}`);
        alert(`Editing question ID: ${questionId}`);
    };

    const handleGoBack = () => {
        // In a real app, this would use a router to navigate to the previous page.
        console.log("Navigating back to the test...");
        alert("Going back to the test!");
    };

    const handleSubmit = () => {
        // In a real app, this would send the final answers to a server.
        // We can add a confirmation prompt for a better user experience.
        if (window.confirm("Are you sure you want to submit your test?")) {
            console.log("Submitting test...");
            alert("Test Submitted!");
            // Perform API call here
        }
    };
    
    const handleFaqClick = () => {
        console.log("Opening FAQs...");
        alert("Displaying FAQs.");
    }

    // --- Data Calculation (useMemo is efficient) ---
    const { displayedSections, totalQuestions, answeredQuestions } = useMemo(() => {
        let total = 0;
        let answered = 0;
        const sectionsToDisplay = sampleSections.map(section => {
            total += section.questions.length;
            const answeredInSection = section.questions.filter(q => q.answer !== null);
            answered += answeredInSection.length;

            if (showOnlyUnanswered) {
                const unansweredQuestions = section.questions.filter(q => q.answer === null);
                if (unansweredQuestions.length > 0) {
                    return { ...section, questions: unansweredQuestions, answeredCount: answeredInSection.length };
                }
                return null;
            }
            return { ...section, answeredCount: answeredInSection.length };
        }).filter(Boolean);

        return {
            displayedSections: sectionsToDisplay,
            totalQuestions: total,
            answeredQuestions: answered,
        };
    }, [showOnlyUnanswered]);
    
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    return (
        <>
            <div className="review-page-container">
                <header className="review-header">
                    <div className="header-color-bar"></div>
                    <div className="header-content">
                        <div className="logo"><span className="logo-square"></span> GA Proctored Test</div>
                        <div className="header-actions">
                            <button className="faq-button" onClick={handleFaqClick}>? FAQs</button>
                            <div className="user-profile">
                                <div className="avatar"></div>
                                <span>Arjun</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="review-content">
                    <h1 className="review-title">Review Your Answers</h1>
                    <p className="review-subtitle">Please review your answers by section. You can go back and edit any question before submitting.</p>

                    <div className="progress-section">
                        <div className="progress-header">
                            <span className="progress-label">Progress</span>
                            <span className="progress-value">{answeredQuestions}/{totalQuestions}</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="toggle-section">
                        <span>Show only unanswered questions</span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={showOnlyUnanswered} onChange={(e) => setShowOnlyUnanswered(e.target.checked)} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {displayedSections.map(section => (
                        <div key={section.name} className="section-group">
                            <h3 className="section-title">{section.name} ({section.answeredCount}/{section.questions.length} answered)</h3>
                            {section.questions.map(q => (
                                <div key={q.id} className="question-item">
                                    <div className={`question-status-icon ${q.answer ? 'answered' : 'unanswered'}`}>
                                        {q.answer ? '✓' : '✗'}
                                    </div>
                                    <div className="question-details">
                                        <h4>{q.title}</h4>
                                        <p>{q.answer ? `Answer: ${q.answer}` : "Not Answered"}</p>
                                    </div>
                                    <button className="edit-button" onClick={() => handleEditClick(q.id)}>Edit</button>
                                </div>
                            ))}
                        </div>
                    ))}

                </main>

                <footer className="review-footer">
                    <button className="action-btn btn-secondary" onClick={handleGoBack}>Go Back to Test</button>
                    <button className="action-btn btn-primary" onClick={handleSubmit}>Submit Test</button>
                </footer>
            </div>
            <div className="decorative-shape"></div>
        </>
    );
};

export default TestSummaryScreen;