import { z } from 'zod';
import {
    createVideoSchema,
    updateVideoSchema,
    idParamSchema,
    videoMetadataSchema,
    completeVideoSchema,
    videoQuerySchema
} from '../schemas/video.schema.js';

/**
 * Service de validation pour les vidéos utilisant Zod
 * Centralise toutes les validations de données liées aux vidéos
 */

/**
 * Valide les données de création d'une vidéo (formulaire)
 * @param {Object} data - Données à valider (title, theme_id)
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validateCreateVideo = (data) => {
    try {
        const validated = createVideoSchema.parse(data);
        return {
            success: true,
            data: validated
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

/**
 * Valide les données de mise à jour d'une vidéo
 * @param {Object} data - Données à valider (title?, theme_id?)
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validateUpdateVideo = (data) => {
    try {
        const validated = updateVideoSchema.parse(data);
        return {
            success: true,
            data: validated
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

/**
 * Valide un paramètre ID
 * @param {string|number} id - ID à valider
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validateId = (id) => {
    try {
        const validated = idParamSchema.parse({ id });
        return {
            success: true,
            data: validated.id
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

/**
 * Valide les métadonnées d'une vidéo (après analyse du fichier)
 * @param {Object} metadata - Métadonnées à valider (duration, size_mb, video_url)
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validateVideoMetadata = (metadata) => {
    try {
        const validated = videoMetadataSchema.parse(metadata);
        return {
            success: true,
            data: validated
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

/**
 * Valide un objet vidéo complet (création en base de données)
 * @param {Object} videoData - Données complètes de la vidéo
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validateCompleteVideo = (videoData) => {
    try {
        const validated = completeVideoSchema.parse(videoData);
        return {
            success: true,
            data: validated
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

/**
 * Valide les paramètres de query (filtres, pagination)
 * @param {Object} query - Paramètres de query
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validateVideoQuery = (query) => {
    try {
        const validated = videoQuerySchema.parse(query);
        return {
            success: true,
            data: validated || {}
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

/**
 * Validation sécurisée qui lance une exception en cas d'échec
 * Utile pour les middlewares Express
 * @param {z.ZodSchema} schema - Schéma Zod à utiliser
 * @param {Object} data - Données à valider
 * @returns {Object} - Données validées
 * @throws {z.ZodError} - Si la validation échoue
 */
export const validateOrThrow = (schema, data) => {
    return schema.parse(data);
};

/**
 * Validation sécurisée qui retourne undefined en cas d'échec
 * Utile pour les validations optionnelles
 * @param {z.ZodSchema} schema - Schéma Zod à utiliser
 * @param {Object} data - Données à valider
 * @returns {Object|undefined} - Données validées ou undefined
 */
export const validateSafe = (schema, data) => {
    const result = schema.safeParse(data);
    return result.success ? result.data : undefined;
};

/**
 * Formate les erreurs Zod en un format plus lisible
 * @param {z.ZodError} zodError - Erreur Zod
 * @returns {Array} - Tableau d'erreurs formatées
 */
export const formatZodErrors = (zodError) => {
    if (!zodError || !zodError.issues) {
        return [];
    }
    
    return zodError.issues.map(error => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code,
        received: error.received
    }));
};

/**
 * Nettoie et sanitize les données d'entrée
 * Retire les propriétés non définies dans le schéma (protection contre la pollution de données)
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {Object} data - Données à nettoyer
 * @returns {Object} - Données nettoyées
 */
export const sanitizeData = (schema, data) => {
    const result = schema.safeParse(data);
    if (result.success) {
        return result.data;
    }
    // Retourner un objet vide si la validation échoue
    return {};
};

/**
 * Vérifie si les données sont valides sans lancer d'exception
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {Object} data - Données à vérifier
 * @returns {boolean} - true si valide, false sinon
 */
export const isValid = (schema, data) => {
    const result = schema.safeParse(data);
    return result.success;
};

/**
 * Valide partiellement un objet (utile pour les mises à jour)
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {Object} data - Données à valider
 * @returns {Object} - { success: boolean, data?: Object, errors?: Array }
 */
export const validatePartial = (schema, data) => {
    try {
        const partialSchema = schema.partial();
        const validated = partialSchema.parse(data);
        return {
            success: true,
            data: validated
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: formatZodErrors(error)
            };
        }
        throw error;
    }
};

// Export des schémas pour une utilisation directe si nécessaire
export {
    createVideoSchema,
    updateVideoSchema,
    idParamSchema,
    videoMetadataSchema,
    completeVideoSchema,
    videoQuerySchema
};

