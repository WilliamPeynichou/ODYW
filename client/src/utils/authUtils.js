// Utilitaires pour la gestion de l'authentification et des rôles

/**
 * Récupère l'utilisateur connecté depuis le localStorage
 * @returns {Object|null} L'utilisateur ou null
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

/**
 * Récupère le token d'authentification
 * @returns {string|null} Le token ou null
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {string} role - Le rôle à vérifier ('admin' ou 'superAdmin')
 * @returns {boolean} True si l'utilisateur a le rôle
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

/**
 * Vérifie si l'utilisateur est admin ou superAdmin
 * @returns {boolean} True si l'utilisateur est admin ou superAdmin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.role === 'superAdmin');
};

/**
 * Vérifie si l'utilisateur est superAdmin
 * @returns {boolean} True si l'utilisateur est superAdmin
 */
export const isSuperAdmin = () => {
  return hasRole('superAdmin');
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default {
  getCurrentUser,
  getAuthToken,
  hasRole,
  isAdmin,
  isSuperAdmin,
  logout,
};

