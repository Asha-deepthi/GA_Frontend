import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizDetailsForm from './QuizDetailsForm';
import SectionSetupPage from './SectionSetupPage';
import CreateQuestionsPage from './CreateQuestionsPage';
import QuizSettings from './QuizSettings'; 
import QuizPreview from './QuizPreview';
import NavBar from '../components/Navbar'; 

const QuizCreationFlow = () => {
  // We still use internal steps 1, 2, 3, 4 for navigation
  const [currentStep, setCurrentStep] = useState(1);
   const [quizData, setQuizData] = useState({ details: {}, sections: [], settings: {} });
  const [isLoading, setIsLoading] = useState(false); // For feedback during submission
  const navigate = useNavigate(); // --- CHANGE: Initialize the navigate function

  const handleNext = (data) => {
    setQuizData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
    // --- CHANGE: This is the core logic for publishing the quiz ---
const handleSubmit = async () => {
    const accessToken = sessionStorage.getItem("access_token");
  setIsLoading(true);
  console.log("Submitting full quiz data:", quizData);

      // --- START OF THE FIX ---
    // Prepare a clean version of the quiz data before sending.
    
    // 1. Check the global setting.
    const isNegativeMarkingOn = quizData.settings.negativeMarking === 'negative_marking';

    // 2. Create a "cleaned" version of the sections array.
    const cleanedSections = quizData.sections.map(section => {
      // If the setting is OFF, force negativeMarks to be null.
      // If the setting is ON, make sure any blank value becomes 0.
      const cleanedNegativeMarks = isNegativeMarkingOn
        ? (section.negativeMarks || 0) 
        : null;

      return { ...section, negativeMarks: cleanedNegativeMarks };
    });

    // 3. Create the final payload with the cleaned sections.
    const finalQuizData = {
      ...quizData,
      sections: cleanedSections,
    };

    console.log("Submitting cleaned quiz data:", finalQuizData);

  try {
    const response = await fetch('http://localhost:8000/api/test-creation/tests/full-create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`},
      body: JSON.stringify(quizData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Quiz published successfully:', result);
    alert('Quiz published successfully!');
   if (result.test_id) {
      navigate(`/import-candidates/${result.test_id}`); // Correct navigation
    } else {
      alert("Could not get Test ID from server. Cannot proceed.");
    }// ✅ redirect to next step

  } catch (error) {
    console.error('Failed to publish quiz:', error);
    alert(`Error publishing quiz: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
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
              return <QuizSettings onBack={handleBack} onNext={handleNext} />;
          // --- NEW STEP 5: Render the QuizPreview component and pass the handleSubmit function ---
          case 5:
              // The preview component gets the final handleSubmit function
              return <QuizPreview onBack={handleBack} handleSubmit={handleSubmit} quizData={quizData} />;
          // Fallback case
          default:
              return <QuizDetailsForm onNext={handleNext} />;
      }
  }

  return (
    <>
      <NavBar />
      <main className="main-content">
        <div className="stepper">
          {/* Step 1: Test Title */}
          <div className={`step ${currentStep > 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div><div className="step-label">Test Title</div>
          </div>
          <div className={`connector ${currentStep > 1 ? 'active' : ''}`}></div>
          {/* Step 2: Set Interview questions (Covers our internal steps 2, 3, 4, and 5) */}
          <div className={`step ${currentStep >= 6 ? 'completed' : ''} ${[2, 3, 4, 5].includes(currentStep) ? 'active' : ''}`}>
            <div className="step-circle">2</div><div className="step-label">Set interview questions</div>
          </div>
          <div className={`connector ${currentStep >= 6 ? 'active' : ''}`}></div>
          {/* Step 3: Import candidates (This will be the next page after publishing) */}
          <div className="step"><div className="step-circle">3</div><div className="step-label">Import candidates</div></div>
          <div className="connector"></div>
          {/* Step 4: Send Interview invitation */}
          <div className="step"><div className="step-circle">4</div><div className="step-label">Send Interview invitation</div></div>
        </div>
        
        {isLoading ? <div style={{textAlign: 'center', padding: '50px'}}><h2>Publishing Quiz...</h2></div> : renderStep()}
      </main>
    </>
  );
};

export default QuizCreationFlow;