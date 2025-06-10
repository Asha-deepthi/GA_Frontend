import React, { useState, useMemo } from 'react';

const sectionsData = [ { title: "Mathematics", questions: [ { id: 1, title: "Question 1", answer: "12", status: 'answered' }, { id: 2, title: "Question 2", answer: "25", status: 'answered' }, { id: 3, title: "Question 3", answer: "7", status: 'answered' }, ] }, { title: "English", questions: [ { id: 4, title: "Question 1", answer: "The quick brown fox jumps over the lazy dog.", status: 'answered' }, { id: 5, title: "Question 2", answer: "A", status: 'answered' }, { id: 6, title: "Question 3", answer: null, status: 'unanswered' }, ] }, { title: "Science", questions: [ { id: 7, title: "Question 1", answer: "Photosynthesis", status: 'answered' }, { id: 8, title: "Question 2", answer: "H2O", status: 'answered' }, ] }, { title: "General Knowledge", questions: [ { id: 9, title: "Question 1", answer: "Paris", status: 'answered' }, { id: 10, title: "Question 2", answer: "1969", status: 'answered' }, ] } ];

const MenuIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const FaqIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.09 9.00002C9.3251 8.33168 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06835C14.6714 8.61519 14.9211 9.30825 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const UserIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const CheckIcon = () => ( <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const CrossIcon = () => ( <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const DecorationShape = () => ( <svg className="decoration-shape" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 0L61.2266 38.7734L100 50L61.2266 61.2266L50 100L38.7734 61.2266L0 50L38.7734 38.7734L50 0Z" fill="#00A896" fillOpacity="0.2"/></svg> );

function TestSummaryScreen() {
    const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);

    const { totalQuestions, answeredQuestions } = useMemo(() => {
        let total = 0, answered = 0;
        sectionsData.forEach(s => { total += s.questions.length; answered += s.questions.filter(q => q.status === 'answered').length; });
        return { totalQuestions: total, answeredQuestions: answered };
    }, []);

    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    const filteredSections = useMemo(() => {
        if (!showUnansweredOnly) return sectionsData;
        return sectionsData.map(s => ({ ...s, questions: s.questions.filter(q => q.status === 'unanswered') })).filter(s => s.questions.length > 0);
    }, [showUnansweredOnly]);

    return (
        <div className="page-container review-page">
            <div className="top-color-bar"></div>
            <header>
                <div className="test-title"><MenuIcon /><span>GA Proctored Test</span></div>
                <nav className="header-nav"><button className="faq-btn"><FaqIcon /> FAQs</button><div className="user-profile"><div className="user-icon"><UserIcon /></div><span>Arjun</span></div></nav>
            </header>
            <main className="review-content">
                <div className="review-header"><h1>Review Your Answers</h1><p>Please review your answers by section. You can go back and edit any question before submitting.</p></div>
                <div className="progress-section">
                    <div className="progress-labels"><span>Progress</span><span>{answeredQuestions}/{totalQuestions}</span></div>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div></div>
                </div>
                <div className="toggle-container">
                    <span>Show only unanswered questions</span>
                    <label className="switch"><input type="checkbox" checked={showUnansweredOnly} onChange={() => setShowUnansweredOnly(!showUnansweredOnly)} /><span className="slider round"></span></label>
                </div>
                <div className="answers-list">
                    {filteredSections.map(section => {
                        const answeredInSection = section.questions.filter(q => q.status === 'answered').length;
                        const totalInSection = sectionsData.find(s => s.title === section.title).questions.length;
                        return (
                            <div key={section.title} className="answer-section">
                                <h2>{section.title} ({answeredInSection}/{totalInSection} answered)</h2>
                                {section.questions.map(q => (
                                    <div key={q.id} className="question-item">
                                        <div className={`status-icon ${q.status}`}>{q.status === 'answered' ? <CheckIcon /> : <CrossIcon />}</div>
                                        <div className="question-details">
                                            <span className="question-title">{q.title}</span>
                                            {q.answer ? (<span className="question-answer">Answer: {q.answer}</span>) : (<span className="question-answer unanswered">Questio...</span>)}
                                        </div>
                                        <button className="edit-btn">Edit</button>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
                <footer className="review-footer"><button className="footer-btn back-btn">Go Back to Test</button><button className="footer-btn submit-btn">Submit Test</button></footer>
            </main>
            <DecorationShape />
        </div>
    );
};

export default TestSummaryScreen;