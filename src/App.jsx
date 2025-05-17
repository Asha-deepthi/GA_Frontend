import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './Test_execution/WelcomeScreen';
import BasicDetails from './Test_execution/BasicDetails';
import PermissionScreen from './Test_execution/PermissionScreen';
import AudioQuestion from './Test_execution/AudioQuestion';
import DemoQuestion from './Test_execution/DemoQuestion';
import ResultScreen from './Test_execution/ResultScreen';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/basic-details" element={<BasicDetails />} />
         <Route path="/permission" element={<PermissionScreen />} />
          <Route path="/audioquestion" element={<AudioQuestion />} />
           <Route path="/demoquestion" element={<DemoQuestion />} />
           <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
