import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import testRoutes from './routes/test.route.js';
import commentRoutes from './routes/comments.js';

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
app.use('/api/comments', commentRoutes);

app.use((err, res) => {
    console.error(err);
    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: err.message
    });
})


export default app;


