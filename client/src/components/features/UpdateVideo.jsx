import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../layout/header';
import Footer from '../../layout/footer';
import VideoForm from './VideoForm';
import { getVideoById, updateVideo } from '../../service/videoService';

const UpdateVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);

  // Charger les données de la vidéo à modifier
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        const video = await getVideoById(id);
        setVideoData(video);
      } catch (err) {
        setError('Erreur lors du chargement de la vidéo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Préparer les données pour la mise à jour
      const updateData = new FormData();
      
      // Si un nouveau fichier est fourni, l'ajouter
      if (formData.file) {
        updateData.append('video', formData.file);
      }
      
      // Ajouter le titre
      updateData.append('title', formData.title);
      
      // Convertir theme en theme_id
      const themeId = formData.theme && !isNaN(parseInt(formData.theme)) 
        ? parseInt(formData.theme) 
        : null;
      
      if (themeId !== null) {
        updateData.append('theme_id', themeId.toString());
      }

      // Mettre à jour la vidéo via l'API
      await updateVideo(id, updateData);
      
      // Rediriger vers la page de détails de la vidéo après succès
      navigate(`/video/${id}`);
    } catch (error) {
      console.error('Erreur lors de la modification de la vidéo:', error);
      alert(`Erreur lors de la modification de la vidéo: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-red-600 mb-4">{error || 'Vidéo non trouvée'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/video/${id}`)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            Retour à la vidéo
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier la vidéo
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre vidéo
          </p>
        </div>

        {/* Formulaire */}
        <VideoForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          initialData={videoData}
          isUpdate={true}
        />
      </div>
      <Footer />
    </div>
  );
};

export default UpdateVideo;

