import React, { useEffect, useRef, useState } from 'react';
import './comment.css';

const Comment = ({ comment, index = 0, isDarkMode = false }) => {
  const notificationRef = useRef(null);
  const beforeBgRef = useRef(null);
  const afterBgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Calculer la position pour l'effet parallaxe
    const updatePosition = () => {
      if (notificationRef.current && beforeBgRef.current && afterBgRef.current) {
        const rect = notificationRef.current.getBoundingClientRect();
        const top = rect.top;
        beforeBgRef.current.style.top = `-${top}px`;
        afterBgRef.current.style.top = `-${top}px`;
      }
    };

    // Initialiser la position
    updatePosition();

    // Mettre à jour au redimensionnement
    const handleResize = () => {
      setTimeout(updatePosition, 250);
    };

    window.addEventListener('resize', handleResize);

    // Animation d'apparition avec délai
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [index]);

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

  return (
    <li className={`comment-item ${index === 0 ? 'one' : index === 1 ? 'two' : 'three'}`}>
      <div className="notification-container">
        <div 
          ref={notificationRef}
          className={`notification ${isDarkMode ? 'dark-mode' : ''}`}
        >
          {/* Arrière-plans pour effet parallaxe */}
          <span ref={beforeBgRef} className="notification-bg-before"></span>
          <span ref={afterBgRef} className="notification-bg-after"></span>

          {/* En-tête */}
          <header>
            <h2>Commentaire</h2>
            <span className="timestamp">{formatDate(comment.createdAt)}</span>
          </header>

          {/* Contenu */}
          <div className="content">
            <span className="sender">{comment.author || 'Utilisateur anonyme'}</span>
            <span className="message">{comment.content}</span>
            {comment.likes !== undefined && comment.likes > 0 && (
              <span className="more">{comment.likes} like{comment.likes > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

// Composant pour afficher une liste de commentaires avec l'effet empilé
export const CommentList = ({ comments = [], maxVisible = 3, autoDarkMode = true }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef(null);

  // Limiter le nombre de commentaires visibles
  const visibleComments = comments.slice(0, maxVisible);

  useEffect(() => {
    // Animation d'apparition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Activer le mode sombre après l'animation initiale
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

  if (visibleComments.length === 0) {
    return null;
  }

  return (
    <div className="comment-notification-wrapper" ref={wrapperRef}>
      {/* Arrière-plans globaux */}
      <span className="comment-bg-before" style={{ opacity: isDarkMode ? 1 : 0 }}></span>
      <span className="comment-bg-after" style={{ opacity: isDarkMode ? 0 : 1 }}></span>

      {/* Liste de commentaires */}
      <ul className={`comment-list ${isVisible ? 'visible animate-in' : ''}`}>
        {visibleComments.map((comment, index) => (
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
