// src/test-creation/components/Navbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex gap-8 p-4 border-b">
      <button
        className={`pb-1 ${location.pathname === '/' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
        onClick={() => navigate('/')}
      >
        Home
      </button>
      <button
        className={`pb-1 ${location.pathname === '/evaluations' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
        onClick={() => navigate('/evaluations')}
      >
        Evaluations
      </button>
      <button
        className={`pb-1 ${location.pathname === '/import-form' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
        onClick={() => navigate('/import-form')}
      >
        Positions
      </button>
    </div>
  );
};

export default Navbar;