// Gestion des requêtes SQL pour les commentaires

import { db } from '../db/index.js';

// Récupérer tous les commentaires d'un vidéo
export const getCommentsByVideoId = async (videoId) => {
    if (!Number.isInteger(videoId)) throw new Error('Comment id doit être un integer');
    try {
        const [rows] = await db.execute(
            'SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC',
            [videoId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

// Créer un commentaire
export const createComment = async (videoId, content) => {
    if (!Number.isInteger(videoId)) throw new Error('Comment id doit être un integer');
    try {
        const [result] = await db.execute(
            'INSERT INTO comments (video_id, content) VALUES (?, ?)',
            [videoId, content]
        );
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
};

// Modifier un commentaire existant
export const updateComment = async (id, content) => {
    if (!Number.isInteger(id)) throw new Error('Comment id doit être un integer');
    try {
        const [result] = await db.execute(
            'UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [content, id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
};

// Supprimer un commentaire 
export const deleteComment = async (id) => {
    if (!Number.isInteger(id)) throw new Error('Comment id doit être un integer');
    try {
        const [result] = await db.execute(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
        return result.affectedRows;  
    } catch (error) {
console.error(error);
        throw new Error('Database error');
    }
}