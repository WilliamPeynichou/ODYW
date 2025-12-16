import React, { useState } from 'react';
import VideoFileInput from './VideoFileInput';

const VideoForm = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!theme.trim()) {
      newErrors.theme = 'Le thème est requis';
    }

    if (!file) {
      newErrors.file = 'Veuillez sélectionner un fichier vidéo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Créer l'objet vidéo avec toutes les données
    const videoData = {
      title: title.trim(),
      theme: theme.trim(),
      file: file,
      createdAt: new Date().toISOString(),
      size: file.size // Taille du fichier en bytes
    };

    onSubmit(videoData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Champ Titre */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors({ ...errors, title: '' });
            }
          }}
          placeholder="Entrez le titre de la vidéo"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Champ Thème */}
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
          Thème <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="theme"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            if (errors.theme) {
              setErrors({ ...errors, theme: '' });
            }
          }}
          placeholder="Ex: Aventure, Nature, Voyage..."
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.theme ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.theme && (
          <p className="mt-1 text-sm text-red-600">{errors.theme}</p>
        )}
      </div>

      {/* Champ Fichier */}
      <VideoFileInput
        file={file}
        onChange={(selectedFile) => {
          setFile(selectedFile);
          if (errors.file) {
            setErrors({ ...errors, file: '' });
          }
        }}
        error={errors.file}
      />

      {/* Informations automatiques */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Informations automatiques
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Date de création :</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Taille du fichier :</span>
            <span className="ml-2 font-medium text-gray-900">
              {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Non sélectionné'}
            </span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            setTitle('');
            setTheme('');
            setFile(null);
            setErrors({});
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Réinitialiser
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter la vidéo
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VideoForm;

