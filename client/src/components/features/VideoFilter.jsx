import React, { useState, useEffect, useMemo } from 'react';
import { getAllThemes } from '../../service/themeService';

const VideoFilter = ({ videos, onFilterChange, selectedTheme, selectedDateFilter, searchKeyword }) => {
  const [themes, setThemes] = useState([]);
  const [loadingThemes, setLoadingThemes] = useState(true);
  const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword || '');

  // Charger les thèmes depuis l'API
  useEffect(() => {
    const loadThemes = async () => {
      try {
        setLoadingThemes(true);
        const themesData = await getAllThemes();
        setThemes(themesData);
      } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
      } finally {
        setLoadingThemes(false);
      }
    };

    loadThemes();
  }, []);

  // Extraire les titres des vidéos pour les mots-clés
  const videoKeywords = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    const titles = videos
      .map(video => video.title || video.name)
      .filter(title => title && title.trim() !== '');
    // Retourner les titres uniques
    return [...new Set(titles)];
  }, [videos]);

  // Synchroniser le mot-clé local avec la prop
  useEffect(() => {
    setLocalSearchKeyword(searchKeyword || '');
  }, [searchKeyword]);

  // Options de filtrage par date
  const dateFilterOptions = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'recent', label: 'Plus récentes' },
    { value: 'oldest', label: 'Plus anciennes' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
  ];

  const handleThemeChange = (e) => {
    onFilterChange({
      theme: e.target.value === 'all' ? null : e.target.value,
      date: selectedDateFilter,
      searchKeyword: localSearchKeyword,
    });
  };

  const handleDateChange = (e) => {
    onFilterChange({
      theme: selectedTheme,
      date: e.target.value,
      searchKeyword: localSearchKeyword,
    });
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setLocalSearchKeyword(keyword);
    onFilterChange({
      theme: selectedTheme,
      date: selectedDateFilter,
      searchKeyword: keyword,
    });
  };

  const handleReset = () => {
    setLocalSearchKeyword('');
    onFilterChange({
      theme: null,
      date: 'all',
      searchKeyword: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Filtrer les vidéos</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-1 md:justify-end">
          {/* Barre de recherche */}
          <div className="flex-1 sm:flex-initial min-w-[250px]">
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher par mot-clé
            </label>
            <div className="relative">
              <input
                id="search-filter"
                type="text"
                value={localSearchKeyword}
                onChange={handleSearchChange}
                placeholder="Rechercher dans les titres..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {/* Suggestions de mots-clés basées sur les titres */}
            {localSearchKeyword && videoKeywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Suggestions:</span>
                {videoKeywords
                  .filter(keyword => 
                    keyword.toLowerCase().includes(localSearchKeyword.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLocalSearchKeyword(keyword);
                        onFilterChange({
                          theme: selectedTheme,
                          date: selectedDateFilter,
                          searchKeyword: keyword,
                        });
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Filtre par thème */}
          <div className="flex-1 sm:flex-initial min-w-[200px]">
            <label htmlFor="theme-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Thème
            </label>
            {loadingThemes ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-gray-500 text-sm">Chargement...</span>
              </div>
            ) : (
              <select
                id="theme-filter"
                value={selectedTheme || 'all'}
                onChange={handleThemeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tous les thèmes</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.name}>
                    {theme.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Filtre par date */}
          <div className="flex-1 sm:flex-initial min-w-[200px]">
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <select
              id="date-filter"
              value={selectedDateFilter || 'all'}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {dateFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton réinitialiser */}
          {(selectedTheme || (selectedDateFilter && selectedDateFilter !== 'all') || localSearchKeyword) && (
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicateur de filtres actifs */}
      {(selectedTheme || (selectedDateFilter && selectedDateFilter !== 'all') || localSearchKeyword) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Filtres actifs :</span>
            {localSearchKeyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Recherche: {localSearchKeyword}
                <button
                  onClick={() => {
                    setLocalSearchKeyword('');
                    onFilterChange({
                      theme: selectedTheme,
                      date: selectedDateFilter,
                      searchKeyword: '',
                    });
                  }}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTheme && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Thème: {selectedTheme}
                <button
                  onClick={() => handleThemeChange({ target: { value: 'all' } })}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedDateFilter && selectedDateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {dateFilterOptions.find(opt => opt.value === selectedDateFilter)?.label}
                <button
                  onClick={() => handleDateChange({ target: { value: 'all' } })}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFilter;

