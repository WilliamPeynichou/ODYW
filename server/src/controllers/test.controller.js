import { testConnection } from '../db/index.js';

// endpoint pour tester la connexion à la db
export const testController = async (req, res) => {
    try {
        // await la fonction testConnection pour tester la connexion à la db
        await testConnection();
        // si la connexion est réussie, on renvoie un message de succès avec le status 200
        res.status(200).json({
            // le message de succès
            message: 'Connexion à la db réussie',
        });
    } catch (error) {
        // si la connexion a la db echoue, on renvoie un message d'erreur avec le status 500
        // (500 = erreur server interne)
        res.status(500).json({
            message: 'Erreur lors de la connexion à la db',
            error: error.message,
        });
    }
}