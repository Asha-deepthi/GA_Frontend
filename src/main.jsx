// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ import this
import './index.css'; // Tailwind CSS styles
import App from './App'; // Import your App component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ wrap with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
