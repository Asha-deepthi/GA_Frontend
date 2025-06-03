// icons.jsx
import React from 'react';
import { Eye, EyeOff } from "lucide-react";

export const EyeIcon = Eye;
export const EyeOffIcon = EyeOff;

// ✅ Rename custom ones to avoid conflict
export const CustomEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const CustomEyeOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export const Check = () => <span>✅</span>;

export const GmailLogo = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.54706 17.1818H5.4565V8.63636L0 4.36364V15.2727C0 16.3273 1.14118 17.1818 2.54706 17.1818Z"
      fill="#4285F4"
    />
    <path d="M18.5435 17.1818H21.4529C22.8588 17.1818 24 16.3273 24 15.2727V4.36364L18.5435 8.63636" fill="#34A853" />
    <path
      d="M18.5435 2.72727V8.63636L24 4.36364V2.72727C24 1.22727 22.2635 0.409091 21.1059 1.36364L18.5435 2.72727Z"
      fill="#FBBC04"
    />
    <path d="M5.4565 8.63636V2.72727L12 7.90909L18.5435 2.72727V8.63636L12 13.8182L5.4565 8.63636Z" fill="#EA4335" />
    <path
      d="M0 2.72727V4.36364L5.4565 8.63636V2.72727L2.89412 1.36364C1.73647 0.409091 0 1.22727 0 2.72727Z"
      fill="#C5221F"
    />
  </svg>
);

export const OutlookLogo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" fill="#0078D4" />
    <path d="M10 12.5L4 8.5V15.5H16V8.5L10 12.5Z" fill="white" />
    <path d="M16 4.5H4V8.5L10 12.5L16 8.5V4.5Z" fill="white" />
  </svg>
);

export const TealAsterisk = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 0C8.55228 0 9 0.447715 9 1V5.58579L12.2929 2.29289C12.6834 1.90237 13.3166 1.90237 13.7071 2.29289C14.0976 2.68342 14.0976 3.31658 13.7071 3.70711L10.4142 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H10.4142L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L9 10.4142V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V10.4142L3.70711 13.7071C3.31658 14.0976 2.68342 14.0976 2.29289 13.7071C1.90237 13.3166 1.90237 12.6834 2.29289 12.2929L5.58579 9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H5.58579L2.29289 3.70711C1.90237 3.31658 1.90237 2.68342 2.29289 2.29289C2.68342 1.90237 3.31658 1.90237 3.70711 2.29289L7 5.58579V1C7 0.447715 7.44772 0 8 0Z"
      fill="#0D9488"
    />
  </svg>
);
