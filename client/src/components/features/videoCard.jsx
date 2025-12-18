import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVideos } from '../../service/videoService';
import VideoFilter from './VideoFilter';
import negativeVideo from '../../assets/Negative-mask-effect.mp4';

// Composant pour une carte vidéo individuelle
const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const negativeVideoRef = useRef(null);

  const handleVideoClick = () => {
    navigate(`/video/${video.id}`);
  };

  const handleMouseEnter = () => {
    if (negativeVideoRef.current) {
      negativeVideoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (negativeVideoRef.current) {
      negativeVideoRef.current.pause();
      negativeVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vidéo cliquable */}
      <div 
        className="relative w-full bg-black" 
        style={{ aspectRatio: '16/9' }}
        onClick={handleVideoClick}
      >
        {/* Vidéo negative en arrière-plan fixe */}
        <video
          ref={negativeVideoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src={negativeVideo}
          muted
          loop
          playsInline
        />

        {/* Vidéo principale */}
        {video.url || video.src ? (
          <video
            className="relative w-full h-full object-cover z-10"
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
          <div className="relative w-full h-full flex items-center justify-center bg-gray-200 z-10">
            <p className="text-gray-400">Aucune vidéo</p>
          </div>
        )}
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center z-20">
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
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

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

      // Trier par date décroissante par défaut (plus récentes en premier)
      mappedVideos.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
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

  // Fonction de filtrage des vidéos
  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    // Filtre par mot-clé (recherche dans les titres)
    if (searchKeyword && searchKeyword.trim() !== '') {
      const keyword = searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(video => {
        const title = (video.title || video.name || '').toLowerCase();
        return title.includes(keyword);
      });
    }

    // Filtre par thème
    if (selectedTheme) {
      filtered = filtered.filter(video => video.theme_name === selectedTheme);
    }

    // Filtre par date
    if (selectedDateFilter && selectedDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      filtered = filtered.filter(video => {
        if (!video.createdAt) return false;
        const videoDate = new Date(video.createdAt);

        switch (selectedDateFilter) {
          case 'recent':
            // Plus récentes en premier (déjà trié par date DESC dans l'API)
            return true;
          case 'oldest':
            // Plus anciennes en premier (on va inverser le tri)
            return true;
          case 'today':
            return videoDate >= today;
          case 'week':
            return videoDate >= weekAgo;
          case 'month':
            return videoDate >= monthAgo;
          default:
            return true;
        }
      });

      // Trier selon le filtre de date
      if (selectedDateFilter === 'oldest') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA - dateB; // Plus anciennes en premier
        });
      } else if (selectedDateFilter === 'recent') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA; // Plus récentes en premier
        });
      }
    }

    return filtered;
  }, [videos, selectedTheme, selectedDateFilter, searchKeyword]);

  // Gérer les changements de filtres
  const handleFilterChange = ({ theme, date, searchKeyword: keyword }) => {
    setSelectedTheme(theme);
    setSelectedDateFilter(date);
    setSearchKeyword(keyword || '');
  };

  const negativeVideoHeaderRef = useRef(null);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8" id="videos">
      <div className="mb-8 relative">
        {/* Vidéo negative à la place du titre */}
        <div 
          className="relative w-full h-32 md:h-48 lg:h-64 overflow-hidden rounded-lg"
          onMouseEnter={() => {
            if (negativeVideoHeaderRef.current) {
              negativeVideoHeaderRef.current.play();
            }
          }}
          onMouseLeave={() => {
            if (negativeVideoHeaderRef.current) {
              negativeVideoHeaderRef.current.pause();
              negativeVideoHeaderRef.current.currentTime = 0;
            }
          }}
        >
          <video
            ref={negativeVideoHeaderRef}
            className="w-full h-full object-cover"
            src={negativeVideo}
            muted
            loop
            playsInline
          />
        </div>
        <p className="text-gray-600 mt-4">
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
            <>
              {/* Composant de filtre */}
              <VideoFilter
                videos={videos}
                onFilterChange={handleFilterChange}
                selectedTheme={selectedTheme}
                selectedDateFilter={selectedDateFilter}
                searchKeyword={searchKeyword}
              />

              {/* Compteur de résultats */}
              <div className="mb-4 text-sm text-gray-600">
                {filteredVideos.length === videos.length ? (
                  <span>{videos.length} vidéo{videos.length > 1 ? 's' : ''} disponible{videos.length > 1 ? 's' : ''}</span>
                ) : (
                  <span>
                    {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''} sur {videos.length}
                  </span>
                )}
              </div>

              {/* Grille des vidéos filtrées */}
              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg mb-2">
                    Aucune vidéo ne correspond aux filtres sélectionnés
                  </p>
                  <p className="text-gray-400 text-sm">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </>
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

