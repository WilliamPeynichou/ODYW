import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../../../utils/authUtils';

/**
 * Composant de protection de route pour les pages admin
 * Redirige vers la page d'accueil si l'utilisateur n'est pas admin ou superAdmin
 */
const ProtectedRoute = ({ children }) => {
  const userIsAdmin = isAdmin();

  if (!userIsAdmin) {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

