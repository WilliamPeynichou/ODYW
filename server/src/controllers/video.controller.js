import * as videoService from '../services/video.service.js';
import fs from 'fs';
import path from 'path';
import {
    SUCCESS_MESSAGES,
    CREATED_MESSAGES,
    VALIDATION_ERRORS,
    NOT_FOUND_ERRORS,
    SERVER_ERRORS,
    sendSuccess,
    sendCreated,
    sendValidationError,
    sendNotFound,
    sendServerError
} from '../utils/message.js';

// Contrôleur pour uploader une vidéo
export const uploadVideo = async (req, res) => {
    try {
        // Vérifier si un fichier a été uploadé
        if (!req.file) {
            return sendValidationError(res, VALIDATION_ERRORS.NO_VIDEO_FILE);
        }

        // Les données ont déjà été validées par le middleware Zod
        // req.body contient maintenant des données sûres et typées
        const { title, theme_id } = req.body;

        // Construire l'URL de la vidéo
        const video_url = `/uploads/${req.file.filename}`;
        
        // Calculer la taille en Mo
        const size_mb = (req.file.size / (1024 * 1024)).toFixed(2);
        
        // Récupérer la durée ajoutée par le middleware validateVideoDuration
        const duration = req.file.duration || null;

        // Appeler le service pour créer la vidéo
        const video = await videoService.createVideo({
            title,
            theme_id,
            video_url,
            duration,
            size_mb
        });

        // Retourner les informations de la vidéo uploadée
        sendCreated(res, CREATED_MESSAGES.VIDEO_UPLOADED, video);

    } catch (error) {
        console.error('Erreur lors de l\'upload de la vidéo:', error);
        
        // Supprimer le fichier en cas d'erreur
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });
        }

        sendServerError(res, SERVER_ERRORS.VIDEO_UPLOAD_ERROR, error.message);
    }
};

// Contrôleur pour récupérer toutes les vidéos
export const getAllVideos = async (req, res) => {
    try {
        const videos = await videoService.getAllVideos();
        sendSuccess(res, SUCCESS_MESSAGES.VIDEOS_RETRIEVED, videos);
    } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
        sendServerError(res, SERVER_ERRORS.VIDEOS_RETRIEVAL_ERROR, error.message);
    }
};

// Contrôleur pour récupérer une vidéo par son ID
export const getVideoById = async (req, res) => {
    try {
        // L'ID a été validé par le middleware Zod et est maintenant un nombre entier positif
        const { id } = req.params;

        const video = await videoService.getVideoById(id);

        if (!video) {
            return sendNotFound(res, NOT_FOUND_ERRORS.VIDEO_NOT_FOUND);
        }

        sendSuccess(res, SUCCESS_MESSAGES.VIDEO_RETRIEVED, video);
    } catch (error) {
        console.error('Erreur lors de la récupération de la vidéo:', error);
        sendServerError(res, SERVER_ERRORS.VIDEO_RETRIEVAL_ERROR, error.message);
    }
};

// Contrôleur pour mettre à jour une vidéo
export const updateVideo = async (req, res) => {
    try {
        // L'ID et le body ont été validés par les middlewares Zod
        const { id } = req.params;
        const { title, theme_id } = req.body;

        // Vérifier que la vidéo existe
        const existingVideo = await videoService.getVideoById(id);
        if (!existingVideo) {
            return sendNotFound(res, NOT_FOUND_ERRORS.VIDEO_NOT_FOUND);
        }

        // Préparer les données de mise à jour
        // Les données sont déjà validées par Zod, pas besoin de vérifications supplémentaires
        const updateData = {};

        // Ajouter title si fourni (déjà validé par Zod)
        if (title !== undefined) {
            updateData.title = title;
        }

        // Ajouter theme_id si fourni (déjà validé par Zod)
        if (theme_id !== undefined) {
            updateData.theme_id = theme_id;
        }

        // Si un nouveau fichier vidéo est fourni
        if (req.file) {
            // Construire l'URL de la nouvelle vidéo
            const video_url = `/uploads/${req.file.filename}`;
            
            // Calculer la taille en Mo
            const size_mb = (req.file.size / (1024 * 1024)).toFixed(2);
            
            // Récupérer la durée ajoutée par le middleware validateVideoDuration
            const duration = req.file.duration || null;

            updateData.video_url = video_url;
            updateData.duration = duration;
            updateData.size_mb = size_mb;

            // Supprimer l'ancien fichier vidéo
            const oldVideoPath = path.join(process.cwd(), existingVideo.video_url);
            if (fs.existsSync(oldVideoPath)) {
                fs.unlink(oldVideoPath, (err) => {
                    if (err) {
                        console.error('Erreur lors de la suppression de l\'ancienne vidéo:', err);
                    }
                });
            }
        }

        // Le schéma Zod garantit qu'au moins un champ est fourni
        // Mais on garde cette vérification par sécurité
        if (Object.keys(updateData).length === 0) {
            return sendValidationError(res, VALIDATION_ERRORS.MISSING_FIELDS);
        }

        // Mettre à jour la vidéo
        const updatedVideo = await videoService.updateVideoById(id, updateData);

        if (!updatedVideo) {
            return sendServerError(res, SERVER_ERRORS.VIDEO_UPDATE_ERROR);
        }

        sendSuccess(res, SUCCESS_MESSAGES.VIDEO_UPDATED, updatedVideo);

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la vidéo:', error);
        
        // Supprimer le nouveau fichier en cas d'erreur si un fichier a été uploadé
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });
        }

        sendServerError(res, SERVER_ERRORS.VIDEO_UPDATE_ERROR, error.message);
    }
};

// Contrôleur pour supprimer une vidéo
export const deleteVideo = async (req, res) => {
    try {
        // L'ID a été validé par le middleware Zod
        const { id } = req.params;

        // Récupérer l'URL de la vidéo avant suppression
        const video_url = await videoService.getVideoUrlById(id);

        if (!video_url) {
            return sendNotFound(res, NOT_FOUND_ERRORS.VIDEO_NOT_FOUND);
        }

        // Supprimer la vidéo de la base de données
        await videoService.deleteVideoById(id);

        // Supprimer le fichier du système de fichiers
        const filePath = path.join(process.cwd(), video_url);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du fichier:', err);
                }
            });
        }

        sendSuccess(res, SUCCESS_MESSAGES.VIDEO_DELETED);
    } catch (error) {
        console.error('Erreur lors de la suppression de la vidéo:', error);
        sendServerError(res, SERVER_ERRORS.VIDEO_DELETION_ERROR, error.message);
    }
};
