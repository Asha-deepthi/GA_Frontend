import React from 'react';
import { FaClock } from 'react-icons/fa';

export default function CodeEditorQuestionScreen() {
  return (
    <div className="flex flex-col items-center font-overpass">
      {/* Top Div: Timer */}
      <div
        className="flex justify-end items-center"
        style={{
          width: '1250px',
          height: '84px',
          padding: '20px 30px',
        }}
      >
        <div
          className="flex items-center"
          style={{
            width: '115px',
            height: '44px',
            gap: '10px',
            padding: '10px 22px 10px 20px',
            borderRadius: '70px',
            border: '1px solid #E0302D',
            background: '#E0302D0D',
          }}
        >
          <FaClock className="text-red-600" />
          <span className="text-red-600 font-medium">20:00</span>
        </div>
      </div>

      {/* Bottom Div: Content */}
      <div className="flex gap-6">
        {/* Left Div: Question */}
        <div
          style={{
            width: '396px',
            height: '686px',
            gap: '10px',
            padding: '30px',
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid rgba(0,163,152,0.3)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              width: '336px',
              height: '210px',
              fontFamily: 'Overpass',
              fontWeight: 400,
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0%',
              color: '#1A1A1A',
            }}
          >
            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ?
          </div>
        </div>

        {/* Right Div: Editor/Output Containers */}
        <div
          style={{
            width: '764px',
            height: '686px',
            gap: '15px',
            padding: '15px',
            background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0,163,152,0.03), rgba(0,163,152,0.03))',
            borderRadius: '10px',
            border: '1px solid',
            borderImageSource: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0,163,152,0.18), rgba(0,163,152,0.18))',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Compiler Box */}
          <div style={{ flex: 1, marginBottom: '15px' }}>
            {/* Code editor goes here */}
          </div>
          {/* Output Box */}
          <div style={{ flex: 1 }}>
            {/* Output console goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
