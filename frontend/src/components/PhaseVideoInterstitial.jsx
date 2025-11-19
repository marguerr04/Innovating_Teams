import React from 'react';
import VideoIntroCard from '../modules/student/features/Phase0/components/VideoIntroCard';

export default function PhaseVideoInterstitial({ videoId = 15, size = 'large', onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl px-4">
        <div className="mb-4 text-right">
          <button onClick={onClose} className="btn px-4 py-2 text-sm">Saltar introducción</button>
        </div>
        <VideoIntroCard videoId={videoId} size={size} />
      </div>
    </div>
  );
}
