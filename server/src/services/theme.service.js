// Gestion des requêtes SQL pour les thèmes

import { pool } from '../db/index.js';

// Récupérer tous les thèmes
export async function getAllThemes() {
    try {
        const sql = `
            SELECT * FROM themes
            ORDER BY name ASC
        `;
        
        const [rows] = await pool.execute(sql);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

// Récupérer un thème par son ID
export async function getThemeById(id) {
    if (!Number.isInteger(id)) throw new Error('Theme id doit être un integer');
    
    try {
        const sql = `
            SELECT * FROM themes
            WHERE id = ?
        `;
        
        const [rows] = await pool.execute(sql, [id]);
        
        if (rows.length === 0) {
            throw new Error('Thème non trouvé');
        }
        
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

