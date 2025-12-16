import { pool } from '../db/index.js';

// Récupérer le schéma de la table videos pour déterminer le type de l'ID
const getVideoSchema = async () => {
    try {
        const [schemaRows] = await pool.execute('DESCRIBE videos');
        const idColumn = schemaRows.find(col => col.Field === 'id' || col.Field === 'ID');
        return idColumn;
    } catch (error) {
        console.error('Erreur lors de la récupération du schéma:', error);
        return null;
    }
};

// Créer une nouvelle vidéo
export const createVideo = async (videoData) => {
    const { title, theme_id, video_url, duration, size_mb } = videoData;
    
    try {
        // Vérifier le type de la colonne id pour adapter la requête
        const idColumn = await getVideoSchema();
        let query, params, id;
        
        if (idColumn) {
            const typeStr = String(idColumn.Type).toLowerCase();
            const isInteger = typeStr.includes('int') || typeStr.includes('integer');
            
            if (isInteger) {
                // ID est un INTEGER, probablement AUTO_INCREMENT
                query = `
                    INSERT INTO videos (title, theme_id, video_url, duration, size_mb, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                `;
                params = [title, theme_id, video_url, duration, size_mb];
            } else {
                // ID est VARCHAR - générer un ID unique
                id = `video-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                query = `
                    INSERT INTO videos (id, title, theme_id, video_url, duration, size_mb, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
                `;
                params = [id, title, theme_id, video_url, duration, size_mb];
            }
        } else {
            // En cas d'erreur, supposer que id est INTEGER AUTO_INCREMENT
            query = `
                INSERT INTO videos (title, theme_id, video_url, duration, size_mb, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            `;
            params = [title, theme_id, video_url, duration, size_mb];
        }
        
        const [result] = await pool.execute(query, params);
        
        // Si id n'a pas été défini (cas AUTO_INCREMENT), utiliser l'ID généré
        if (!id && result.insertId) {
            id = result.insertId;
        }
        
        return {
            id,
            title,
            theme_id,
            video_url,
            duration,
            size_mb,
            created_at: new Date()
        };
    } catch (error) {
        console.error('Erreur lors de la création de la vidéo:', error);
        throw error;
    }
};

// Récupérer toutes les vidéos
export const getAllVideos = async () => {
    try {
        const query = 'SELECT * FROM videos ORDER BY created_at DESC';
        const [videos] = await pool.execute(query);
        return videos;
    } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
        throw error;
    }
};

// Récupérer une vidéo par son ID
export const getVideoById = async (id) => {
    try {
        const query = 'SELECT * FROM videos WHERE id = ?';
        const [videos] = await pool.execute(query, [id]);
        
        if (videos.length === 0) {
            return null;
        }
        
        return videos[0];
    } catch (error) {
        console.error('Erreur lors de la récupération de la vidéo:', error);
        throw error;
    }
};

// Récupérer l'URL d'une vidéo par son ID (pour la suppression)
export const getVideoUrlById = async (id) => {
    try {
        const query = 'SELECT video_url FROM videos WHERE id = ?';
        const [videos] = await pool.execute(query, [id]);
        
        if (videos.length === 0) {
            return null;
        }
        
        return videos[0].video_url;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'URL de la vidéo:', error);
        throw error;
    }
};

// Mettre à jour une vidéo par son ID
export const updateVideoById = async (id, updateData) => {
    try {
        const { title, theme_id, video_url, duration, size_mb } = updateData;
        
        // Construire dynamiquement la requête UPDATE avec seulement les champs fournis
        const fields = [];
        const values = [];
        
        if (title !== undefined) {
            fields.push('title = ?');
            values.push(title);
        }
        
        if (theme_id !== undefined) {
            fields.push('theme_id = ?');
            values.push(theme_id);
        }
        
        if (video_url !== undefined) {
            fields.push('video_url = ?');
            values.push(video_url);
        }
        
        if (duration !== undefined) {
            fields.push('duration = ?');
            values.push(duration);
        }
        
        if (size_mb !== undefined) {
            fields.push('size_mb = ?');
            values.push(size_mb);
        }
        
        // Si aucun champ à mettre à jour, retourner null
        if (fields.length === 0) {
            return null;
        }
        
        // Ajouter updated_at
        fields.push('updated_at = NOW()');
        
        // Ajouter l'ID à la fin des valeurs
        values.push(id);
        
        const query = `UPDATE videos SET ${fields.join(', ')} WHERE id = ?`;
        await pool.execute(query, values);
        
        // Récupérer la vidéo mise à jour
        return await getVideoById(id);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la vidéo:', error);
        throw error;
    }
};

// Supprimer une vidéo par son ID
export const deleteVideoById = async (id) => {
    try {
        const query = 'DELETE FROM videos WHERE id = ?';
        await pool.execute(query, [id]);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la vidéo:', error);
        throw error;
    }
};

