import React, { useState, useEffect } from 'react';

const Carrousel = ({ videos = [] }) => {
  // Images de test par défaut si aucune vidéo n'est fournie
  const defaultImages = [
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      title: 'Montagne',
      type: 'image'
    },
    {
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
      title: 'Océan',
      type: 'image'
    },
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      title: 'Plage',
      type: 'image'
    },
    {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      title: 'Forêt',
      type: 'image'
    },
    {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      title: 'Paysage',
      type: 'image'
    }
  ];

  const items = videos.length > 0 ? videos : defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Navigation vers l'élément précédent
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };

  // Navigation vers l'élément suivant
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false);
  };

  // Aller à un élément spécifique
  const goToItem = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  // Calculer les index précédent et suivant
  const getPreviousIndex = () => 
    currentIndex === 0 ? items.length - 1 : currentIndex - 1;
  
  const getNextIndex = () => 
    currentIndex === items.length - 1 ? 0 : currentIndex + 1;

  // Réinitialiser l'index si les éléments changent
  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Aucun contenu disponible</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const previousItem = items[getPreviousIndex()];
  const nextItem = items[getNextIndex()];
  const isVideo = currentItem?.type === 'video' || currentItem?.url?.includes('.mp4') || currentItem?.src?.includes('.mp4');

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Conteneur principal avec les trois éléments */}
      <div className="relative flex items-center gap-4">
        {/* Élément précédent (transparent) */}
        {items.length > 1 && (
          <div 
            className="flex-shrink-0 w-1/4 opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
            onClick={goToPrevious}
            style={{ aspectRatio: '16/9' }}
          >
            {previousItem?.type === 'video' || previousItem?.url?.includes('.mp4') ? (
              <video
                className="w-full h-full object-cover rounded-lg"
                src={previousItem?.url || previousItem?.src}
                poster={previousItem?.thumbnail || previousItem?.poster}
                muted
              />
            ) : (
              <img
                className="w-full h-full object-cover rounded-lg"
                src={previousItem?.url || previousItem?.thumbnail || previousItem?.src}
                alt={previousItem?.title || 'Précédent'}
              />
            )}
          </div>
        )}

        {/* Élément actuel (centré) */}
        <div className="flex-1 relative" style={{ aspectRatio: '16/9' }}>
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
            {isVideo ? (
              <video
                key={currentIndex}
                className="w-full h-full object-cover"
                controls
                autoPlay={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                src={currentItem?.url || currentItem?.src}
                poster={currentItem?.thumbnail || currentItem?.poster}
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            ) : (
              <img
                key={currentIndex}
                className="w-full h-full object-cover"
                src={currentItem?.url || currentItem?.thumbnail || currentItem?.src}
                alt={currentItem?.title || 'Image actuelle'}
              />
            )}

            {/* Informations de l'élément (optionnel) */}
            {currentItem?.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">
                  {currentItem.title}
                </h3>
                {currentItem?.description && (
                  <p className="text-white/80 text-sm mt-1">
                    {currentItem.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Flèche gauche (grande et cliquable) */}
          {items.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-lg transition-all z-10 hover:scale-110"
              aria-label="Élément précédent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

          {/* Flèche droite (grande et cliquable) */}
          {items.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-lg transition-all z-10 hover:scale-110"
              aria-label="Élément suivant"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

        {/* Élément suivant (transparent) */}
        {items.length > 1 && (
          <div 
            className="flex-shrink-0 w-1/4 opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
            onClick={goToNext}
            style={{ aspectRatio: '16/9' }}
          >
            {nextItem?.type === 'video' || nextItem?.url?.includes('.mp4') ? (
              <video
                className="w-full h-full object-cover rounded-lg"
                src={nextItem?.url || nextItem?.src}
                poster={nextItem?.thumbnail || nextItem?.poster}
                muted
              />
            ) : (
              <img
                className="w-full h-full object-cover rounded-lg"
                src={nextItem?.url || nextItem?.thumbnail || nextItem?.src}
                alt={nextItem?.title || 'Suivant'}
              />
            )}
          </div>
        )}
      </div>

      {/* Indicateurs de position */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToItem(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Aller à l'élément ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Compteur */}
      {items.length > 1 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
};

export default Carrousel;
