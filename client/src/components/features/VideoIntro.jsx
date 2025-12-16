import React from 'react';
import introVideo from '../../assets/1.-Logotype-Reveal-16_9.mp4';

const VideoIntro = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black/10 z-10" /> {/* Léger overlay pour s'assurer que le blanc ressorte bien après */}
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={introVideo} type="video/mp4" />
      </video>
      
      {/* Indicateur de scroll optionnel pour l'UX */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white/80" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default VideoIntro;

