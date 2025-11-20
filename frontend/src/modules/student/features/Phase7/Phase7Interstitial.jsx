// src/modules/student/features/Phase7/Phase7Interstitial.jsx

import React from 'react';
import VideoIntroCard from '../Phase0/components/VideoIntroCard';

export default function Phase7Interstitial({ onNext }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-4xl mx-auto">
        <VideoIntroCard videoId={20} size="medium" />
        <div className="text-right mt-6">
          <button className="btn px-6 py-2" onClick={onNext}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}