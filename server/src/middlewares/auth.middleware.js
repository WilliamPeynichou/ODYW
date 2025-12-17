// import des outils
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../db/index.js';

export async function authenticate(req, res, next){
    try {
        // récupération du token dans l'en-tête Authorization
        const authorization = req.headers.authorization;
        const token = authorization.replace('Bearer ', '');
        // vérification du token
        if(!token){
            return res.status(401).json({
                message: 'Token non fourni'
            });
        }
        // dans le cas où le token est invalide
        const payload = jwt.verify(token, env.jwtSecret);
        // récupération de l'utilisateur dans la base de données
        const [rows] = await pool.execute( 'SELECT id, email, username FROM users WHERE id = ?', [payload.id]);
        // si l'utilisateur n'est pas trouvé, on throw une erreur
        if(!rows[0]){
            return res.status(401).json({
                message: 'Utilisateur non trouvé'
            });
        }
        // on ajoute l'utilisateur à la requête
        req.user = rows[0];
        next();
    } catch (error) {
        error.status = 401;
        next(error);
    }
};