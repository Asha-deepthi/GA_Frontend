import React from 'react';

const VideoSection = ({ responses }) => {
  return (
    <div className="space-y-6">
      {responses.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="font-semibold mb-2">Q{index + 1}. {item.question}</h3>
          <video
            src={item.videoUrl}
            controls
            className="w-full rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default VideoSection;
