import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <StreamProvider>
      <Router>
        <Routes>
          <Route path="/instructionscreen" element={<InstructionScreen />} />
          <Route path="/tutorialscreen" element={<TutorialScreen />} />
          <Route path="/connectionstrength" element={<ConnectionStrength />} />
          <Route path="/videoquestion" element={<VideoQuestion />} />
          <Route path="/codingquestion" element={<CodingQuestion />} />
          <Route path="/mcqquestion" element={<McqQuestion />} />
          <Route path="/fullscreen" element={<FullScreen />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/basic-details" element={<BasicDetails />} />
          <Route path="/permission" element={<PermissionScreen />} />
          <Route path="/audioquestion" element={<AudioQuestion />} />
          <Route path="/demoquestion" element={<DemoQuestion />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/sectionpage" element={<SectionPage />} />
        </Routes>
      </Router>
    </StreamProvider>
  );
}

export default App;
