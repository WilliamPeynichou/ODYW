import React from 'react';

const Comment = ({ comment }) => {
  // Générer une URL d'avatar basée sur l'auteur ou utiliser une image par défaut
  const getAvatarUrl = () => {
    if (comment.avatar) return comment.avatar;
    // Utiliser une image par défaut ou générer une initiale
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author || 'User')}&background=random&size=128`;
  };

  return (
    <div className="chat chat-start mb-4">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt={`Avatar de ${comment.author || 'Utilisateur'}`}
            src={getAvatarUrl()}
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        <span className="font-semibold text-gray-900 mr-2">
          {comment.author || 'Utilisateur anonyme'}
        </span>
        {comment.createdAt && (
          <time className="text-xs opacity-50">
            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
        )}
      </div>
      <div className="chat-bubble bg-gray-200 text-gray-900">
        {comment.content}
      </div>
      {comment.likes !== undefined && (
        <div className="chat-footer mt-1">
          <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{comment.likes || 0}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
