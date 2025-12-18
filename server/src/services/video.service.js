import { pool } from '../db/index.js';

// fonction pour créer une vidéo
export async function createVideo(videoData){
    // video data en param est egal au titre, theme_id etc
    const { title, theme_id, video_url, duration, size_mb, user_id } = videoData;

    // vairable pour la requete sql
    const sql = `
        INSERT INTO videos (title, theme_id, video_url, duration, size_mb, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // execution de la requete avec la methode execute
    // result est le premier tableau retourné par la requete sql
    const [result] = await pool.execute(sql, [title, theme_id, video_url, duration, size_mb, user_id]);

    // on retourne l'id de la video créée 
    return result.insertId;
}  

// fonction pour récupérer toutes les vidéos
export async function getAllVideos(){
 
    // const sql 
    const sql = `
        SELECT v.*, t.name as theme_name, u.username as user_username, u.email as user_email
        FROM videos v
        LEFT JOIN themes t ON v.theme_id = t.id
        LEFT JOIN users u ON v.user_id = u.id
    `;
    // requete sql pour récupérer toutes les vidéos
    const [rows] = await pool.execute(sql);

    // on retourne le tableau rows
    return rows;
}


// fonction pour récupérer une vidéo par son id
export async function getVideoById(id){

    // sql 
    const sql = `
        SELECT v.*, t.name as theme_name, u.username as user_username, u.email as user_email
        FROM videos v
        LEFT JOIN themes t ON v.theme_id = t.id
        LEFT JOIN users u ON v.user_id = u.id
        WHERE v.id = ?
    `;

    // requete sql pour récupérer une vidéo par son id
    const [rows] = await pool.execute(sql, [id]);

    // variable video = la première ligne du tableau rows
    const video = rows[0];

    // si la video n'est pas trouvée, on throw une erreur
    if (!video) {
        throw new Error('video non trouvée');
    }

    // on retourne la video
    return video;
}

// fonction pour modifier une vidéo
export async function updateVideo(id, videoData){
    // vérifier que la vidéo existe d'abord
    const existingVideo = await getVideoById(id);

    // liste des champs autorisés à être modifiés
    const allowedFields = ['title', 'theme_id'];
    
    // construire les champs à mettre à jour dynamiquement
    const updateFields = [];
    const updateValues = [];

    // parcourir les champs autorisés et ajouter ceux qui sont fournis
    for (const field of allowedFields) {
        if (videoData[field] !== undefined) {
            updateFields.push(`${field} = ?`);
            updateValues.push(videoData[field]);
        }
    }

    // si aucun champ à mettre à jour, retourner la vidéo existante
    if (updateFields.length === 0) {
        return existingVideo;
    }

    // ajouter l'id à la fin des valeurs pour la clause WHERE
    updateValues.push(id);

    // requête SQL pour mettre à jour la vidéo
    const sql = `
        UPDATE videos 
        SET ${updateFields.join(', ')}
        WHERE id = ?
    `;

    // exécution de la requête
    await pool.execute(sql, updateValues);

    // retourner la vidéo mise à jour
    return await getVideoById(id);
}

// fonction pour supprimer une vidéo
export async function deleteVideo(id){
    // vérifier que la vidéo existe d'abord
    const video = await getVideoById(id);

    // requête SQL pour supprimer la vidéo
    const sql = `DELETE FROM videos WHERE id = ?`;

    // exécution de la requête
    await pool.execute(sql, [id]);

    // retourner la vidéo supprimée (pour pouvoir supprimer le fichier)
    return video;
}
