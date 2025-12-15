import { pool } from '../db/index.js';
import fs from 'fs';
import path from 'path';

// Contrôleur pour uploader une vidéo
export const uploadVideo = async (req, res) => {
    try {
        // Vérifier si un fichier a été uploadé
        if (!req.file) {
            return res.status(400).json({
                error: 'Aucun fichier vidéo fourni'
            });
        }

        // Récupérer les données du formulaire (title et theme)
        const { title, theme } = req.body;
        
        if (!title || !theme) {
            // Supprimer le fichier si les données requises sont manquantes
            if (fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Erreur lors de la suppression du fichier:', err);
                });
            }
            return res.status(400).json({
                error: 'Les champs title et theme sont requis'
            });
        }

        // Générer un ID unique pour la vidéo
        const id = `video-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Construire l'URL de la vidéo (chemin relatif ou absolu selon votre configuration)
        const video_url = `/uploads/${req.file.filename}`;
        
        // Calculer la taille en Mo
        const size_mb = (req.file.size / (1024 * 1024)).toFixed(2);
        
        // Récupérer la durée ajoutée par le middleware validateVideoDuration
        const duration = req.file.duration || null;

        // Insérer les métadonnées de la vidéo dans la base de données
        const query = `
            INSERT INTO videos (id, title, theme, video_url, duration, size_mb, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const [result] = await pool.execute(query, [
            id,
            title,
            theme,
            video_url,
            duration,
            size_mb
        ]);

        // Retourner les informations de la vidéo uploadée
        res.status(201).json({
            message: 'Vidéo uploadée avec succès',
            video: {
                id,
                title,
                theme,
                video_url,
                duration,
                size_mb,
                created_at: new Date()
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'upload de la vidéo:', error);
        
        // Supprimer le fichier en cas d'erreur
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });
        }

        res.status(500).json({
            error: 'Erreur lors de l\'upload de la vidéo',
            message: error.message
        });
    }
};

// Contrôleur pour récupérer toutes les vidéos
export const getAllVideos = async (req, res) => {
    try {
        const query = 'SELECT * FROM videos ORDER BY created_at DESC';
        const [videos] = await pool.execute(query);

        res.status(200).json({
            message: 'Vidéos récupérées avec succès',
            videos
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des vidéos',
            message: error.message
        });
    }
};

// Contrôleur pour récupérer une vidéo par son ID
export const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'SELECT * FROM videos WHERE id = ?';
        const [videos] = await pool.execute(query, [id]);

        if (videos.length === 0) {
            return res.status(404).json({
                error: 'Vidéo non trouvée'
            });
        }

        res.status(200).json({
            message: 'Vidéo récupérée avec succès',
            video: videos[0]
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la vidéo:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération de la vidéo',
            message: error.message
        });
    }
};

// Contrôleur pour supprimer une vidéo
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer les informations de la vidéo avant suppression
        const selectQuery = 'SELECT video_url FROM videos WHERE id = ?';
        const [videos] = await pool.execute(selectQuery, [id]);

        if (videos.length === 0) {
            return res.status(404).json({
                error: 'Vidéo non trouvée'
            });
        }

        // Construire le chemin complet du fichier à partir de video_url
        const video_url = videos[0].video_url;
        const filePath = path.join(process.cwd(), video_url);

        // Supprimer la vidéo de la base de données
        const deleteQuery = 'DELETE FROM videos WHERE id = ?';
        await pool.execute(deleteQuery, [id]);

        // Supprimer le fichier du système de fichiers
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du fichier:', err);
                }
            });
        }

        res.status(200).json({
            message: 'Vidéo supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la vidéo:', error);
        res.status(500).json({
            error: 'Erreur lors de la suppression de la vidéo',
            message: error.message
        });
    }
};
