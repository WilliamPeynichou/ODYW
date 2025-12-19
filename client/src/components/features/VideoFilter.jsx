import React, { useState, useEffect, useMemo } from 'react';
import { getAllThemes } from '../../service/themeService';
import SearchBar from './searchBar/searchBar';

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
      searchKeyword: searchKeyword || '',
    });
  };

  const handleDateChange = (e) => {
    onFilterChange({
      theme: selectedTheme,
      date: e.target.value,
      searchKeyword: searchKeyword || '',
    });
  };

  const handleSearchChange = (keyword) => {
    setLocalSearchKeyword(keyword);
    onFilterChange({
      theme: selectedTheme,
      date: selectedDateFilter,
      searchKeyword: keyword,
    });
  };

  // Synchroniser le mot-clé local avec la prop
  useEffect(() => {
    setLocalSearchKeyword(searchKeyword || '');
  }, [searchKeyword]);

  const handleReset = () => {
    onFilterChange({
      theme: null,
      date: 'all',
      searchKeyword: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-end gap-3 sm:gap-4">
        {/* Barre de recherche */}
        <div className="flex-1 md:flex-[2] w-full md:min-w-[200px]">
          <SearchBar
            videos={videos}
            value={localSearchKeyword}
            onSearchChange={handleSearchChange}
            placeholder="Rechercher"
          />
        </div>

        {/* Filtre par thème */}
        <div className="flex-1 md:flex-initial w-full md:min-w-[150px] lg:min-w-[200px]">
          <label htmlFor="theme-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Thème
          </label>
          {loadingThemes ? (
            <div className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-600"></div>
              <span className="text-gray-500 text-xs sm:text-sm">Chargement...</span>
            </div>
          ) : (
            <select
              id="theme-filter"
              value={selectedTheme || 'all'}
              onChange={handleThemeChange}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
        <div className="flex-1 md:flex-initial w-full md:min-w-[150px] lg:min-w-[200px]">
          <label htmlFor="date-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Date
          </label>
          <select
            id="date-filter"
            value={selectedDateFilter || 'all'}
            onChange={handleDateChange}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4"
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
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        )}
      </div>

      {/* Indicateur de filtres actifs */}
      {(selectedTheme || (selectedDateFilter && selectedDateFilter !== 'all') || localSearchKeyword) && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Filtres actifs :</span>
            {localSearchKeyword && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm">
                Recherche: <span className="max-w-[100px] sm:max-w-none truncate">{localSearchKeyword}</span>
                <button
                  onClick={() => {
                    onFilterChange({
                      theme: selectedTheme,
                      date: selectedDateFilter,
                      searchKeyword: '',
                    });
                  }}
                  className="hover:text-purple-900 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTheme && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                Thème: <span className="max-w-[80px] sm:max-w-none truncate">{selectedTheme}</span>
                <button
                  onClick={() => handleThemeChange({ target: { value: 'all' } })}
                  className="hover:text-blue-900 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {selectedDateFilter && selectedDateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                <span className="max-w-[100px] sm:max-w-none truncate">{dateFilterOptions.find(opt => opt.value === selectedDateFilter)?.label}</span>
                <button
                  onClick={() => handleDateChange({ target: { value: 'all' } })}
                  className="hover:text-green-900 ml-1"
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

