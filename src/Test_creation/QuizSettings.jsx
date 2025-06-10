

import React, { useState } from 'react';
import './QuizSettings.css'; // The updated CSS file

// --- Helper Icon Components (reused) ---
const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const CheckmarkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

// --- Combined Initial State for the Entire Quiz Flow ---
const initialQuizState = {
    sections: [
        { id: 1, name: 'Section 1', questions: [{ id: 'q1', text: 'Question Text-1', options: [] }] },
        { id: 2, name: 'Section 2', questions: [] },
    ],
    settings: {
        passingPercentage: '', scoring: 'per_question', negativeMarking: 'no_negative_marking', backNavigation: false, results: 'immediately', attempts: 'unlimited', numberOfAttempts: '',
    }
};

// --- Main Parent Component ---
const CreateQuizFlow = () => {
    const [activeView, setActiveView] = useState('settings'); // Default to settings to match image
    const [quizData, setQuizData] = useState(initialQuizState);
    
    // Handler to change settings
    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        
        setQuizData(prevData => {
            const newSettings = { ...prevData.settings, [name]: val };
            if (name === "attempts" && value === "unlimited") {
                newSettings.numberOfAttempts = ''; // Clear number of attempts
            }
            return { ...prevData, settings: newSettings };
        });
    };

    return (
        <div className="quiz-page-container">
            {/* --- Header (Static Part) --- */}
            <header className="page-header">{/* ... same header JSX as before ... */}</header>

            <main className="main-content">
                {/* --- Stepper (Static Part) --- */}
                <div className="stepper">{/* ... same stepper JSX as before ... */}</div>

                <div className="form-wrapper">
                    {/* --- Tabs to Control the View --- */}
                    <div className="main-tabs">
                        <button className={`tab-item ${activeView === 'sections' ? 'active' : ''}`} onClick={() => setActiveView('sections')}>Sections</button>
                        <button className={`tab-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>Settings</button>
                        <button className={`tab-item ${activeView === 'preview' ? 'active' : ''}`} onClick={() => setActiveView('preview')}>Preview</button>
                    </div>

                    {/* --- Conditional Rendering Based on Active View --- */}
                    {activeView === 'sections' && <SectionsView sections={quizData.sections} setQuizData={setQuizData} />}
                    {activeView === 'settings' && <SettingsView settings={quizData.settings} onChange={handleSettingsChange} />}
                    {activeView === 'preview' && <div>Preview Content Goes Here...</div>}
                </div>
                
                <div className="page-footer-actions">
                    <button className="btn btn-secondary">Back</button>
                    <button className="btn btn-primary">Next</button>
                </div>
            </main>
        </div>
    );
};

// --- Child Component for the "Sections" View (Unchanged from previous answer) ---
const SectionsView = ({ sections, setQuizData }) => {
    // ... logic for sections view remains the same
    return <div>Sections View Content...</div>;
};

// --- Child Component for the "Settings" View with new classNames ---
const SettingsView = ({ settings, onChange }) => {
    return (
        <div className="settings-content">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Configure quiz-wide settings</p>
            </div>
            <form className="settings-form" onSubmit={e => e.preventDefault()}>
                <div className="form-group-row">
                    <label className="form-label-title">Passing criteria</label>
                    <div className="form-input-group">
                        <label htmlFor="passingPercentage">Percentage to pass</label>
                        {/* MODIFIED: Added className */}
                        <input type="number" id="passingPercentage" name="passingPercentage" value={settings.passingPercentage} onChange={onChange} className="input-gray-bg" />
                    </div>
                </div>
                <div className="form-group-row">
                    <label className="form-label-title">Scoring</label>
                    <div className="form-input-group">
                        <label className="custom-radio"><input type="radio" name="scoring" value="per_question" checked={settings.scoring === 'per_question'} onChange={onChange} /><span className="radio-dot"></span>Per question</label>
                        <label className="custom-radio"><input type="radio" name="scoring" value="per_section" checked={settings.scoring === 'per_section'} onChange={onChange} /><span className="radio-dot"></span>Per section</label>
                    </div>
                </div>
                <div className="form-group-row">
                    <label className="form-label-title">Negative marking</label>
                    <div className="form-input-group">
                        <label className="custom-radio"><input type="radio" name="negativeMarking" value="no_negative_marking" checked={settings.negativeMarking === 'no_negative_marking'} onChange={onChange} /><span className="radio-dot"></span>No negative marking</label>
                        <label className="custom-radio"><input type="radio" name="negativeMarking" value="negative_marking" checked={settings.negativeMarking === 'negative_marking'} onChange={onChange} /><span className="radio-dot"></span>Negative marking</label>
                    </div>
                </div>
                 {/* MODIFIED: Added className to this div */}
                <div className="form-group-row toggle-row row-gray-bg">
                    <div className="form-label-group">
                        <label className="form-label-title">Navigation</label>
                        <span className="label-description">Allow test-takers to go back to previous questions</span>
                    </div>
                    <div className="form-input-group">
                        <label className="switch"><input type="checkbox" name="backNavigation" checked={settings.backNavigation} onChange={onChange} /><span className="slider round"></span></label>
                    </div>
                </div>
                <div className="form-group-row">
                    <label className="form-label-title">Results</label>
                    <div className="form-input-group">
                        <label className="custom-radio"><input type="radio" name="results" value="immediately" checked={settings.results === 'immediately'} onChange={onChange} /><span className="radio-dot"></span>Show results immediately</label>
                        <label className="custom-radio"><input type="radio" name="results" value="later" checked={settings.results === 'later'} onChange={onChange} /><span className="radio-dot"></span>Show results later</label>
                    </div>
                </div>
                <div className="form-group-row">
                    <label className="form-label-title">Attempts</label>
                    <div className="form-input-group">
                        <label className="custom-radio"><input type="radio" name="attempts" value="unlimited" checked={settings.attempts === 'unlimited'} onChange={onChange} /><span className="radio-dot"></span>Unlimited</label>
                        <label className="custom-radio"><input type="radio" name="attempts" value="limited" checked={settings.attempts === 'limited'} onChange={onChange} /><span className="radio-dot"></span>Limit attempts</label>
                        {settings.attempts === 'limited' && (
                            <div className="conditional-input">
                                <label htmlFor="numberOfAttempts">Number of attempts</label>
                                {/* MODIFIED: Added className */}
                                <input type="number" id="numberOfAttempts" name="numberOfAttempts" value={settings.numberOfAttempts} onChange={onChange} className="input-gray-bg" />
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};



export default QuizSettings;