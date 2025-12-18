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
 * Vérifie si l'utilisateur a un role_id spécifique
 * @param {number} roleId - L'ID du rôle à vérifier (1=user, 2=admin, 3=superAdmin)
 * @returns {boolean} True si l'utilisateur a le rôle
 */
export const hasRoleId = (roleId) => {
  const user = getCurrentUser();
  return user && user.role_id === roleId;
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique (compatibilité avec ancien système)
 * @param {string} role - Le rôle à vérifier ('admin' ou 'superAdmin')
 * @returns {boolean} True si l'utilisateur a le rôle
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (user && user.role_id) {
    if (role === 'superAdmin') return user.role_id === 3;
    if (role === 'admin') return user.role_id === 2;
    if (role === 'user') return user.role_id === 1;
  }
  return user && user.role === role;
};

/**
 * Vérifie si l'utilisateur est admin ou superAdmin
 * @returns {boolean} True si l'utilisateur est admin ou superAdmin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  if (user && user.role_id) {
    return user.role_id === 2 || user.role_id === 3;
  }
  return user && (user.role === 'admin' || user.role === 'superAdmin');
};

/**
 * Vérifie si l'utilisateur est superAdmin
 * @returns {boolean} True si l'utilisateur est superAdmin
 */
export const isSuperAdmin = () => {
  const user = getCurrentUser();
  if (user && user.role_id) {
    return user.role_id === 3;
  }
  return hasRole('superAdmin');
};

/**
 * Vérifie si l'utilisateur est admin (pas superAdmin)
 * @returns {boolean} True si l'utilisateur est admin (role_id === 2)
 */
export const isAdminOnly = () => {
  const user = getCurrentUser();
  return user && user.role_id === 2;
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
  hasRoleId,
  isAdmin,
  isAdminOnly,
  isSuperAdmin,
  logout,
};

