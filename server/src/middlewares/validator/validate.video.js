// Middleware pour valider les inputs des vidéos
import { z } from 'zod';

// Schéma de validation pour la création d'une vidéo
const createVideoSchema = z.object({
    title: z
        // verif que ce soit une string
        .string()
        // min 1 caractère
        .min(1, { message: 'Le titre est requis' })
        // max 100 caractères
        .max(100, { message: 'Le titre ne doit pas dépasser 100 caractères' }),
    theme_id: z
        // verif que ce soit une string
        .string()
        // transformer la value en nombre/integer
        .transform((val) => parseInt(val, 10))
        // verifie que la value est pas "not a number", donc si c'est un nombre valide et sup à 0
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Le thème est requis et doit être un nombre valide'
        })
});

// Schéma de validation pour la mise à jour d'une vidéo
const updateVideoSchema = z.object({
    title: z
        // verifie que ce soit une string
        .string()
        // nettoie les espaces du debut et de la fin
        .trim()
        .min(1, { message: 'Le titre est requis' })
        .max(100, { message: 'Le titre ne doit pas dépasser 100 caractères' })
        .optional()
        // si le titre est vide, on transforme en undefined
        .or(z.literal('').transform(() => undefined)),
    theme_id: z
        // verifie que le thème est un nombre valide
        // union permet d'accepter plusieurs formes possibles
        .union([
            // s'assurer que c'est un nomnbre et positif
            z.coerce.number().int().positive({ message: 'le thème est requis et doit etre un nombre valide'}),
            // si le thème est vide, on transforme en undefined
            z.literal('').transform(() => undefined),
            // si le thème est null, on transforme en undefined
            z.null().transform(() => undefined),
        ])
        .optional(),
})

// Middleware pour valider la création d'une vidéo
export const validateCreateVideo = (req, res, next) => {
    try {
        // si pas de fichier dans la requete, renvoyer une erreur
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Aucune vidéo n\'a été uploadée' 
            });
        }

        // dans createVideoSchema, on parse/valide les données du body
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
        
        // dans updateVideoSchema, on parse/valide les données du body
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