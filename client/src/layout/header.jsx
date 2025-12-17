import React, { useState, useEffect } from 'react';
import AddVideoButton from './button/addVideoButton';
import LoginButton from './button/loginButton';
import ProfileButton from './button/profileButton';
import { getCurrentUser, getAuthToken } from '../utils/authUtils';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier l'état de connexion au montage et lors des changements
    const checkAuth = () => {
      const user = getCurrentUser();
      const token = getAuthToken();
      setIsLoggedIn(!!(user && token));
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
    <header className="flex w-full items-center justify-between bg-white px-4 py-3">
      <div className="flex items-center">
        <a href="/" className="text-xl font-normal text-gray-900">
          ODYWP
        </a>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? <ProfileButton /> : <LoginButton />}
        <AddVideoButton />
      </div>
    </header>
  );
};

export default Header;
