import React, { useRef, useEffect } from 'react';
import introVideo from '../../assets/background.mp4';

const VideoIntro = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Gérer la transition en douceur lors de la boucle
    const handleTimeUpdate = () => {
      // Si la vidéo est presque à la fin, préparer la transition
      if (video.duration && video.currentTime >= video.duration - 0.1) {
        video.style.opacity = '0.95';
      } else {
        video.style.opacity = '1';
      }
    };

    const handleEnded = () => {
      // Transition en douceur lors du redémarrage
      video.style.opacity = '0.95';
      video.currentTime = 0;
      
      // Réafficher après un court délai pour une transition fluide
      setTimeout(() => {
        video.style.opacity = '1';
        video.play();
      }, 50);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black/10 z-10" /> 
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
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

