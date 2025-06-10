import React, { useState } from 'react';
import QuizDetailsForm from './QuizDetailsForm';
import SectionSetupPage from './SectionSetupPage';
import CreateQuestionsPage from './CreateQuestionsPage';

const QuizCreationFlow = () => {
  // We still use internal steps 1, 2, 3, 4 for navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState({ details: {}, sections: [] });

  const handleNext = (data) => {
    setQuizData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const renderStep = () => {
      switch(currentStep) {
          case 1:
              return <QuizDetailsForm onNext={handleNext} />;
          case 2:
              return <SectionSetupPage onBack={handleBack} onNext={handleNext} initialQuizData={quizData} />;
          case 3:
              return <CreateQuestionsPage onBack={handleBack} onNext={handleNext} quizData={quizData} />;
          case 4: 
              return <div style={{textAlign: 'center', padding: '50px'}}><h2>Step 4: Import Candidates & Send</h2><button onClick={handleBack} className="action-btn btn-secondary">Back</button></div>;
          default:
              return <QuizDetailsForm onNext={handleNext} />;
      }
  }

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="logo"><span className="logo-square"></span> GA Proctored Test</div>
          <nav className="header-nav"><a href="#">Dashboard</a><a href="#">Tests</a><a href="#">Candidates</a><a href="#" className="active-link">Create test</a></nav>
          <div className="user-profile"><span className="notification-bell" role="img" aria-label="notifications">🔔</span><div className="avatar"></div><span>Arjun Pranan ▼</span></div>
        </div>
      </header>
      <main className="main-content">
        {/* --- THE FIX IS IN THIS SECTION --- */}
        <div className="stepper">
          {/* Step 1: Test Title */}
          <div className={`step ${currentStep > 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Test Title</div>
          </div>

          <div className={`connector ${currentStep > 1 ? 'active' : ''}`}></div>

          {/* Step 2: Set Interview questions (Covers our internal steps 2 and 3) */}
          <div className={`step ${currentStep > 3 ? 'completed' : ''} ${currentStep === 2 || currentStep === 3 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">Set Interview questions</div>
          </div>
          
          <div className={`connector ${currentStep > 3 ? 'active' : ''}`}></div>

          {/* Step 3: Import candidates (Our internal step 4) */}
          <div className={`step ${currentStep > 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Import candidates</div>
          </div>
          
          <div className={`connector ${currentStep > 4 ? 'active' : ''}`}></div>

          {/* Step 4: Send Interview invitation (Our internal step 5) */}
          <div className={`step ${currentStep === 5 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <div className="step-label">Send Interview invitation</div>
          </div>
        </div>
        
        {renderStep()}
      </main>
    </>
  );
};

export default QuizCreationFlow;