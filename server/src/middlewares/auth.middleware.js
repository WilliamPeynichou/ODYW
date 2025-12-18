// import des outils
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../db/index.js';

// Middleware pour authentifier l'utilisateur via JWT
export async function authenticate(req, res, next){
    try {
        // Récupération du token depuis le header Authorization
        const authorization = req.headers.authorization;

        // Si header Authorization absent
        if (!authorization) {
            return res.status(401).json({
                message: 'Token non fourni'
            });
        }

        // Supprime "Bearer " pour ne garder que le token
        const token = authorization.replace('Bearer ', '');
        
        // Vérification si le token existe après suppression de "Bearer "
        if(!token){
            return res.status(401).json({
                message: 'Token invalide'
            });
        }

        let payload;
        try {
            // Vérifie et décoder le token JWT
            payload = jwt.verify(token, env.jwtSecret);
            console.log('payload JWT:', payload);
        } catch (error) {
            // Si le token est invalide ou expiré
            return res.status(401).json({
                message: 'Token invalide ou expiré'
            });
        }

        // Récupère l'utilisateur dans la bdd avec l'ID du token
        const [rows] = await pool.execute(
            'SELECT id, email, username, role_id FROM users WHERE id = ?',
            [payload.id]
        );

        // Si aucun utilisateur trouvé
        if (!rows[0]) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé'
            });
        }

        // Ajouter l'utilisateur à la requete pour les suivants ou le controller
        req.user = rows[0];

        // Passe au middleware ou controller suivant
        next();

    }catch(error){
        // En cas de problèmes
        console.error(error);
        return res.status(500).json({
            message: 'Erreur serveur'
        });
    }


};