import React from 'react';
import { Mic } from 'lucide-react';

const MicrophoneStatus = () => {
  return (
    <div className="flex items-center justify-between w-[320px] h-[56px] px-4 border-b">
      <div className="flex items-center gap-2">
        <Mic size={20} />
        <span className="text-sm text-[#0F1417]">Microphon...</span>
      </div>
      <span className="text-lg font-bold text-green-600">✓</span>
    </div>
  );
};

export default MicrophoneStatus;