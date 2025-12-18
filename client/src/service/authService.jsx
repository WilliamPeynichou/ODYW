// Service pour interagir avec l'API d'authentification
// TODO: Remplacer les URLs par les endpoints réels une fois disponibles

const API_BASE_URL = 'http://localhost:3000/api/auth';

/**
 * Décode un token JWT pour obtenir les informations utilisateur
 * @param {string} token - Token JWT
 * @returns {Object|null} Les données décodées ou null si invalide
 */
const decodeJWT = (token) => {
  try {
    // Un token JWT a 3 parties séparées par des points : header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

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
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Erreur HTTP ${response.status}` };
      }
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    
    // Le backend retourne { message, data: token }
    // On doit décoder le token pour obtenir les infos utilisateur
    const token = data.data || data.token;
    
    if (!token) {
      throw new Error('Token manquant dans la réponse du serveur');
    }

    // Décoder le token pour obtenir les infos utilisateur
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      throw new Error('Impossible de décoder le token');
    }

    // Retourner un format cohérent avec ce que le frontend attend
    return {
      token: token,
      user: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username
      }
    };
  } catch (error) {
    // Gestion spécifique des erreurs de connexion
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED') || error.message.includes('NetworkError')) {
      console.error('Erreur de connexion au serveur:', error);
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré sur le port 3000.');
    }
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

/**
 * Récupère le profil de l'utilisateur connecté
 * @returns {Promise<Object>} Promise qui résout avec les données du profil utilisateur
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Erreur lors de la récupération du profil');
    }

    const data = await response.json();
    
    // Le backend retourne { message, data: user }
    // On adapte pour retourner un format cohérent
    return {
      user: data.data || data.user
    };
  } catch (error) {
    console.error('Erreur getProfile:', error);
    throw error;
  }
};

export default {
  login,
  register,
  getProfile,
};

