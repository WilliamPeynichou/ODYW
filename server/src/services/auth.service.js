import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../db/index.js';

// fonction pour enregistrer un utilisateur
export async function register({email, password, username}){
    // validation basique (si les champs sont présents)
    if(!email || !password || !username){
        const error = new Error('Tous les champs sont requis');
        error.status = 400;
        throw error;
    }

    // hash du mot de passe
    const hash = await bcrypt.hash(password, 10);
    // enregistrement de l'utilisateur dans la base de données
    const query = `INSERT INTO users (email, password, username) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(query, [email, hash, username]);


    return {
        id: result.insertId,
        email,
        username,
        created_at: new Date(),
    };
};

// fonction pour connecter un utilisateur
export async function login({email, password}){
    // validation basique (si les champs sont présents)
    if(!email || !password){
        const error = new Error('Tous les champs sont requis');
        error.status = 400;
        throw error;
    }
    // récupération de l'utilisateur dans la base de données
    const query = `SELECT id, email, password, username FROM users WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    const user = rows[0];
    // si l'utilisateur n'est pas trouvé, on throw une erreur
    if(!user){
        const error = new Error('Utilisateur non trouvé');
        error.status = 401;
        throw error;
    }
    // vérification du mot de passe
    const match = await bcrypt.compare(password, user.password);
    // si le mot de passe est invalide, on throw une erreur
    if(!match){
        const error = new Error('Mot de passe invalide');
        error.status = 401;
        throw error;
    }
    // génération du token
    const token = jwt.sign(
        {id: user.id, email: user.email, username: user.username}, 
        env.jwtSecret, 
        {expiresIn: '3h'}
    );
    
    return token;
}