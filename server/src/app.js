import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import testRoutes from './routes/test.route.js';
import videoRoutes from './routes/video.route.js';

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
            return res.status(400).json({
                error: 'Le fichier est trop volumineux. Taille maximale: 45 Mo'
            });
        }
        return res.status(400).json({
            error: 'Erreur lors de l\'upload du fichier',
            message: err.message
        });
    }
    
    res.status(err.status || 500).json({
        message: 'Erreur interne du serveur',
        error: err.message
    });
})


export default app;


