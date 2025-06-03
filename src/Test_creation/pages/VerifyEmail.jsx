// src/test-creation/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/verify-email/`,
          { uuid }
        );

        if (response.status === 200) {
          setMessage('Email verified successfully! Redirecting to login...');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setMessage('Invalid or expired link. Redirecting to signup...');
          setTimeout(() => navigate('/signup'), 3000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('Re-enter your email and try again. Redirecting to signup...');
        setTimeout(() => navigate('/signup'), 3000);
      }
    };

    verifyEmail();
  }, [uuid, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
};

export default VerifyEmail;
