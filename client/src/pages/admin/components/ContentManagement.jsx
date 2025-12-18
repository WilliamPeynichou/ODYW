import React, { useState, useEffect } from 'react';
import {
  getAllVideosAdmin,
  deleteVideoAdmin,
  getAllThemesAdmin,
  createThemeAdmin,
  updateThemeAdmin,
  deleteThemeAdmin,
} from '../../../service/adminService';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [themeFormData, setThemeFormData] = useState({ name: '' });

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'videos') {
        // TODO: Une fois l'endpoint prêt, décommenter cette ligne
        // const videosData = await getAllVideosAdmin();
        
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 500));
        const videosData = [
          { id: 1, title: 'Vidéo 1', createdAt: '2024-01-01', theme_name: 'Thème 1' },
          { id: 2, title: 'Vidéo 2', createdAt: '2024-01-02', theme_name: 'Thème 2' },
        ];
        setVideos(videosData);
      } else {
        // TODO: Une fois l'endpoint prêt, décommenter cette ligne
        // const themesData = await getAllThemesAdmin();
        
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 500));
        const themesData = [
          { id: 1, name: 'Thème 1', createdAt: '2024-01-01' },
          { id: 2, name: 'Thème 2', createdAt: '2024-01-02' },
        ];
        setThemes(themesData);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      return;
    }

    try {
      setError('');
      // TODO: Une fois l'endpoint prêt, décommenter cette ligne
      // await deleteVideoAdmin(videoId);
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVideos(videos.filter(v => v.id !== videoId));
      alert('Vidéo supprimée avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleOpenThemeModal = (theme = null) => {
    if (theme) {
      setEditingTheme(theme);
      setThemeFormData({ name: theme.name });
    } else {
      setEditingTheme(null);
      setThemeFormData({ name: '' });
    }
    setShowThemeModal(true);
  };

  const handleSaveTheme = async () => {
    if (!themeFormData.name.trim()) {
      setError('Le nom du thème est requis');
      return;
    }

    try {
      setError('');
      if (editingTheme) {
        // TODO: Une fois l'endpoint prêt, décommenter cette ligne
        // await updateThemeAdmin(editingTheme.id, themeFormData);
        
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 500));
        setThemes(themes.map(t => t.id === editingTheme.id ? { ...t, ...themeFormData } : t));
      } else {
        // TODO: Une fois l'endpoint prêt, décommenter cette ligne
        // const newTheme = await createThemeAdmin(themeFormData);
        
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 500));
        const newTheme = { id: themes.length + 1, ...themeFormData, createdAt: new Date().toISOString() };
        setThemes([...themes, newTheme]);
      }
      setShowThemeModal(false);
      setEditingTheme(null);
      setThemeFormData({ name: '' });
      alert(`Thème ${editingTheme ? 'modifié' : 'créé'} avec succès`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteTheme = async (themeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
      return;
    }

    try {
      setError('');
      // TODO: Une fois l'endpoint prêt, décommenter cette ligne
      // await deleteThemeAdmin(themeId);
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setThemes(themes.filter(t => t.id !== themeId));
      alert('Thème supprimé avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion du contenu</h2>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'videos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vidéos
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'themes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thèmes
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Gestion des vidéos */}
          {activeTab === 'videos' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Liste des vidéos</h3>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thème
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {videos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        Aucune vidéo trouvée
                      </td>
                    </tr>
                  ) : (
                    videos.map((video) => (
                      <tr key={video.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {video.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.theme_name || 'Sans thème'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Gestion des thèmes */}
          {activeTab === 'themes' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Liste des thèmes</h3>
                <button
                  onClick={() => handleOpenThemeModal()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Ajouter un thème
                </button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {themes.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        Aucun thème trouvé
                      </td>
                    </tr>
                  ) : (
                    themes.map((theme) => (
                      <tr key={theme.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {theme.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(theme.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenThemeModal(theme)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteTheme(theme.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal pour créer/modifier un thème */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {editingTheme ? 'Modifier le thème' : 'Créer un nouveau thème'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du thème <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={themeFormData.name}
                  onChange={(e) => setThemeFormData({ name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du thème"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowThemeModal(false);
                  setEditingTheme(null);
                  setThemeFormData({ name: '' });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTheme}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {editingTheme ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;

