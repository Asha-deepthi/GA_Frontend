import React, { useState, useMemo, useEffect } from 'react';
import './TestSummaryScreen.css';
// Correct path
import { fetchTestSummary } from "../components/mockapi" // Adjust path if needed

const TestSummaryScreen = () => {
    const [sections, setSections] = useState([]); // State to hold data from backend
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const loadTestData = async () => {
            try {
                const response = await fetchTestSummary();
                if (response.success) {
                    setSections(response.data.sections);
                } else {
                    throw new Error("Failed to fetch test data.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTestData();
    }, []); // Empty dependency array means this runs once on mount

    // --- EVENT HANDLERS (No changes needed here) ---
    const handleEditClick = (questionId) => {
        console.log(`User wants to edit question with ID: ${questionId}`);
        alert(`Editing question ID: ${questionId}`);
    };
    const handleGoBack = () => {
        console.log("Navigating back to the test...");
        alert("Going back to the test!");
    };
    const handleSubmit = () => {
        if (window.confirm("Are you sure you want to submit your test?")) {
            console.log("Submitting test...");
            alert("Test Submitted!");
        }
    };
    const handleFaqClick = () => {
        console.log("Opening FAQs...");
        alert("Displaying FAQs.");
    }

    // --- Data Calculation (Now depends on the 'sections' state) ---
    const { displayedSections, totalQuestions, answeredQuestions } = useMemo(() => {
        if (!sections || sections.length === 0) {
            return { displayedSections: [], totalQuestions: 0, answeredQuestions: 0 };
        }

        let total = 0;
        let answered = 0;
        const sectionsToDisplay = sections.map(section => {
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
        }).filter(Boolean); // filter(Boolean) removes null entries

        return {
            displayedSections: sectionsToDisplay,
            totalQuestions: total,
            answeredQuestions: answered,
        };
    }, [sections, showOnlyUnanswered]); // Re-calculates when sections or the toggle changes
    
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    // --- Conditional Rendering for Loading and Error States ---
    if (loading) {
        return <div className="status-container"><h2>Loading Test Summary...</h2></div>;
    }

    if (error) {
        return <div className="status-container error"><h2>Error: {error}</h2></div>;
    }

    return (
        <>
            <div className="review-page-container">
                <header className="review-header">
                    {/* ... Header JSX is unchanged ... */}
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
                    {/* ... Main content JSX is unchanged ... */}
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
                    {/* ... Footer JSX is unchanged ... */}
                    <button className="action-btn btn-secondary" onClick={handleGoBack}>Go Back to Test</button>
                    <button className="action-btn btn-primary" onClick={handleSubmit}>Submit Test</button>
                </footer>
            </div>
            <div className="decorative-shape"></div>
        </>
    );
};

export default TestSummaryScreen;