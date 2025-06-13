import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';


const StopwatchIcon = () => (
  <svg className="stopwatch-icon" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10Z" fill="#CFD8DC"/>
    <path d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15Z" fill="white"/>
    <path d="M48 5H52V0H48V5Z" fill="#B0BEC5"/>
    <path d="M60 7L63 4L60 1L57 4L60 7Z" fill="#B0BEC5"/>
    <path d="M50 19V23" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M50 77V81" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M81 50H77" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M23 50H19" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M72.4264 27.5736L69.6 30.4" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30.4 69.6L27.5736 72.4264" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M72.4264 72.4264L69.6 69.6" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30.4 30.4L27.5736 27.5736" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M50 50L58 28" stroke="#E63946" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 50V35" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const DecorationShape = () => (
    <svg className="decoration-shape" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 0L61.2266 38.7734L100 50L61.2266 61.2266L50 100L38.7734 61.2266L0 50L38.7734 38.7734L50 0Z" fill="#00A896" fillOpacity="0.2"/>
    </svg>
);

// --- Helper function to format time ---
const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};


// --- Main Functional Component ---

const ProctoredTestSubmission = () => {
    // State to manage the two phases: test-taking and submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for the main test timer
    const [testTimeLeft, setTestTimeLeft] = useState(10); // DEMO: Start with 10 seconds

    // State for the 5-second submission process
    const SUBMISSION_DURATION = 5;
    const [submissionTimeLeft, setSubmissionTimeLeft] = useState(SUBMISSION_DURATION);
    const [progress, setProgress] = useState(0);

    // Effect for the main test timer
    useEffect(() => {
        if (isSubmitting || testTimeLeft <= 0) {
            if (testTimeLeft <= 0 && !isSubmitting) {
                setIsSubmitting(true); // Trigger submission phase when time is up
            }
            return;
        }

        const timerId = setInterval(() => {
            setTestTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId); // Cleanup interval
    }, [testTimeLeft, isSubmitting]);

    // Effect for the submission animation (progress bar and 5s timer)
    useEffect(() => {
        if (!isSubmitting) return;

        const submissionTimerId = setInterval(() => {
            setSubmissionTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(submissionTimerId);
                    setProgress(100);
                    return 0;
                }
                const newTime = prevTime - 1;
                // Calculate progress based on time elapsed during submission
                const newProgress = ((SUBMISSION_DURATION - newTime) / SUBMISSION_DURATION) * 100;
                setProgress(newProgress);
                return newTime;
            });
        }, 1000);

        return () => clearInterval(submissionTimerId); // Cleanup interval
    }, [isSubmitting]);

    const formattedTestTime = formatTime(testTimeLeft);
    const formattedSubmissionTime = formatTime(submissionTimeLeft);

    // --- RENDER LOGIC ---

    if (!isSubmitting) {
        // --- Phase 1: Test in Progress View ---
        return (
            <div className="proctored-test-page">
               <TopHeader/>
                <main>
                    <h1>Test in Progress</h1>
                    <p>Time remaining:</p>
                    <div className="timer-display">
                        <div className="time-box"><span className="time-value">{formattedTestTime.hours}</span><span className="time-label">Hours</span></div>
                        <div className="time-box"><span className="time-value">{formattedTestTime.minutes}</span><span className="time-label">Minutes</span></div>
                        <div className="time-box"><span className="time-value">{formattedTestTime.seconds}</span><span className="time-label">Seconds</span></div>
                    </div>
                </main>
            </div>
        );
    }

    // --- Phase 2: Submission View (as in the image) ---
    return (
        <div className="proctored-test-page">
            <TopHeader/>
            <main>
                <StopwatchIcon />
                <div className="submission-message">
                    <h1>Time is up! Your test will now be submitted automatically.</h1>
                </div>
                <div className="timer-display">
                    <div className="time-box"><span className="time-value">{formattedSubmissionTime.hours}</span><span className="time-label">Hours</span></div>
                    <div className="time-box"><span className="time-value">{formattedSubmissionTime.minutes}</span><span className="time-label">Minutes</span></div>
                    <div className="time-box"><span className="time-value">{formattedSubmissionTime.seconds}</span><span className="time-label">Seconds</span></div>
                </div>
                <div className="progress-container">
                    <div className="progress-labels">
                        <span>Submitting</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </main>
            
            <DecorationShape />
        </div>
    );
};

// --- Embedded CSS for a single-file component ---
// You can move this to a separate .css file for larger projects.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

    :root {
        --primary-teal: #00a896;
        --accent-red: #e63946;
        --dark-text: #333;
        --light-text: #6c757d;
        --light-bg: #f7f9fa;
        --border-color: #e0e0e0;
        --progress-bg: #e9ecef;
        --color-orange: #f3722c;
        --color-yellow: #f9c74f;
        --color-green: #90be6d;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
    }

    .proctored-test-page * {
        box-sizing: border-box;
    }

    .proctored-test-page {
        background-color: #fff;
        color: var(--dark-text);
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .top-color-bar {
        height: 5px;
        background: linear-gradient(to right, var(--color-orange), var(--color-yellow), var(--color-green));
    }

    .proctored-test-page header {
        padding: 15px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
    }

    .test-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        color: var(--primary-teal);
    }

    .header-nav {
        display: flex;
        align-items: center;
        gap: 25px;
    }

    .faq-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #fff;
        border: 1px solid var(--accent-red);
        color: var(--accent-red);
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 500;
        cursor: pointer;
        font-size: 14px;
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }

    .user-profile .user-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: var(--primary-teal);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .proctored-test-page main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40px 20px;
    }
    
    .stopwatch-icon {
        width: 150px;
        height: auto;
        margin-bottom: 30px;
    }

    .submission-message h1 {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 5px;
    }
    
    .timer-display {
        display: flex;
        gap: 15px;
        margin: 40px 0;
    }

    .time-box {
        background-color: var(--light-bg);
        padding: 15px 25px;
        border-radius: 8px;
        min-width: 90px;
    }

    .time-value {
        display: block;
        font-size: 32px;
        font-weight: 600;
        color: var(--primary-teal);
    }

    .time-label {
        display: block;
        font-size: 11px;
        color: var(--light-text);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .progress-container {
        width: 100%;
        max-width: 500px;
    }

    .progress-labels {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: var(--dark-text);
        margin-bottom: 8px;
        font-weight: 500;
    }

    .progress-bar-bg {
        height: 8px;
        background-color: var(--progress-bg);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background-color: var(--primary-teal);
        border-radius: 4px;
        transition: width 0.5s ease-in-out;
    }
    
    .decoration-shape {
        position: absolute;
        bottom: -50px;
        left: -50px;
        width: 200px;
        height: 200px;
        z-index: 0;
        opacity: 0.5;
    }
  `}</style>
);


// The final component to export and use in your app
const Timeupscreen = () => {
    return (
        <>
            <GlobalStyles />
            <ProctoredTestSubmission />
        </>
    );
};

export default Timeupscreen;