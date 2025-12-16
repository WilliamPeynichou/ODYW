import { z } from 'zod';

/**
 * Schéma pour la création d'une vidéo
 * Valide les données lors de l'upload
 */
export const createVideoSchema = z.object({
    title: z.string({
        required_error: 'Le titre est requis',
        invalid_type_error: 'Le titre doit être une chaîne de caractères'
    })
        .min(3, 'Le titre doit contenir au moins 3 caractères')
        .max(200, 'Le titre ne peut pas dépasser 200 caractères')
        .trim()
        .refine(
            (val) => val.length > 0,
            'Le titre ne peut pas être vide'
        )
        .refine(
            (val) => !/[<>\"'`;\\{}]/.test(val),
            'Le titre contient des caractères non autorisés (< > " \' ` ; \\ { })'
        ),
    
    theme_id: z.coerce.number({
        required_error: 'L\'ID du thème est requis',
        invalid_type_error: 'L\'ID du thème doit être un nombre'
    })
        .int('L\'ID du thème doit être un entier')
        .positive('L\'ID du thème doit être un nombre positif')
        .min(1, 'L\'ID du thème doit être supérieur à 0')
});

/**
 * Schéma pour la mise à jour d'une vidéo
 * Tous les champs sont optionnels mais au moins un doit être présent
 */
export const updateVideoSchema = z.object({
    title: z.string()
        .min(3, 'Le titre doit contenir au moins 3 caractères')
        .max(200, 'Le titre ne peut pas dépasser 200 caractères')
        .trim()
        .refine(
            (val) => val.length > 0,
            'Le titre ne peut pas être vide'
        )
        .refine(
            (val) => !/[<>\"'`;\\{}]/.test(val),
            'Le titre contient des caractères non autorisés'
        )
        .optional(),
    
    theme_id: z.coerce.number()
        .int('L\'ID du thème doit être un entier')
        .positive('L\'ID du thème doit être un nombre positif')
        .min(1, 'L\'ID du thème doit être supérieur à 0')
        .optional()
}).refine(
    (data) => {
        // Vérifier qu'au moins un champ est fourni
        return Object.keys(data).length > 0 && 
               (data.title !== undefined || data.theme_id !== undefined);
    },
    {
        message: 'Au moins un champ (title ou theme_id) doit être fourni pour la mise à jour'
    }
);

/**
 * Schéma pour valider les paramètres d'ID dans les routes
 * Assure que l'ID est un nombre entier positif
 */
export const idParamSchema = z.object({
    id: z.coerce.number({
        required_error: 'L\'ID est requis',
        invalid_type_error: 'L\'ID doit être un nombre'
    })
        .int('L\'ID doit être un entier')
        .positive('L\'ID doit être un nombre positif')
        .min(1, 'L\'ID doit être supérieur à 0')
});

/**
 * Schéma pour valider les métadonnées de la vidéo
 * Utilisé après l'analyse du fichier
 */
export const videoMetadataSchema = z.object({
    duration: z.number({
        required_error: 'La durée est requise',
        invalid_type_error: 'La durée doit être un nombre'
    })
        .min(10, 'La durée doit être d\'au moins 10 secondes')
        .max(60, 'La durée ne peut pas dépasser 60 secondes'),
    
    size_mb: z.number({
        required_error: 'La taille est requise',
        invalid_type_error: 'La taille doit être un nombre'
    })
        .positive('La taille doit être positive')
        .max(45, 'La taille ne peut pas dépasser 45 Mo'),
    
    video_url: z.string({
        required_error: 'L\'URL de la vidéo est requise'
    })
        .startsWith('/uploads/', 'L\'URL de la vidéo doit commencer par /uploads/')
        .regex(/^\/uploads\/[a-zA-Z0-9\-\_\.]+\.(mp4|avi|mov|mkv|webm)$/i, 'Format d\'URL de vidéo invalide')
});

/**
 * Schéma complet pour la création d'une vidéo dans la base de données
 * Combine les données du formulaire et les métadonnées du fichier
 */
export const completeVideoSchema = createVideoSchema.merge(videoMetadataSchema);

/**
 * Schéma pour valider les paramètres de query (filtres, pagination, etc.)
 */
export const videoQuerySchema = z.object({
    theme_id: z.coerce.number()
        .int()
        .positive()
        .optional(),
    
    page: z.coerce.number()
        .int()
        .positive()
        .min(1)
        .default(1)
        .optional(),
    
    limit: z.coerce.number()
        .int()
        .positive()
        .min(1)
        .max(100)
        .default(10)
        .optional(),
    
    sort_by: z.enum(['created_at', 'title', 'duration', 'size_mb'])
        .default('created_at')
        .optional(),
    
    order: z.enum(['asc', 'desc'])
        .default('desc')
        .optional()
}).optional();

