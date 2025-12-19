import React, { useRef, useEffect, useState } from 'react';
import introVideo from '../../assets/background.mp4';
import logo1 from '../../assets/logo1.png';
import Background from './background.jsx';

const VideoIntro = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logo1Opacity, setLogo1Opacity] = useState(0);
  const [backgroundZoom, setBackgroundZoom] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Phase 1 : Premier scroll (0 à 1 fenêtre)
      // Phase 2 : Deuxième scroll (1 à 2 fenêtres)
      const phase1Progress = Math.min(scrollY / windowHeight, 1); // 0 à 1
      const phase2Progress = Math.max(0, Math.min((scrollY - windowHeight) / windowHeight, 1)); // 0 à 1
      
      setScrollProgress(phase1Progress);

      // PHASE 1 : Premier scroll - Logo1 apparaît + Zoom du background
      if (scrollY < windowHeight) {
        // Logo1 apparaît progressivement pendant le premier scroll
        setLogo1Opacity(phase1Progress);
        
        // Zoom du background : de 1 à 3 pendant le premier scroll
        const zoom = 1 + (phase1Progress * 2); // 1 à 3
        setBackgroundZoom(zoom);
      }
      
      // PHASE 2 : Deuxième scroll - Logo1 disparaît
      else if (scrollY >= windowHeight && scrollY < windowHeight * 2) {
        // Logo1 disparaît progressivement
        setLogo1Opacity(Math.max(0, 1 - phase2Progress));
        
        // Le zoom reste à 3 (maximum)
        setBackgroundZoom(3);
      }
      
      // Après le deuxième scroll : logo disparaît, background reste
      else {
        setLogo1Opacity(0);
        setBackgroundZoom(3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden bg-black">
        {/* ma planete et on zoom dessus */}
        <Background zoom={backgroundZoom} />
        
        {/* Logo ODYWP */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-300"
          style={{ opacity: logo1Opacity }}
        >
          <img 
            src={logo1} 
            alt="Logo 1" 
            className="max-w-md w-3/4 h-auto"
          />
        </div>

        {/* Ifleche de scroll */}
        {scrollProgress < 1 && (
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
        )}
      </div>
    </>
  );
};

export default VideoIntro;
