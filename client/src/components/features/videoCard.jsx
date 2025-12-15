import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant pour une carte vidéo individuelle
const VideoCard = ({ video, onLike }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);

  const handleLike = (e) => {
    e.stopPropagation(); // Empêche le clic sur la vidéo
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Appel de la fonction callback pour notifier le parent
    if (onLike) {
      onLike(video.id, newLikedState);
    }
  };

  const handleVideoClick = () => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {/* Vidéo cliquable */}
      <div 
        className="relative w-full bg-black" 
        style={{ aspectRatio: '16/9' }}
        onClick={handleVideoClick}
      >
        {video.url || video.src ? (
          <video
            className="w-full h-full object-cover"
            src={video.url || video.src}
            poster={video.thumbnail || video.poster}
            muted
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-400">Aucune vidéo</p>
          </div>
        )}
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-white opacity-0 hover:opacity-100 transition-opacity"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-4">
        {/* Titre */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {video.title || video.name || 'Sans titre'}
        </h3>

        {/* Informations supplémentaires */}
        <div className="flex items-center justify-between">
          {/* Nombre de likes */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
              aria-label={isLiked ? 'Retirer le like' : 'Ajouter un like'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">{likesCount}</span>
            </button>
          </div>

          {/* Date ou autres infos */}
          {video.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(video.createdAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant principal pour la liste de vidéos
const ProductList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger les vidéos depuis l'API
  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Remplacer par votre endpoint API
      // const response = await fetch('/api/videos');
      // const data = await response.json();
      // setVideos(data);
      
      // Données fictives pour tester
      const mockVideos = [
        {
          id: 1,
          title: 'Aventure en montagne',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          likes: 245,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Plage paradisiaque',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          likes: 189,
          createdAt: '2024-01-20T14:15:00Z'
        },
        {
          id: 3,
          title: 'Forêt mystérieuse',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          likes: 312,
          createdAt: '2024-01-25T09:00:00Z'
        },
        {
          id: 4,
          title: 'Coucher de soleil',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          likes: 567,
          createdAt: '2024-02-01T18:45:00Z'
        },
        {
          id: 5,
          title: 'Voyage en ville',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
          likes: 423,
          createdAt: '2024-02-05T12:20:00Z'
        },
        {
          id: 6,
          title: 'Nature sauvage',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
          likes: 298,
          createdAt: '2024-02-10T16:30:00Z'
        },
        {
          id: 7,
          title: 'Océan infini',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          likes: 734,
          createdAt: '2024-02-15T11:10:00Z'
        },
        {
          id: 8,
          title: 'Paysage montagneux',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          likes: 156,
          createdAt: '2024-02-20T13:25:00Z'
        }
      ];
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      setVideos(mockVideos);
    } catch (err) {
      setError('Erreur lors du chargement des vidéos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le like d'une vidéo
  const handleLike = async (videoId, isLiked) => {
    try {
      // TODO: Appel API pour liker/unliker
      // await fetch(`/api/videos/${videoId}/like`, {
      //   method: isLiked ? 'POST' : 'DELETE',
      // });
      
      console.log(`Vidéo ${videoId} ${isLiked ? 'likée' : 'unlikée'}`);
    } catch (err) {
      console.error('Erreur lors du like:', err);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8" id="videos">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos Vidéos</h2>
        <p className="text-gray-600">
          Découvrez notre sélection de vidéos
        </p>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Chargement des vidéos...</p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadVideos}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Liste des vidéos */}
      {!loading && !error && (
        <>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onLike={handleLike}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Aucune vidéo disponible pour le moment
              </p>
              <p className="text-gray-400 text-sm">
                Les vidéos seront chargées depuis l'API backend
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductList;

