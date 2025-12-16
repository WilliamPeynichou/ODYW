// Service pour interagir avec l'API de thèmes

const API_BASE_URL = 'http://localhost:3000/api/themes';

/**
 * Récupère tous les thèmes
 * @returns {Promise<Array>} Promise qui résout avec un tableau de thèmes
 */
export const getAllThemes = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des thèmes');
    }

    const data = await response.json();
    return data.themes || [];
  } catch (error) {
    console.error('Erreur getAllThemes:', error);
    throw error;
  }
};

/**
 * Récupère un thème par son ID
 * @param {string|number} id - ID du thème
 * @returns {Promise<Object>} Promise qui résout avec le thème
 */
export const getThemeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération du thème');
    }

    const data = await response.json();
    return data.theme;
  } catch (error) {
    console.error('Erreur getThemeById:', error);
    throw error;
  }
};

export default {
  getAllThemes,
  getThemeById,
};

