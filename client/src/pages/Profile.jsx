import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { getProfile } from '../service/authService';
import { getCurrentUser, logout } from '../utils/authUtils';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Vérifier d'abord si l'utilisateur est connecté localement
        const localUser = getCurrentUser();
        if (!localUser) {
          navigate('/login');
          return;
        }

        // Charger les données du profil depuis l'API
        const profileData = await getProfile();
        setUser(profileData.user || profileData);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement du profil');
        // Si le token est invalide, rediriger vers la page de connexion
        if (err.message.includes('Token') || err.message.includes('authentification')) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-800 mb-2">Erreur</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>

          {/* Carte du profil */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.username || user?.name || 'Utilisateur'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              {user?.role && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'admin' || user.role === 'superAdmin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'superAdmin' ? 'Super Admin' : 
                   user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                </span>
              )}
            </div>

            {/* Informations détaillées */}
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Informations personnelles</h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.username || 'Non défini'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.email || 'Non défini'}</dd>
                  </div>
                  {user?.id && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">ID Utilisateur</dt>
                      <dd className="mt-1 text-sm text-gray-900">#{user.id}</dd>
                    </div>
                  )}
                  {user?.created_at && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Membre depuis</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour à l'accueil
              </button>
              {user?.role === 'admin' || user?.role === 'superAdmin' ? (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Panneau d'administration
                </button>
              ) : null}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

