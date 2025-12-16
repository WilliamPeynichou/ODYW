import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import testRoutes from './routes/test.route.js';
import videoRoutes from './routes/video.route.js';
import {
    VALIDATION_ERRORS,
    SERVER_ERRORS,
    sendValidationError,
    sendServerError
} from './utils/message.js';

const app = express();

// config de l'app
// autorise les requetes externes
app.use(cors());
// parse les requetes en json
app.use(express.json());
// log les requetes en mode dev
app.use(morgan('dev'));


// les routes
app.use('/api/test', testRoutes);
app.use('/api/videos', videoRoutes);

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error(err);
    
    // Gestion des erreurs Multer
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return sendValidationError(res, VALIDATION_ERRORS.FILE_TOO_LARGE);
        }
        return sendValidationError(res, VALIDATION_ERRORS.UPLOAD_ERROR, err.message);
    }
    
    sendServerError(res, SERVER_ERRORS.INTERNAL_SERVER_ERROR, err.message, err.status || 500);
})


export default app;


