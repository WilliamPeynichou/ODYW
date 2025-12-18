import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/header';
import Footer from '../../layout/footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import ContentManagement from './components/ContentManagement';
import { getCurrentUser, isSuperAdmin, logout } from '../../utils/authUtils';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('users');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role_id !== 3) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* En-tête du dashboard */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Panneau SuperAdmin</h1>
                  <p className="text-gray-600 mt-2">
                    Connecté en tant que <span className="font-semibold">{currentUser.username}</span>{' '}
                    (SuperAdmin)
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </div>

              {/* Indicateur de rôle */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-purple-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-purple-800 font-medium">
                    Mode SuperAdmin : Accès complet à toutes les fonctionnalités
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation par sections */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveSection('users')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeSection === 'users'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Gestion des utilisateurs
                  </button>
                  <button
                    onClick={() => setActiveSection('content')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeSection === 'content'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Gestion du contenu
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenu selon la section active */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeSection === 'users' && <UserManagement isSuperAdmin={true} />}
              {activeSection === 'content' && <ContentManagement />}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SuperAdminDashboard;

