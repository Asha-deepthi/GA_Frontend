import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignupPage from "./Test_creation/pages/signup";
//import VerifyEmail from "./Test_creation/pages/VerifyEmail";
import LoginPage from "./Test_creation/pages/login";
//import Positions from "./Test_creation/pages/tests";
//import JobImportForm from "./Test_creation/pages/importform";
import InterviewDashboard from "./Test_creation/pages/dashboard";
import QuizPreview from "./Test_creation/pages/QuizPreview";
import QuizSettings from "./Test_creation/pages/QuizSettings";
import SendInvitations from "./Test_creation/pages/SendInvitations";
import QuizCreationFlow  from "./Test_creation/pages/QuizCreationFlow";
import ImportCandidates from "./Test_creation/pages/ImportCandidates";
import PrivateRoute from "./Test_creation/components/PrivateRoute";
import { StreamProvider } from './Test_execution/StreamContext';
import SectionPage from "./Test_execution/SectionPage";
import InstructionScreen from './Test_execution/InstructionScreen';
import TutorialScreen from './Test_execution/TutorialScreen';
import ConnectionStrength from './Test_execution/ConnectionStrength';
import VideoQuestion from './Test_execution/VideoQuestion';
import CodingQuestion from './Test_execution/CodingQuestion';
import McqQuestion from './Test_execution/McqQuestion';
import FullScreen from './Test_execution/FullScreen';
import WelcomeScreen from './Test_execution/WelcomeScreen';
import BasicDetails from './Test_execution/BasicDetails';
import PermissionScreen from './Test_execution/PermissionScreen';
import AudioQuestion from './Test_execution/AudioQuestion';
import DemoQuestion from './Test_execution/DemoQuestion';
import ResultScreen from './Test_execution/ResultScreen';
import CandidateEvaluation from './Test_execution/CandidateEvaluation';
import Test_CandidatePage from './Test_execution/Test_CandidatePage';
import Popupalert_1 from './Test_execution/TabSwitchAlert';
import Popupalert_2 from './Test_execution/CameraOffAlert';
import Popupalert_3 from './Test_execution/LowNetworkAlert';
import Popupalert_4 from './Test_execution/AudioAlert';
import Popupalert_5 from './Test_execution/VideoAlert';
import TestSubmission from './Test_execution/TestSubmission';
import Timeupscreen from './Test_execution/TimeupScreen';
import TestSummaryScreen from './Test_execution/TestSummaryScreen';
import { AuthProvider } from './Test_creation/contexts/AuthContext';
import FaqPage from './Test_execution/faqpage';
import Candidates from './Test_execution/Candidates';

function App() {
  return (
    <AuthProvider>
    <StreamProvider>
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/*<Route path="/verify-email/:uuid" element={<VerifyEmail />} />*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/QuizPreview" element={<QuizPreview />} />
      <Route path="/QuizSettings" element={< QuizSettings/>} />
      <Route path="/import-candidates/:testId" element={<ImportCandidates />} />
      <Route path="/send-invitation/:testId" element={<SendInvitations />} />
      <Route 
      path="/QuizCreationFlow"
      element={
       <PrivateRoute>
        <QuizCreationFlow />
        </PrivateRoute>
        }
      />
     {/*<Route path="/tests" element={<Positions />} />*/}
     {/*<Route path="/interviewquestions" element={<InterviewQuestions />} />*/}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <InterviewDashboard />
          </PrivateRoute>
        }
      />
        <Route path="/instructionscreen/:testId" element={<InstructionScreen />} />
        <Route path="/tutorialscreen/:testId" element={<TutorialScreen />} />
        <Route path="/connectionstrength/:testId" element={<ConnectionStrength />} />
        <Route path="/videoquestion/:testId" element={<VideoQuestion />} />
        <Route path="/codingquestion/:testId" element={<CodingQuestion />} />
        <Route path="/mcqquestion/:testId" element={<McqQuestion />} />
        <Route path="/fullscreen" element={<FullScreen />} />
        <Route path="/welcome/:testId" element={<WelcomeScreen />} />
        {/*<Route path="/basic-details/:testId" element={<BasicDetails />} />*/}
        <Route path="/permission/:testId" element={<PermissionScreen />} />
        <Route path="/audioquestion/:testId" element={<AudioQuestion />} />
        <Route path="/demoquestion/:testId" element={<DemoQuestion />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/sectionpage/:testId/:candidateTestId" element={<SectionPage />} />
        <Route path="/evaluation" element={<CandidateEvaluation />} />
        <Route path="/test-candidates" element={<Test_CandidatePage />} />
        <Route path="/popup" element={<Popupalert_5 />} />
        <Route path="/submission/:candidateTestId" element={<TestSubmission/>}/>
        <Route path="/timeupscreen" element={<Timeupscreen/>}/>
       <Route path="/test/:testId/section/:sectionId/review" element={<TestSummaryScreen />} />
        <Route path="/faqpage" element={<FaqPage/>}/>
        <Route path="/candidates" element={<Candidates />} />
      </Routes>
    </StreamProvider>
    </AuthProvider>
  );
}

export default App;
