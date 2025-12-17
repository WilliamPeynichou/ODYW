// Service pour interagir avec l'API d'authentification
// TODO: Remplacer les URLs par les endpoints réels une fois disponibles

const API_BASE_URL = 'http://localhost:3000/api/auth';

/**
 * Connecte un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<Object>} Promise qui résout avec les données de l'utilisateur et le token
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
};

/**
 * Enregistre un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur (username, email, password)
 * @returns {Promise<Object>} Promise qui résout avec les données de l'utilisateur créé
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur register:', error);
    throw error;
  }
};

export default {
  login,
  register,
};

