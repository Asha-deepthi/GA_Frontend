import React, { useState, useEffect } from 'react';

const QuizSettings = ({ onBack, onNext, initialData }) => {
    
    // --- STYLES UPDATED WITH LARGER TEXT SIZES ---
    const styles = `
        :root {
            --primary-color: #00A99D;
            --light-gray-bg: #F0F2F5;
            --border-color: #E0E0E0;
            --text-title: #262626;
            --text-body: #595959;
            --white-color: #FFFFFF;
        }

        body {
            background-color: var(--white-color);
            margin: 0;
        }

        .quiz-settings-page {
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; 
             color: var(--text-body);
             padding: 32px;
             max-width: 900px;
             margin: 32px auto;
        }

        /* Main Tabs */
        .main-tabs { 
            display: flex;
            gap: 24px;
            margin-bottom: 24px; 
            border-bottom: 1px solid var(--border-color); 
        }
        .tab-item { 
            background: none; 
            border: none; 
            padding: 12px 4px; 
            font-size: 1rem; 
            font-weight: 500;
            cursor: pointer; 
            color: var(--text-body); 
            border-bottom: 2px solid transparent; 
        }
        .tab-item.active { 
            color: var(--primary-color); 
            border-bottom-color: var(--primary-color); 
        }

        /* Header */
        .settings-header { 
            margin-bottom: 40px; 
        }
        .settings-header h1 { 
            font-size: 28px; 
            font-weight: 600;
            color: var(--primary-color); 
            margin: 0 0 8px 0; 
        }
        .settings-header p { 
            margin: 0; 
            color: var(--text-body); 
            font-size: 1rem;
        }

        /* Form Layout & Groups */
        .settings-form { 
            display: flex; 
            flex-direction: column; 
            gap: 32px; 
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        /* MODIFICATION: Increased title font size */
        .form-group-title { 
            font-weight: 600; 
            font-size: 1.2rem; /* Increased size */
            color: var(--text-title);
        }
        .form-input-group { 
            display: flex; 
            flex-direction: column; 
            gap: 16px; 
        }
        
        /* MODIFICATION: Increased sub-label font size */
        .form-input-group > label,
        .conditional-input label {
            font-size: 1rem; /* Increased size */
            color: var(--text-body);
        }
        
        /* Styled Inputs */
        .styled-input {
            width: 100%;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            background-color: var(--light-gray-bg);
            box-sizing: border-box;
        }
        .styled-input:focus {
            outline: 2px solid var(--primary-color);
        }
        
        /* Custom Radio Button Box */
        .custom-radio { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            cursor: pointer; 
            width: 100%; 
            font-size: 0.95rem;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
        }
        .custom-radio input[type="radio"] { 
            display: none;
        }
        .custom-radio .radio-dot { 
            height: 20px; 
            width: 20px; 
            border: 2px solid #D9D9D9; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: border-color 0.2s; 
            flex-shrink: 0;
        }
        .custom-radio .radio-dot::after { 
            content: ''; 
            width: 10px; 
            height: 10px; 
            background-color: var(--primary-color); 
            border-radius: 50%; 
            display: block; 
            opacity: 0; 
            transition: opacity 0.2s; 
        }
        .custom-radio input[type="radio"]:checked + .radio-dot { 
            border-color: var(--primary-color); 
        }
        .custom-radio input[type="radio"]:checked + .radio-dot::after { 
            opacity: 1; 
        }
        
        .custom-radio:has(input:checked) {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 1px var(--primary-color);
        }
        
        /* Navigation Toggle Row */
        .navigation-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--light-gray-bg);
            padding: 16px 20px;
            border-radius: 8px;
        }
        .navigation-label .form-group-title { margin-bottom: 4px; }
        .navigation-label .label-description { font-size: 0.9rem; color: var(--text-body); }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--primary-color); }
        input:checked + .slider:before { transform: translateX(20px); }

        .conditional-input { 
    background-color: var(--white-color);
    background-color: var(--light-gray-bg);
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
    .conditional-input .styled-input {
      background-color: var(--white-color);
    border: 1px solid var(--border-color);
}
        /* Footer Buttons */
        .page-footer-actions { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 40px; 
        }
        .btn { 
            padding: 10px 24px; 
            border: none; 
            border-radius: 20px; 
            font-size: 1rem; 
            font-weight: 500; 
            cursor: pointer; 
        }
        .btn-primary { 
            background-color: var(--primary-color); 
            color: white; 
        }
        .btn-secondary { 
            background-color: var(--light-gray-bg); 
            color: var(--text-body); 
        }
    `;

    const defaultSettings = {
        passingPercentage: '',
        scoring: 'per_question',
        negativeMarking: 'no_negative_marking',
        backNavigation: false,
        results: 'immediately',
        attempts: 'unlimited',
        numberOfAttempts: '',
    };

    const [settings, setSettings] = useState({ ...defaultSettings, ...initialData });

    useEffect(() => {
        if (initialData) {
            setSettings({ ...defaultSettings, ...initialData });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "attempts" && value === "unlimited") {
            setSettings(prevSettings => ({
                ...prevSettings,
                attempts: value,
                numberOfAttempts: ''
            }));
        } else {
            setSettings(prevSettings => ({
                ...prevSettings,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ settings });
    };

    return (
        <div className="quiz-settings-page">
            <style>{styles}</style>
            
            <div className="main-tabs">
                <button type="button" className="tab-item">Sections</button>
                <button type="button" className="tab-item">Questions</button>
                <button type="button" className="tab-item active">Settings</button>
                <button type="button" className="tab-item">Preview</button>
            </div>

            <div className="settings-content">
                <div className="settings-header">
                    <h1>Settings</h1>
                    {/*<p>Configure quiz-wide settings</p>*/}
                </div>
                
                <form className="settings-form" onSubmit={handleSubmit}>
                    
                    {/* Passing Criteria */}
                    <div className="form-group">
                        <label className="form-group-title">Passing criteria</label>
                        <div className="form-input-group">
                            <label htmlFor="passingPercentage">Percentage to pass</label>
                            <input type="number" id="passingPercentage" name="passingPercentage" value={settings.passingPercentage} onChange={handleChange} min="0" max="100" className="styled-input" />
                        </div>
                    </div>
                    
                    {/* Scoring */}
                    <div className="form-group">
                        <label className="form-group-title">Scoring</label>
                        <div className="form-input-group">
                            <label className="custom-radio">
                                <input type="radio" name="scoring" value="per_question" checked={settings.scoring === 'per_question'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Per question</span>
                            </label>
                            <label className="custom-radio">
                                <input type="radio" name="scoring" value="per_section" checked={settings.scoring === 'per_section'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Per section</span>
                            </label>
                        </div>
                    </div>

                    {/* Negative Marking */}
                    <div className="form-group">
                        <label className="form-group-title">Negative marking</label>
                        <div className="form-input-group">
                            <label className="custom-radio">
                                <input type="radio" name="negativeMarking" value="no_negative_marking" checked={settings.negativeMarking === 'no_negative_marking'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>No negative marking</span>
                            </label>
                            <label className="custom-radio">
                                <input type="radio" name="negativeMarking" value="negative_marking" checked={settings.negativeMarking === 'negative_marking'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Negative marking</span>
                            </label>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="form-group">
                        <label className="form-group-title">Navigation</label>
                        <div className="navigation-row">
                             <div className="navigation-label">
                                <div className="form-group-title">Back navigation</div>
                                <span className="label-description">Allow test-takers to go back to previous questions</span>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="backNavigation" checked={settings.backNavigation} onChange={handleChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="form-group">
                        <label className="form-group-title">Results</label>
                        <div className="form-input-group">
                            <label className="custom-radio">
                                <input type="radio" name="results" value="immediately" checked={settings.results === 'immediately'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Show results immediately</span>
                            </label>
                             <label className="custom-radio">
                                <input type="radio" name="results" value="later" checked={settings.results === 'later'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Show results later</span>
                            </label>
                        </div>
                    </div>

                    {/* Attempts */}
                    <div className="form-group">
                        <label className="form-group-title">Attempts</label>
                        <div className="form-input-group">
                             <label className="custom-radio">
                                <input type="radio" name="attempts" value="unlimited" checked={settings.attempts === 'unlimited'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Unlimited</span>
                            </label>
                            <label className="custom-radio">
                                <input type="radio" name="attempts" value="limited" checked={settings.attempts === 'limited'} onChange={handleChange} />
                                <span className="radio-dot"></span>
                                <span>Limit attempts</span>
                            </label>
                            </div>                            
                             {/* The conditional input is now OUTSIDE the radio button group,
                            making it a separate element below them. */}
                        {settings.attempts === 'limited' && (
                            <div className="conditional-input">
                                <label htmlFor="numberOfAttempts">Number of attempts</label>
                                <input type="number" id="numberOfAttempts" name="numberOfAttempts" value={settings.numberOfAttempts} onChange={handleChange} min="1" className="styled-input"/>
                            </div>
                        )}
                    </div>
                    {/* --- END OF CHANGE --- */}
                    
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