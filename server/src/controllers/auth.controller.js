// import des outils
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../db/index.js';
import { register, login } from '../services/auth.service.js';

// controller pour enregistrer un utilisateur
export const registerController = async (req, res, next) => {
    try {
        const user = await register(req.body);

        res.status(201).json({
            message: 'Utilisateur enregistré avec succès',
            data: user
        });
    } catch (error) {
        console.error('erreur lors de la création du compte', error);
        next(error);
    }
}

// controller pour connecter un utilisateur
export const loginController = async (req, res, next) => {
    try {
        const token = await login(req.body);

        if(!token){
            return res.status(401).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            message: 'Utilisateur connecté avec succès',
            data: token
        });
    }
    catch (error) {
        console.error('erreur lors de la connexion', error);
        next(error);
    }
}

// controller pour afficher le profil de l'utilisateur
export async function getProfileController(req, res) {
    try {
        const user = req.user;

        res.status(200).json({
            message: 'Profil utilisateur',
            data: user
        });
    }
    catch (error) {
        console.error('erreur lors de la récupération du profil', error);
        next(error);
    }
}