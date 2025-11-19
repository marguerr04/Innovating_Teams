import React from 'react';
import VideoIntroCard from '../Phase0/components/VideoIntroCard';
export default function Phase5Interstitial({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <VideoIntroCard videoId={18} size="medium" />
      <button className="btn px-6 py-2 mt-6" onClick={onNext}>Siguiente</button>
    </div>
  );
}
