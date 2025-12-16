// Service pour interagir avec l'API de commentaires

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Récupère tous les commentaires d'une vidéo
 * @param {string|number} videoId - ID de la vidéo
 * @returns {Promise<Array>} Promise qui résout avec un tableau de commentaires
 */
export const getCommentsByVideoId = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des commentaires');
    }

    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error('Erreur getCommentsByVideoId:', error);
    throw error;
  }
};

/**
 * Crée un nouveau commentaire
 * @param {string|number} videoId - ID de la vidéo
 * @param {string} content - Contenu du commentaire
 * @returns {Promise<Object>} Promise qui résout avec le commentaire créé
 */
export const createComment = async (videoId, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la création du commentaire');
    }

    const data = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Erreur createComment:', error);
    throw error;
  }
};

/**
 * Met à jour un commentaire existant
 * @param {string|number} commentId - ID du commentaire
 * @param {string} content - Nouveau contenu du commentaire
 * @returns {Promise<Object>} Promise qui résout avec le commentaire mis à jour
 */
export const updateComment = async (commentId, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la mise à jour du commentaire');
    }

    const data = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Erreur updateComment:', error);
    throw error;
  }
};

/**
 * Supprime un commentaire
 * @param {string|number} commentId - ID du commentaire
 * @returns {Promise<Object>} Promise qui résout avec le commentaire supprimé
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la suppression du commentaire');
    }

    const data = await response.json();
    return data.comment;
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

