// Gestion des requêtes SQL pour les commentaires

import { pool } from '../db/index.js';

// Récupérer tous les commentaires d'un vidéo
export const getCommentsByVideoId = async (videoId) => {
    if (!Number.isInteger(videoId)) throw new Error('Video id doit être un integer');
    try {
        // Récupérer les commentaires avec les informations de l'utilisateur si disponibles
        const [rows] = await pool.execute(
            `SELECT c.*, u.username as author 
             FROM comments c 
             LEFT JOIN users u ON c.user_id = u.id 
             WHERE c.video_id = ? 
             ORDER BY c.created_at DESC`,
            [videoId]
        );
        return rows;
    } catch (error) {
        console.error('Erreur dans getCommentsByVideoId:', error);
        throw new Error('Database error');
    }
}

// Créer un commentaire
export const createComment = async (videoId, content, userId = null) => {
    if (!Number.isInteger(videoId)) throw new Error('Video id doit être un integer');
    try {
        // Si userId est fourni, l'inclure dans l'insertion
        if (userId !== null && Number.isInteger(userId)) {
            const [result] = await pool.execute(
                'INSERT INTO comments (video_id, content, user_id) VALUES (?, ?, ?)',
                [videoId, content, userId]
            );
            return result.insertId;
        } else {
            // Sinon, créer le commentaire sans user_id (pour compatibilité)
            const [result] = await pool.execute(
                'INSERT INTO comments (video_id, content) VALUES (?, ?)',
                [videoId, content]
            );
            return result.insertId;
        }
    } catch (error) {
        console.error('Erreur dans createComment:', error);
        throw new Error('Database error');
    }
};

// Modifier un commentaire existant
export const updateComment = async (id, content) => {
    if (!Number.isInteger(id)) throw new Error('Comment id doit être un integer');
    try {
        const [result] = await pool.execute(
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
        const [result] = await pool.execute(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
        return result.affectedRows;  
    } catch (error) {
console.error(error);
        throw new Error('Database error');
    }
}