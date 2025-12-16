import React, { useEffect, useState } from 'react';
import './comment.css';

const Comment = ({ comment, index = 0, isDarkMode = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'apparition avec délai
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  // Générer l'initiale pour l'avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Maintenant';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Maintenant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const authorName = comment.author || 'Utilisateur anonyme';
  const initials = getInitials(authorName);

  return (
    <li className="comment-item">
      <div className="notification-container">
        <div className={`notification ${isDarkMode ? 'dark-mode' : ''}`}>
          {/* En-tête avec avatar */}
          <header>
            <div className="avatar">{initials}</div>
            <div className="header-content">
              <h2>{authorName}</h2>
              <span className="timestamp">{formatDate(comment.createdAt)}</span>
            </div>
          </header>

          {/* Contenu */}
          <div className="content">
            <span className="message">{comment.content}</span>
            {comment.likes !== undefined && comment.likes > 0 && (
              <span className="more">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {comment.likes} like{comment.likes > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

// Composant pour afficher une liste de commentaires style notifications Google
export const CommentList = ({ comments = [], autoDarkMode = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'apparition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Activer le mode sombre après l'animation initiale si activé
    if (autoDarkMode) {
      const darkModeTimer = setTimeout(() => {
        setIsDarkMode(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        clearTimeout(darkModeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [autoDarkMode]);

  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="comment-notification-wrapper">
      {/* Liste de commentaires - Tous affichés pour permettre le scroll */}
      <ul className={`comment-list ${isVisible ? 'visible animate-in' : ''}`}>
        {comments.map((comment, index) => (
          <Comment
            key={comment.id || index}
            comment={comment}
            index={index}
            isDarkMode={isDarkMode}
          />
        ))}
      </ul>
    </div>
  );
};

export default Comment;
