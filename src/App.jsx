import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignupPage from "./Test_creation/pages/signup";
import VerifyEmail from "./Test_creation/pages/VerifyEmail";
import LoginPage from "./Test_creation/pages/login";
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

function App() {
  return (
    <StreamProvider>
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email/:uuid" element={<VerifyEmail />} />
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
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <InterviewDashboard />
          </PrivateRoute>
        }
      />
        <Route path="/instructionscreen:testId" element={<InstructionScreen />} />
        <Route path="/tutorialscreen" element={<TutorialScreen />} />
        <Route path="/connectionstrength" element={<ConnectionStrength />} />
        <Route path="/videoquestion" element={<VideoQuestion />} />
        <Route path="/codingquestion" element={<CodingQuestion />} />
        <Route path="/mcqquestion" element={<McqQuestion />} />
        <Route path="/fullscreen" element={<FullScreen />} />
        <Route path="/welcome/:testId" element={<WelcomeScreen />} />
        <Route path="/basic-details" element={<BasicDetails />} />
        <Route path="/permission" element={<PermissionScreen />} />
        <Route path="/audioquestion" element={<AudioQuestion />} />
        <Route path="/demoquestion" element={<DemoQuestion />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/sectionpage" element={<SectionPage />} />
        <Route path="/evaluation" element={<CandidateEvaluation />} />
        <Route path="/test-candidates" element={<Test_CandidatePage />} />
      </Routes>
    </StreamProvider>
  );
}

export default App;
