import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import testRoutes from './routes/test.route.js';
import authRoutes from './routes/auth.route.js';
import commentRoutes from './routes/comments.route.js'
import videosRoutes from './routes/videos.route.js';
import themesRoutes from './routes/themes.route.js';
import { notFoundMiddleware } from './middlewares/notfound.middleware.js';
import adminRoutes from './routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


// config de l'app
// autorise les requetes externes
app.use(cors());
// parse les requetes en json
app.use(express.json());
// log les requetes en mode dev
app.use(morgan('dev'));

// servir les fichiers statiques (vidéos uploadées)
// Remonter d'un niveau depuis src/ pour accéder à uploads/
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// les routes
app.use('/api/test', testRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/comments', commentRoutes);

app.use('/api/videos', videosRoutes);
app.use('/api/themes', themesRoutes);

app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: err.message
    });
})

app.use(notFoundMiddleware);

export default app;


