import { testConnection } from '../db/index.js';
import {
    SUCCESS_MESSAGES,
    SERVER_ERRORS,
    sendSuccess,
    sendServerError
} from '../utils/message.js';

// endpoint pour tester la connexion à la db
export const testController = async (req, res) => {
    try {
        // await la fonction testConnection pour tester la connexion à la db
        await testConnection();
        // si la connexion est réussie, on renvoie un message de succès avec le status 200
        sendSuccess(res, SUCCESS_MESSAGES.DB_CONNECTION_SUCCESS);
    } catch (error) {
        // si la connexion a la db echoue, on renvoie un message d'erreur avec le status 500
        // (500 = erreur server interne)
        sendServerError(res, SERVER_ERRORS.DB_CONNECTION_ERROR, error.message);
    }
}