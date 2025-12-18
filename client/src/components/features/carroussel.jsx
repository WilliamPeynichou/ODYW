import React, { useState, useEffect, useRef } from 'react';
import { getAllVideos } from '../../service/videoService';

const Carrousel = ({ videos = [] }) => {
  // Fonction pour mélanger aléatoirement un tableau
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Mélanger les vidéos de manière aléatoire au chargement
  const [shuffledVideos, setShuffledVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef({});

  // Charger les vidéos depuis l'API
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        
        // Si des vidéos sont passées en props, on les utilise
        if (videos.length > 0) {
          setShuffledVideos(shuffleArray(videos));
          setLoading(false);
          return;
        }

        // Sinon, on charge les vidéos depuis l'API
        const videosData = await getAllVideos();
        
        // Mapper les données de l'API vers le format attendu par le carrousel
        const mappedVideos = videosData.map(video => ({
          id: video.id,
          title: video.title || 'Sans titre',
          description: video.description || '',
          url: video.video_url ? `http://localhost:3000/${video.video_url}` : null,
          thumbnail: null, // Pas de thumbnail pour l'instant
        }));

        // Filtrer les vidéos qui ont une URL valide
        const validVideos = mappedVideos.filter(video => video.url !== null);

        // Mélanger aléatoirement les vidéos
        setShuffledVideos(shuffleArray(validVideos));
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error);
        setShuffledVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [videos]);

  // Navigation vers l'élément précédent
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? shuffledVideos.length - 1 : prevIndex - 1
    );
  };

  // Navigation vers l'élément suivant
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === shuffledVideos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Aller à un élément spécifique
  const goToItem = (index) => {
    setCurrentIndex(index);
  };

  // Calculer les index précédent et suivant
  const getPreviousIndex = () => 
    currentIndex === 0 ? shuffledVideos.length - 1 : currentIndex - 1;
  
  const getNextIndex = () => 
    currentIndex === shuffledVideos.length - 1 ? 0 : currentIndex + 1;

  // Gérer la lecture automatique au survol
  const handleMouseEnter = (videoId, videoElement) => {
    if (videoElement) {
      videoElement.play().catch(err => console.log('Erreur de lecture:', err));
    }
  };

  const handleMouseLeave = (videoId, videoElement) => {
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  // Limiter la durée de lecture à 60 secondes maximum
  const handleTimeUpdate = (e) => {
    const videoElement = e.target;
    if (videoElement && videoElement.currentTime >= 60) {
      videoElement.pause();
      videoElement.currentTime = 60; // S'assurer qu'on reste à 60 secondes
    }
  };

  // Gérer la métadonnée chargée pour limiter la durée
  const handleLoadedMetadata = (e) => {
    const videoElement = e.target;
    // Si la vidéo fait plus de 60 secondes, on limite la lecture
    if (videoElement.duration > 60) {
      // L'événement timeupdate gérera déjà la limite
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm sm:text-base">Chargement des vidéos...</p>
      </div>
    );
  }

  if (!shuffledVideos || shuffledVideos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm sm:text-base">Aucune vidéo disponible</p>
      </div>
    );
  }

  const currentVideo = shuffledVideos[currentIndex];
  const previousVideo = shuffledVideos[getPreviousIndex()];
  const nextVideo = shuffledVideos[getNextIndex()];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4">
      {/* Conteneur principal avec les trois vidéos */}
      <div className="relative flex items-center gap-2 sm:gap-4">
        {/* Vidéo précédente (transparente) - cachée sur mobile */}
        {shuffledVideos.length > 1 && (
          <div 
            className="hidden md:block flex-shrink-0 w-1/4 opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
            onClick={goToPrevious}
            style={{ aspectRatio: '16/9' }}
            onMouseEnter={() => {
              const videoEl = videoRefs.current[`prev-${previousVideo.id}`];
              handleMouseEnter(previousVideo.id, videoEl);
            }}
            onMouseLeave={() => {
              const videoEl = videoRefs.current[`prev-${previousVideo.id}`];
              handleMouseLeave(previousVideo.id, videoEl);
            }}
          >
            <video
              ref={(el) => videoRefs.current[`prev-${previousVideo.id}`] = el}
              className="w-full h-full object-cover rounded-lg"
              src={previousVideo?.url || previousVideo?.src}
              poster={previousVideo?.thumbnail || previousVideo?.poster}
              muted
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        )}

        {/* Vidéo actuelle (centrée) */}
        <div className="flex-1 relative" style={{ aspectRatio: '16/9' }}>
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
            <video
              ref={(el) => videoRefs.current[`current-${currentVideo.id}`] = el}
              key={currentIndex}
              className="w-full h-full object-cover"
              controls
              autoPlay
              src={currentVideo?.url || currentVideo?.src}
              poster={currentVideo?.thumbnail || currentVideo?.poster}
              onMouseEnter={() => {
                const videoEl = videoRefs.current[`current-${currentVideo.id}`];
                handleMouseEnter(currentVideo.id, videoEl);
              }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>

            {/* Informations de la vidéo */}
            {currentVideo?.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
                <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg break-words">
                  {currentVideo.title}
                </h3>
                {currentVideo?.description && (
                  <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">
                    {currentVideo.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Flèche gauche */}
          {shuffledVideos.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-12 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-4 rounded-full shadow-lg transition-all z-10 hover:scale-110"
              aria-label="Vidéo précédente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Flèche droite */}
          {shuffledVideos.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-12 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-4 rounded-full shadow-lg transition-all z-10 hover:scale-110"
              aria-label="Vidéo suivante"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Vidéo suivante (transparente) - cachée sur mobile */}
        {shuffledVideos.length > 1 && (
          <div 
            className="hidden md:block flex-shrink-0 w-1/4 opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
            onClick={goToNext}
            style={{ aspectRatio: '16/9' }}
            onMouseEnter={() => {
              const videoEl = videoRefs.current[`next-${nextVideo.id}`];
              handleMouseEnter(nextVideo.id, videoEl);
            }}
            onMouseLeave={() => {
              const videoEl = videoRefs.current[`next-${nextVideo.id}`];
              handleMouseLeave(nextVideo.id, videoEl);
            }}
          >
            <video
              ref={(el) => videoRefs.current[`next-${nextVideo.id}`] = el}
              className="w-full h-full object-cover rounded-lg"
              src={nextVideo?.url || nextVideo?.src}
              poster={nextVideo?.thumbnail || nextVideo?.poster}
              muted
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default Carrousel;
