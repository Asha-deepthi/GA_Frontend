import React, { useState } from 'react';
import './QuizSettings.css'; // We'll create this CSS file next

// --- Helper Icon Components ---
const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

// --- Initial State for the Settings Form ---
/*const initialSettings = {
    passingPercentage: '',
    scoring: 'per_question',
    negativeMarking: 'no_negative_marking',
    backNavigation: false,
    results: 'immediately',
    attempts: 'unlimited',
    numberOfAttempts: '',
};*/

const QuizSettings = ({ onBack, onNext }) => {
    const [settings, setSettings] = useState({
        passingPercentage: '',
        scoring: 'per_question',
        negativeMarking: 'no_negative_marking',
        backNavigation: false,
        results: 'immediately',
        attempts: 'unlimited',
        numberOfAttempts: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Special handling for the attempts radio buttons
        if (name === "attempts" && value === "unlimited") {
            setSettings(prevSettings => ({
                ...prevSettings,
                attempts: value,
                numberOfAttempts: '' // Clear number of attempts when switching to unlimited
            }));
        } else {
            setSettings(prevSettings => ({
                ...prevSettings,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

        // --- THIS IS THE FUNCTION THAT WAS LIKELY MISSING OR MISPLACED ---
    // It must be defined inside the QuizSettings component, before the return statement.
    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ settings }); // This calls the parent's "next" function with the data
    };

    return (
                <div className="form-wrapper">
            <div className="main-tabs">
                <button className="tab-item">Sections</button>
                <button className="tab-item active">Settings</button>
                <button className="tab-item">Preview</button>
            </div>

            <div className="settings-content">
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Configure quiz-wide settings</p>
                </div>
                
                {/* --- CHANGE: The form now calls our new handleSubmit function --- */}
                <form className="settings-form" onSubmit={handleSubmit}>
                    {/* Passing Criteria */}
                    <div className="form-group-row">
                        <label className="form-label-title">Passing criteria</label>
                        <div className="form-input-group">
                            <label htmlFor="passingPercentage">Percentage to pass</label>
                            <input type="number" id="passingPercentage" name="passingPercentage" value={settings.passingPercentage} onChange={handleChange} />
                        </div>
                    </div>
                    
                            {/* Scoring */}
                            <div className="form-group-row">
                                <label className="form-label-title">Scoring</label>
                                <div className="form-input-group">
                                    <label className="custom-radio"><input type="radio" name="scoring" value="per_question" checked={settings.scoring === 'per_question'} onChange={handleChange} /><span className="radio-dot"></span>Per question</label>
                                    <label className="custom-radio"><input type="radio" name="scoring" value="per_section" checked={settings.scoring === 'per_section'} onChange={handleChange} /><span className="radio-dot"></span>Per section</label>
                                </div>
                            </div>

                             {/* Negative Marking */}
                            <div className="form-group-row">
                                <label className="form-label-title">Negative marking</label>
                                <div className="form-input-group">
                                    <label className="custom-radio"><input type="radio" name="negativeMarking" value="no_negative_marking" checked={settings.negativeMarking === 'no_negative_marking'} onChange={handleChange} /><span className="radio-dot"></span>No negative marking</label>
                                    <label className="custom-radio"><input type="radio" name="negativeMarking" value="negative_marking" checked={settings.negativeMarking === 'negative_marking'} onChange={handleChange} /><span className="radio-dot"></span>Negative marking</label>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="form-group-row toggle-row">
                                <div className="form-label-group">
                                    <label className="form-label-title">Navigation</label>
                                    <span className="label-description">Allow test-takers to go back to previous questions</span>
                                </div>
                                <div className="form-input-group">
                                    <label className="switch"><input type="checkbox" name="backNavigation" checked={settings.backNavigation} onChange={handleChange} /><span className="slider round"></span></label>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="form-group-row">
                                <label className="form-label-title">Results</label>
                                <div className="form-input-group">
                                    <label className="custom-radio"><input type="radio" name="results" value="immediately" checked={settings.results === 'immediately'} onChange={handleChange} /><span className="radio-dot"></span>Show results immediately</label>
                                    <label className="custom-radio"><input type="radio" name="results" value="later" checked={settings.results === 'later'} onChange={handleChange} /><span className="radio-dot"></span>Show results later</label>
                                </div>
                            </div>

                             {/* Attempts */}
                            <div className="form-group-row">
                                <label className="form-label-title">Attempts</label>
                                <div className="form-input-group">
                                    <label className="custom-radio"><input type="radio" name="attempts" value="unlimited" checked={settings.attempts === 'unlimited'} onChange={handleChange} /><span className="radio-dot"></span>Unlimited</label>
                                    <label className="custom-radio"><input type="radio" name="attempts" value="limited" checked={settings.attempts === 'limited'} onChange={handleChange} /><span className="radio-dot"></span>Limit attempts</label>
                                    
                                    {/* Conditional Input */}
                                    {settings.attempts === 'limited' && (
                                        <div className="conditional-input">
                                            <label htmlFor="numberOfAttempts">Number of attempts</label>
                                            <input type="number" id="numberOfAttempts" name="numberOfAttempts" value={settings.numberOfAttempts} onChange={handleChange} />
                                        </div>
                                    )}
                                </div>
                            </div>

                <div className="page-footer-actions">
                        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
                        <button type="submit" className="btn btn-primary">Next</button>
               </div>
            </form> 
        </div>
        </div>
    );
};

export default QuizSettings;