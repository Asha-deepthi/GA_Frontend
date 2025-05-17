import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstructionScreen from './Test_execution/InstructionScreen';
import TutorialScreen from './Test_execution/TutorialScreen';
import ConnectionStrength from './Test_execution/ConnectionStrength';
import VideoQuestion from './Test_execution/VideoQuestion';
import CodingQuestion from './Test_execution/CodingQuestion';
import McqQuestion from './Test_execution/McqQuestion';
import FullScreen from './Test_execution/FullScreen';

function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/instructionscreen" element={<InstructionScreen />} />
                    <Route path="/tutorialscreen" element={<TutorialScreen />} />
                    <Route path="/connectionstrength" element={<ConnectionStrength />} />
                    <Route path="/videoquestion" element={<VideoQuestion />} />
                    <Route path="/codingquestion" element={<CodingQuestion />} />
                    <Route path="/mcqquestion" element={<McqQuestion />} />
                    <Route path="/fullscreen" element={<FullScreen />} />
                </Routes>
            </Router>
    );
};

export default App;