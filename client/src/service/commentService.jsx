// Service pour interagir avec l'API de commentaires

import { getAuthToken } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Récupère tous les commentaires d'une vidéo
 * @param {string|number} videoId - ID de la vidéo
 * @returns {Promise<Array>} Promise qui résout avec un tableau de commentaires
 */
export const getCommentsByVideoId = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erreur lors de la récupération des commentaires');
    }

    const comments = await response.json();
    return Array.isArray(comments) ? comments : [];
  } catch (error) {
    console.error('Erreur getCommentsByVideoId:', error);
    throw error;
  }
};

/**
 * Crée un nouveau commentaire
 * @param {string|number} videoId - ID de la vidéo
 * @param {string} content - Contenu du commentaire
 * @returns {Promise<Object>} Promise qui résout avec l'ID du commentaire créé et le message
 */
export const createComment = async (videoId, content) => {
  try {
    // Récupérer le token d'authentification
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Vous devez être connecté pour ajouter un commentaire');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    const url = `${API_BASE_URL}/comments/${videoId}`;
    console.log('Création de commentaire:', { url, videoId, content, hasToken: !!token });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ content }),
    });

    console.log('Réponse du serveur:', { status: response.status, statusText: response.statusText });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `Erreur HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('Erreur du serveur:', errorData);
      throw new Error(errorData.error || errorData.message || 'Erreur lors de la création du commentaire');
    }

    const data = await response.json();
    console.log('Commentaire créé:', data);
    return { id: data.id, message: data.message };
  } catch (error) {
    console.error('Erreur createComment:', error);
    throw error;
  }
};

/**
 * Met à jour un commentaire existant
 * @param {string|number} commentId - ID du commentaire
 * @param {string} content - Nouveau contenu du commentaire
 * @returns {Promise<Object>} Promise qui résout avec le message de confirmation
 */
export const updateComment = async (commentId, content) => {
  try {
    // Récupérer le token d'authentification
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token d'authentification si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erreur lors de la mise à jour du commentaire');
    }

    const data = await response.json();
    return { message: data.message };
  } catch (error) {
    console.error('Erreur updateComment:', error);
    throw error;
  }
};

/**
 * Supprime un commentaire
 * @param {string|number} commentId - ID du commentaire
 * @returns {Promise<Object>} Promise qui résout avec le message de confirmation
 */
export const deleteComment = async (commentId) => {
  try {
    // Récupérer le token d'authentification
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token d'authentification si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erreur lors de la suppression du commentaire');
    }

    const data = await response.json();
    return { message: data.message };
  } catch (error) {
    console.error('Erreur deleteComment:', error);
    throw error;
  }
};

export default {
  getCommentsByVideoId,
  createComment,
  updateComment,
  deleteComment,
};

