// Middleware pour valider les inputs des commentaires

import { z } from 'zod';
import { messages } from '../utils/messages.js';

export const validateComment = (req, res, next) => {
    // On définit le schéma de validation
    const schema = z.object({
        content: z
            .string()
            .min(1, { message: messages.invalidContent }) // contenu obligatoire
            .max(500, { message: messages.invalidContent }) //max 500 caractères
    });

    try {
        schema.parse(req.body); // Valider la requête
        next(); // Passer au controller si valide
    } catch (error) {
        return res.status(400).json({ error: error.errors[0].message }); // Renvoyer un message d'erreur
    }
}