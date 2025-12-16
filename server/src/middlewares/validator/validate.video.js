// Middleware pour valider les inputs des vidéos

import { z } from 'zod';

// Schéma de validation pour la création d'une vidéo
const createVideoSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Le titre est requis' })
        .max(100, { message: 'Le titre ne doit pas dépasser 100 caractères' })
        .optional()
        .or(z.literal('')),
    theme_id: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Le thème est requis et doit être un nombre valide'
        })
});

// Schéma de validation pour la mise à jour d'une vidéo (tous les champs optionnels)
const updateVideoSchema = z.object({
    title: z
        .string()
        .max(100, { message: 'Le titre ne doit pas dépasser 100 caractères' })
        .optional(),
    theme_id: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Le thème doit être un nombre valide'
        })
        .optional()
});

// Middleware pour valider la création d'une vidéo
export const validateCreateVideo = (req, res, next) => {
    try {
        // Vérifier la présence du fichier vidéo
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Aucune vidéo n\'a été uploadée' 
            });
        }

        // Valider les données du body
        createVideoSchema.parse(req.body);
        
        // Si tout est valide, passer au prochain middleware
        next();
    } catch (error) {
        // Si c'est une erreur Zod
        if (error.errors) {
            return res.status(400).json({ 
                error: error.errors[0].message 
            });
        }
        
        // Autres erreurs
        return res.status(400).json({ 
            error: 'Erreur de validation' 
        });
    }
};

// Middleware pour valider la mise à jour d'une vidéo
export const validateUpdateVideo = (req, res, next) => {
    try {
        // Pour la mise à jour, le fichier vidéo est optionnel
        // On valide seulement les données du body
        updateVideoSchema.parse(req.body);
        
        // Si tout est valide, passer au prochain middleware
        next();
    } catch (error) {
        // Si c'est une erreur Zod
        if (error.errors) {
            return res.status(400).json({ 
                error: error.errors[0].message 
            });
        }
        
        // Autres erreurs
        return res.status(400).json({ 
            error: 'Erreur de validation' 
        });
    }
};