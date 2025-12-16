import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/header';
import VideoForm from './VideoForm';

const AddVideo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (videoData) => {
    setIsSubmitting(true);
    try {
      // TODO: Remplacer par votre endpoint API
      // const formData = new FormData();
      // formData.append('title', videoData.title);
      // formData.append('theme', videoData.theme);
      // formData.append('file', videoData.file);
      // formData.append('createdAt', videoData.createdAt);
      // formData.append('size', videoData.size);
      // 
      // const response = await fetch('/api/videos', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Erreur lors de l\'ajout de la vidéo');
      // }
      // 
      // const result = await response.json();
      // navigate(`/video/${result.id}`);

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Données de la vidéo:', videoData);
      alert('Vidéo ajoutée avec succès ! (Simulation)');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vidéo:', error);
      alert('Erreur lors de l\'ajout de la vidéo. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
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
            Retour à l'accueil
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Ajouter une vidéo
          </h1>
          <p className="text-gray-600 mt-2">
            Partagez votre vidéo avec la communauté
          </p>
        </div>

        {/* Formulaire */}
        <VideoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default AddVideo;

