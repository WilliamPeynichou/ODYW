import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVideos } from '../../service/videoService';

// Composant pour une carte vidéo individuelle
const VideoCard = ({ video }) => {
  const navigate = useNavigate();

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

        {/* Date */}
        {video.createdAt && (
          <div className="flex items-center justify-end">
            <span className="text-xs text-gray-500">
              {new Date(video.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}
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
      
      // Récupérer toutes les vidéos depuis l'API
      const videosData = await getAllVideos();
      
      // Mapper les données de l'API vers le format attendu par le composant
      const mappedVideos = videosData.map(video => ({
        id: video.id,
        title: video.title,
        url: video.video_url ? `http://localhost:3000/${video.video_url}` : null,
        thumbnail: null, // Pas de thumbnail pour l'instant
        createdAt: video.created_at || video.createdAt,
        theme_name: video.theme_name,
        duration: video.duration,
        size_mb: video.size_mb,
      }));
      
      setVideos(mappedVideos);
    } catch (err) {
      setError('Erreur lors du chargement des vidéos');
      console.error(err);
    } finally {
      setLoading(false);
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

