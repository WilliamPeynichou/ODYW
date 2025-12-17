import { createVideo, getVideoById, getAllVideos, updateVideo, deleteVideo } from "../services/video.service.js";
// import de la fonction getvideoduration pour avoir la durée dla video
import { getVideoDuration } from "../utils/video.util.js";  
// import de fs pour supprimer le fichier si invalide
import fs from 'fs';  

export const rateVideo = async (req, res) => {
    const videoId = req.params.id;
    const { rating } = req.body; // On attend { "rating": 4 } par exemple
    const userId = req.user ? req.user.id : 1; // ID du user connecté

    // Validation simple (1 à 5)
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "La note doit être entre 1 et 5" });
    }

    try {
        // La requête magique (Upsert)
        await db.query(
            `INSERT INTO ratings (video_id, user_id, rating) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
            [videoId, userId, rating]
        );

        // Optionnel : On recalcule la moyenne immédiatement pour l'afficher
        const [stats] = await db.query(
            'SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE video_id = ?',
            [videoId]
        );

        res.json({ 
            message: "Note enregistrée", 
            newAverage: stats[0].average,
            count: stats[0].count 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// controller pour créer une vidéo
export const createVideoController = async (req, res) => {

    // try and catch 
    try {
        // si pas de fichier dans la requete, error
        if(!req.file) {
            return res.status(400).json({ 
                message: 'Aucune vidéo trouvée',
            });
        }

        // variable realDuration pour avoir la durée réelle de la vidéo
        let realDuration;
        // try and catch pour avoir la durée réelle de la vidéo
        try {
            // readuration = attend la promise de la fonction getvideoduration
            // et en param on met le chemin du fichier dla requete
            realDuration = await getVideoDuration(req.file.path);
        } catch (error) {
            // si erreur, supprimer le fichier et renvoyer une erreur 
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: 'Erreur lors de la lecture de la vidéo',
                error: error.message
            });
        }

        // valider que la durée est entre 10 et 60 secondes
        // si la durée est inférieure à 10, supprile le fichier et renvoyer une erreur
        if (realDuration < 10) {
            // unlinkSync pour supprimer le fichier, on supprime le fichier de la requete
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `La durée de la vidéo (${realDuration}s) est trop courte. Minimum: 10 secondes`
            });
        }

        // si la durée est supérieuré à 60
        if (realDuration > 60) {
            // unlinkSync pour supprimer le fichier, on supprime le fichier de la requete
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `La durée de la vidéo (${realDuration}s) est trop longue. Maximum: 60 secondes`
            });
        }

        // variable videoData pour créer la vidéo
        // title theme_id sont en req.body, duration est ma variable realDuration, size_mb est la taille du fichier 
        // et video_url est le chemin du ficher de la requete
        const videoData = {
            title: req.body.title || null,
            theme_id: parseInt(req.body.theme_id) || null,
            video_url: req.file.path,
            duration: realDuration, 
            size_mb: parseFloat(req.file.size / 1024 / 1024),
        }

        // video attend la promise de la fonction createVideo avec videoData en param
        const video = await createVideo(videoData);
        // videoCreated attend la prmise de la fonction getVideoById avec video en param
        // j'utilise ca pour récup la video crée avec son id et je la renvoie dans la reponse
        const videoCreated = await getVideoById(video);

        res.status(201).json({
            message: 'video crée avec succès',
            video: videoCreated
        });
    } catch(error){
        // si erreur après l'upload, supprimer le fichier
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            message: 'Erreur lors de la création de la vidéo',
            error: error.message,
        });
    }
}

// endpoint pour récupérer toutes les vidéos
export const getAllVideosController = async (req, res) => {
    try{
        // attend la promise de la fonction getALLvideos
        const videos = await getAllVideos();
        res.status(200).json({
            message: 'Toutes les vidéos ont été récupérées avec succès',
            videos: videos,
        });
    }
    catch(error){
        res.status(500).json({
            message: 'Erreur lors de la récupération de toutes les vidéos',
            error: error.message,
        });
    }
}

// endpoint pour récupérer une video par son id
export const getVideoByIdController = async (req, res) => {

    try {
        // on récup le id de la video dans la requete
        const { id } = req.params;
        // video attend la promise de la fonction getVideoById avec id en param
        const video = await getVideoById(id);

        res.status(200).json({
            message: `video n° ${id} trouvée avec succès`,
            video: video,
        });
    }catch(error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération de la vidéo',
            error: error.message,
        });
    }
}

// controller pour modifier une vidéo
export const updateVideoController = async (req, res) => {
    try {
        // récupérer l'id de la vidéo dans les paramètres
        const { id } = req.params;

        // vérifier que la vidéo existe
        const existingVideo = await getVideoById(id);

        // variable pour stocker les données à mettre à jour
        const updateData = {};

        // si un nouveau fichier est fourni
        if (req.file) {
            // variable realDuration pour avoir la durée réelle de la nouvelle vidéo
            let realDuration;
            try {
                // realDuration = attend la promise de la fonction getVideoDuration
                // et en param on met le chemin du fichier de la requête
                realDuration = await getVideoDuration(req.file.path);
            } catch (error) {
                // si erreur, supprimer le nouveau fichier et renvoyer une erreur
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    message: 'Erreur lors de la lecture de la vidéo',
                    error: error.message
                });
            }

            // valider que la durée est entre 10 et 60 secondes
            if (realDuration < 10) {
                // unlinkSync pour supprimer le fichier
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    message: `La durée de la vidéo (${realDuration}s) est trop courte. Minimum: 10 secondes`
                });
            }

            if (realDuration > 60) {
                // unlinkSync pour supprimer le fichier
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    message: `La durée de la vidéo (${realDuration}s) est trop longue. Maximum: 60 secondes`
                });
            }

            // supprimer l'ancien fichier vidéo s'il existe
            if (existingVideo.video_url && fs.existsSync(existingVideo.video_url)) {
                fs.unlinkSync(existingVideo.video_url);
            }

            // toujours dans la condition si request fichier, on ajoute les nouvelles données de la vidéo
            updateData.video_url = req.file.path;
            updateData.duration = realDuration;
            updateData.size_mb = parseFloat(req.file.size / 1024 / 1024);
        }

        // si title est fourni dans le body, l'ajouter aux données à mettre à jour
        if (req.body.title !== undefined) {
            updateData.title = req.body.title || null;
        }

        // si theme_id est fourni dans le body, l'ajouter aux données à mettre à jour
        if (req.body.theme_id !== undefined) {
            updateData.theme_id = parseInt(req.body.theme_id) || null;
        }

        // mettre à jour la vidéo avec les nouvelles données
        const updatedVideo = await updateVideo(id, updateData);

        res.status(200).json({
            message: 'Vidéo modifiée avec succès',
            video: updatedVideo
        });
    } catch (error) {
        // si erreur après l'upload d'un nouveau fichier, supprimer le fichier
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // si l'erreur est "video non trouvée", retourner 404
        if (error.message === 'video non trouvée') {
            return res.status(404).json({
                message: 'Vidéo non trouvée',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la modification de la vidéo',
            error: error.message
        });
    }
}

// controller pour supprimer une vidéo
export const deleteVideoController = async (req, res) => {
    try {
        // récupérer l'id de la vidéo dans les paramètres
        const { id } = req.params;

        // supprimer la vidéo de la base de données (cette fonction vérifie aussi l'existence)
        const deletedVideo = await deleteVideo(id);

        // supprimer le fichier vidéo du système de fichiers s'il existe
        if (deletedVideo.video_url && fs.existsSync(deletedVideo.video_url)) {
            fs.unlinkSync(deletedVideo.video_url);
        }

        res.status(200).json({
            message: 'Vidéo supprimée avec succès',
            video: deletedVideo
        });
    } catch (error) {
        // si l'erreur est "video non trouvée", retourner 404
        if (error.message === 'video non trouvée') {
            return res.status(404).json({
                message: 'Vidéo non trouvée',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la suppression de la vidéo',
            error: error.message
        });
    }
}