import React, { useEffect, useMemo } from 'react';
import './searchBar.css';

function SearchBar({ videos, value = '', onSearchChange, placeholder = "Rechercher" }) {
  // Extraire les titres des vidéos pour les mots-clés
  const videoKeywords = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    const titles = videos
      .map(video => video.title || video.name)
      .filter(title => title && title.trim() !== '');
    // Retourner les titres uniques
    return [...new Set(titles)];
  }, [videos]);

  // Gestion du changement de recherche
  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    if (onSearchChange) {
      onSearchChange(keyword);
    }
  };

  // Gestion de la sélection d'une suggestion
  const handleSuggestionClick = (keyword) => {
    if (onSearchChange) {
      onSearchChange(keyword);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        value={value}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="search-bar-input"
      />
      {/* Suggestions de mots-clés basées sur les titres */}
      {value && videoKeywords.length > 0 && (
        <div className="search-bar-suggestions">
          <span className="search-bar-suggestions-label">Suggestions:</span>
          {videoKeywords
            .filter(keyword => 
              keyword.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 5)
            .map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(keyword)}
                className="search-bar-suggestion-item"
              >
                {keyword}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
