import React, { useRef, useState } from 'react';

const VideoFileInput = ({ file, onChange, error, required = true, label = 'Vidéo' }) => {
  const fileInputRef = useRef(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const ACCEPTED_FORMATS = ['.mp4', '.avi', '.mov'];
  const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45 MB
  const MIN_DURATION = 10; // secondes
  const MAX_DURATION = 60; // secondes

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Impossible de lire la vidéo'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      onChange(null);
      setValidationError('');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    // Vérifier le format
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      const errorMsg = `Format non accepté. Formats acceptés : ${ACCEPTED_FORMATS.join(', ')}`;
      alert(errorMsg);
      setValidationError(errorMsg);
      e.target.value = '';
      onChange(null);
      setIsValidating(false);
      return;
    }

    // Vérifier la taille
    if (selectedFile.size > MAX_FILE_SIZE) {
      const errorMsg = `Fichier trop volumineux. Taille maximale : ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)} MB`;
      alert(errorMsg);
      setValidationError(errorMsg);
      e.target.value = '';
      onChange(null);
      setIsValidating(false);
      return;
    }

    // Vérifier la durée
    try {
      const duration = await getVideoDuration(selectedFile);
      
      if (duration < MIN_DURATION || duration > MAX_DURATION) {
        const errorMsg = `Durée invalide. La vidéo doit durer entre ${MIN_DURATION} et ${MAX_DURATION} secondes (durée actuelle : ${duration.toFixed(1)}s)`;
        alert(errorMsg);
        setValidationError(errorMsg);
        e.target.value = '';
        onChange(null);
        setIsValidating(false);
        return;
      }

      // Tout est valide
      onChange(selectedFile);
      setValidationError('');
    } catch (err) {
      const errorMsg = 'Erreur lors de la lecture de la vidéo. Veuillez vérifier que le fichier est valide.';
      alert(errorMsg);
      setValidationError(errorMsg);
      e.target.value = '';
      onChange(null);
    } finally {
      setIsValidating(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="mt-1">
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,.avi,.mov"
            onChange={handleFileChange}
            className="hidden"
            id="video-file-input"
          />
          <label
            htmlFor="video-file-input"
            className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isValidating ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {file ? 'Changer le fichier' : 'Sélectionner un fichier'}
          </label>
          
          {file && !isValidating && (
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{file.name}</span>
                <span className="text-gray-400">•</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          )}
        </div>
        
        <p className="mt-2 text-xs text-gray-500">
          Formats acceptés : MP4, AVI, MOV (max. 45 MB, durée : 10-60 secondes)
        </p>
        
        {isValidating && (
          <p className="mt-1 text-sm text-blue-600">
            Validation de la vidéo en cours...
          </p>
        )}
        
        {(error || validationError) && (
          <p className="mt-1 text-sm text-red-600">{error || validationError}</p>
        )}
      </div>
    </div>
  );
};

export default VideoFileInput;

