import { z } from 'zod';
import { sendValidationError } from '../utils/message.js';
import { VALIDATION_ERRORS } from '../utils/message.js';
import { formatZodErrors } from '../services/validate.service.video.js';

/**
 * Middleware générique pour valider les données avec Zod
 * Peut être utilisé pour valider body, params, query ou headers
 * 
 * @param {z.ZodSchema} schema - Schéma Zod à utiliser pour la validation
 * @param {string} source - Source des données à valider ('body', 'params', 'query', 'headers')
 * @returns {Function} Middleware Express
 * 
 * @example
 * router.post('/video', validate(createVideoSchema), controller.create);
 * router.get('/video/:id', validate(idParamSchema, 'params'), controller.getOne);
 */
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            // Valider et transformer les données
            const validated = schema.parse(req[source]);
            
            // Remplacer par les données validées et nettoyées (sanitized)
            // Cela protège contre la pollution de données (data pollution)
            req[source] = validated;
            
            // Stocker les données originales pour référence si nécessaire
            if (!req.originalData) {
                req.originalData = {};
            }
            req.originalData[source] = req[source];
            
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Formater les erreurs Zod de manière lisible
                const formattedErrors = formatZodErrors(error);
                
                return sendValidationError(res, {
                    message: `Validation échouée pour ${source}`,
                    errors: formattedErrors,
                    details: formattedErrors.map(e => `${e.field}: ${e.message}`).join(', ')
                });
            }
            
            // Erreur inattendue - passer au gestionnaire d'erreurs global
            console.error('Erreur de validation inattendue:', error);
            next(error);
        }
    };
};

/**
 * Middleware pour valider le body de la requête
 * Raccourci pour validate(schema, 'body')
 * 
 * @param {z.ZodSchema} schema - Schéma Zod
 * @returns {Function} Middleware Express
 */
export const validateBody = (schema) => validate(schema, 'body');

/**
 * Middleware pour valider les params de la requête
 * Raccourci pour validate(schema, 'params')
 * 
 * @param {z.ZodSchema} schema - Schéma Zod
 * @returns {Function} Middleware Express
 */
export const validateParams = (schema) => validate(schema, 'params');

/**
 * Middleware pour valider la query de la requête
 * Raccourci pour validate(schema, 'query')
 * 
 * @param {z.ZodSchema} schema - Schéma Zod
 * @returns {Function} Middleware Express
 */
export const validateQuery = (schema) => validate(schema, 'query');

/**
 * Middleware pour valider plusieurs sources à la fois
 * Utile quand on doit valider body ET params par exemple
 * 
 * @param {Object} schemas - Objet avec les schémas pour chaque source
 * @example
 * validateMultiple({
 *   params: idParamSchema,
 *   body: updateVideoSchema
 * })
 */
export const validateMultiple = (schemas) => {
    return (req, res, next) => {
        const errors = [];
        
        try {
            // Valider chaque source spécifiée
            for (const [source, schema] of Object.entries(schemas)) {
                try {
                    const validated = schema.parse(req[source]);
                    req[source] = validated;
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const formattedErrors = formatZodErrors(error);
                        errors.push(...formattedErrors.map(e => ({
                            ...e,
                            source
                        })));
                    } else {
                        throw error;
                    }
                }
            }
            
            // Si des erreurs ont été trouvées, les retourner
            if (errors.length > 0) {
                return sendValidationError(res, {
                    message: 'Validation échouée',
                    errors: errors,
                    details: errors.map(e => `${e.source}.${e.field}: ${e.message}`).join(', ')
                });
            }
            
            next();
        } catch (error) {
            console.error('Erreur de validation multiple inattendue:', error);
            next(error);
        }
    };
};

/**
 * Middleware pour valider de manière optionnelle
 * Si les données sont présentes, elles sont validées
 * Si elles sont absentes ou vides, le middleware continue sans erreur
 * 
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {string} source - Source des données
 * @returns {Function} Middleware Express
 */
export const validateOptional = (schema, source = 'body') => {
    return (req, res, next) => {
        // Si la source n'existe pas ou est vide, continuer
        if (!req[source] || Object.keys(req[source]).length === 0) {
            return next();
        }
        
        try {
            const validated = schema.parse(req[source]);
            req[source] = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = formatZodErrors(error);
                
                return sendValidationError(res, {
                    message: `Validation optionnelle échouée pour ${source}`,
                    errors: formattedErrors
                });
            }
            
            next(error);
        }
    };
};

/**
 * Middleware pour transformer les données sans validation stricte
 * Utile pour nettoyer/normaliser les données sans rejeter la requête
 * 
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {string} source - Source des données
 * @returns {Function} Middleware Express
 */
export const sanitize = (schema, source = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        
        if (result.success) {
            // Remplacer par les données nettoyées
            req[source] = result.data;
        }
        // En cas d'échec, continuer avec les données originales
        // (utile pour les transformations non critiques)
        
        next();
    };
};

/**
 * Middleware de validation avec callback personnalisé pour gérer les erreurs
 * 
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {string} source - Source des données
 * @param {Function} errorHandler - Fonction de gestion des erreurs personnalisée
 * @returns {Function} Middleware Express
 */
export const validateWithCustomError = (schema, source = 'body', errorHandler) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req[source]);
            req[source] = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = formatZodErrors(error);
                return errorHandler(req, res, formattedErrors);
            }
            next(error);
        }
    };
};

// Export par défaut du middleware principal
export default validate;

