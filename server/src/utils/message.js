// Messages HTTP centralisés

// Messages de succès (200)
export const SUCCESS_MESSAGES = {
    VIDEOS_RETRIEVED: 'Vidéos récupérées avec succès',
    VIDEO_RETRIEVED: 'Vidéo récupérée avec succès',
    VIDEO_UPDATED: 'Vidéo mise à jour avec succès',
    VIDEO_DELETED: 'Vidéo supprimée avec succès',
    DB_CONNECTION_SUCCESS: 'Connexion à la db réussie'
};

// Messages de création (201)
export const CREATED_MESSAGES = {
    VIDEO_UPLOADED: 'Vidéo uploadée avec succès'
};

// Messages d'erreur de validation (400)
export const VALIDATION_ERRORS = {
    NO_VIDEO_FILE: 'Aucun fichier vidéo fourni',
    MISSING_FIELDS: 'Les champs title et theme_id sont requis',
    FILE_TOO_LARGE: 'Le fichier est trop volumineux. Taille maximale: 45 Mo',
    UPLOAD_ERROR: 'Erreur lors de l\'upload du fichier',
    INVALID_VIDEO_ANALYSIS: 'Impossible d\'analyser la vidéo. Veuillez vérifier que le fichier est valide.',
    INVALID_VIDEO_DURATION: (duration) => `La durée de la vidéo doit être entre 10 secondes et 60 secondes. Durée actuelle: ${duration.toFixed(2)}s`,
    INVALID_VIDEO_METADATA: 'Impossible d\'obtenir la durée de la vidéo. Le fichier peut être corrompu ou invalide.'
};

// Messages d'erreur de ressource non trouvée (404)
export const NOT_FOUND_ERRORS = {
    VIDEO_NOT_FOUND: 'Vidéo non trouvée'
};

// Messages d'erreur serveur (500)
export const SERVER_ERRORS = {
    VIDEO_UPLOAD_ERROR: 'Erreur lors de l\'upload de la vidéo',
    VIDEOS_RETRIEVAL_ERROR: 'Erreur lors de la récupération des vidéos',
    VIDEO_RETRIEVAL_ERROR: 'Erreur lors de la récupération de la vidéo',
    VIDEO_UPDATE_ERROR: 'Erreur lors de la mise à jour de la vidéo',
    VIDEO_DELETION_ERROR: 'Erreur lors de la suppression de la vidéo',
    DB_CONNECTION_ERROR: 'Erreur lors de la connexion à la db',
    INTERNAL_SERVER_ERROR: 'Erreur interne du serveur'
};

// Fonctions helper pour envoyer les réponses

/**
 * Envoie une réponse de succès (200)
 * @param {Object} res - L'objet response Express
 * @param {string} message - Le message de succès
 * @param {Object} data - Les données à retourner (optionnel)
 */
export const sendSuccess = (res, message, data = null) => {
    const response = { message };
    if (data) {
        if (Array.isArray(data)) {
            response.videos = data;
        } else {
            response.video = data;
        }
    }
    return res.status(200).json(response);
};

/**
 * Envoie une réponse de création (201)
 * @param {Object} res - L'objet response Express
 * @param {string} message - Le message de succès
 * @param {Object} data - Les données à retourner (optionnel)
 */
export const sendCreated = (res, message, data = null) => {
    const response = { message };
    if (data) {
        response.video = data;
    }
    return res.status(201).json(response);
};

/**
 * Envoie une réponse d'erreur de validation (400)
 * @param {Object} res - L'objet response Express
 * @param {string} error - Le message d'erreur
 * @param {string} details - Détails supplémentaires (optionnel)
 */
export const sendValidationError = (res, error, details = null) => {
    const response = { error };
    if (details) {
        response.details = details;
    }
    return res.status(400).json(response);
};

/**
 * Envoie une réponse d'erreur de ressource non trouvée (404)
 * @param {Object} res - L'objet response Express
 * @param {string} error - Le message d'erreur
 */
export const sendNotFound = (res, error) => {
    return res.status(404).json({ error });
};

/**
 * Envoie une réponse d'erreur serveur (500)
 * @param {Object} res - L'objet response Express
 * @param {string} error - Le message d'erreur
 * @param {string} message - Le message détaillé (optionnel)
 * @param {number} statusCode - Le code de statut HTTP (par défaut 500)
 */
export const sendServerError = (res, error, message = null, statusCode = 500) => {
    const response = { error };
    if (message) {
        response.message = message;
    }
    return res.status(statusCode).json(response);
};

