import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddVideoButton from './button/addVideoButton';
import LoginButton from './button/loginButton';
import ProfileButton from './button/profileButton';
import AdminButton from './button/adminButton';
import SuperAdminButton from './button/superAdminButton';
import { getCurrentUser, getAuthToken } from '../utils/authUtils';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoleId, setUserRoleId] = useState(null);

  useEffect(() => {
    // Vérifier l'état de connexion au montage et lors des changements
    const checkAuth = () => {
      const user = getCurrentUser();
      const token = getAuthToken();
      setIsLoggedIn(!!(user && token));
      // Vérifier le role_id de l'utilisateur
      if (user && user.role_id) {
        setUserRoleId(user.role_id);
      } else {
        setUserRoleId(null);
      }
    };

    checkAuth();

    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement (pour les changements dans le même onglet)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex w-full items-center justify-between bg-white px-2 sm:px-4 py-2 sm:py-3">
      <div className="flex items-center">
        <a href="/" className="text-lg sm:text-xl font-normal text-gray-900">
          ODYWP
        </a>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {isLoggedIn ? <ProfileButton /> : <LoginButton />}
        {userRoleId === 3 && <SuperAdminButton />}
        {userRoleId === 2 && <AdminButton />}
        <AddVideoButton />
      </div>
    </header>
  );
};

export default Header;
