// Service pour interagir avec l'API d'administration
// TODO: Remplacer les URLs par les endpoints réels une fois disponibles

import { getAuthToken } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:3000/api/admin';

/**
 * Récupère les headers avec le token d'authentification
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Récupère tous les utilisateurs (filtrés selon le rôle de l'admin)
 * @returns {Promise<Array>} Promise qui résout avec un tableau d'utilisateurs
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la récupération des utilisateurs');
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    throw error;
  }
};

/**
 * Récupère un utilisateur par son ID
 * @param {string|number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Promise qui résout avec l'utilisateur
 */
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la récupération de l\'utilisateur');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Erreur getUserById:', error);
    throw error;
  }
};

/**
 * Met à jour un utilisateur (seul le superAdmin peut changer les rôles)
 * @param {string|number} userId - ID de l'utilisateur
 * @param {Object} userData - Données de l'utilisateur à mettre à jour
 * @returns {Promise<Object>} Promise qui résout avec l'utilisateur mis à jour
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la mise à jour de l\'utilisateur');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Erreur updateUser:', error);
    throw error;
  }
};

/**
 * Supprime un utilisateur
 * @param {string|number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Promise qui résout avec un message de confirmation
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la suppression de l\'utilisateur');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    throw error;
  }
};

/**
 * Met à jour les droits d'un utilisateur (seul le superAdmin peut faire cela)
 * @param {string|number} userId - ID de l'utilisateur
 * @param {Object} permissions - Objet contenant les permissions
 * @returns {Promise<Object>} Promise qui résout avec l'utilisateur mis à jour
 */
export const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/permissions`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la mise à jour des permissions');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Erreur updateUserPermissions:', error);
    throw error;
  }
};

/**
 * Récupère toutes les vidéos (pour gestion admin)
 * @returns {Promise<Array>} Promise qui résout avec un tableau de vidéos
 */
export const getAllVideosAdmin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la récupération des vidéos');
    }

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Erreur getAllVideosAdmin:', error);
    throw error;
  }
};

/**
 * Supprime une vidéo (admin)
 * @param {string|number} videoId - ID de la vidéo
 * @returns {Promise<Object>} Promise qui résout avec un message de confirmation
 */
export const deleteVideoAdmin = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la suppression de la vidéo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur deleteVideoAdmin:', error);
    throw error;
  }
};

/**
 * Récupère tous les thèmes (pour gestion admin)
 * @returns {Promise<Array>} Promise qui résout avec un tableau de thèmes
 */
export const getAllThemesAdmin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/themes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la récupération des thèmes');
    }

    const data = await response.json();
    return data.themes || [];
  } catch (error) {
    console.error('Erreur getAllThemesAdmin:', error);
    throw error;
  }
};

/**
 * Crée un nouveau thème (admin)
 * @param {Object} themeData - Données du thème
 * @returns {Promise<Object>} Promise qui résout avec le thème créé
 */
export const createThemeAdmin = async (themeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/themes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la création du thème');
    }

    const data = await response.json();
    return data.theme;
  } catch (error) {
    console.error('Erreur createThemeAdmin:', error);
    throw error;
  }
};

/**
 * Met à jour un thème (admin)
 * @param {string|number} themeId - ID du thème
 * @param {Object} themeData - Données du thème à mettre à jour
 * @returns {Promise<Object>} Promise qui résout avec le thème mis à jour
 */
export const updateThemeAdmin = async (themeId, themeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/themes/${themeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la mise à jour du thème');
    }

    const data = await response.json();
    return data.theme;
  } catch (error) {
    console.error('Erreur updateThemeAdmin:', error);
    throw error;
  }
};

/**
 * Supprime un thème (admin)
 * @param {string|number} themeId - ID du thème
 * @returns {Promise<Object>} Promise qui résout avec un message de confirmation
 */
export const deleteThemeAdmin = async (themeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/themes/${themeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la suppression du thème');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur deleteThemeAdmin:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPermissions,
  getAllVideosAdmin,
  deleteVideoAdmin,
  getAllThemesAdmin,
  createThemeAdmin,
  updateThemeAdmin,
  deleteThemeAdmin,
};

