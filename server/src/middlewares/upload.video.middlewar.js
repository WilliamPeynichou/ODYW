import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    VALIDATION_ERRORS,
    sendValidationError
} from '../utils/message.js';
import { validateVideoDuration as validateVideoDurationUtil } from '../utils/video.verif.js';

// logique de stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // destination de stockage des fichiers
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        // extension du fichier
        const ext = path.extname(file.originalname);
        // nom du fichier avec l'id de la video et la date de creation
        // Vérifier si req.params.id existe, sinon utiliser un identifiant unique
        const videoId = req.params?.id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const filename = `video-${videoId}-${Date.now()}${ext}`;
        cb(null, filename);
    },
});


// filtre pour les fichiers video
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Le fichier n\'est pas un fichier video'), false);
    }
};


// multer pour upload les fichiers avec limite de taille (45 Mo)
const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 45 * 1024 * 1024 // 45 Mo en octets
    }
});

// Middleware pour vérifier la durée de la vidéo (10s à 60s)
const validateVideoDuration = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const videoPath = req.file.path;

    try {
        // Utiliser la fonction de vérification du module video.verif.js
        const duration = await validateVideoDurationUtil(videoPath, 10, 60);
        
        // Ajouter la durée à la requête pour utilisation ultérieure si nécessaire
        req.file.duration = duration;
        next();
    } catch (error) {
        // Supprimer le fichier en cas d'erreur
        if (fs.existsSync(videoPath)) {
            fs.unlink(videoPath, () => {});
        }

        // Gérer les différents types d'erreurs
        if (error.message.includes('durée')) {
            // Extraire la durée de l'erreur si possible
            const durationMatch = error.message.match(/Durée actuelle: ([\d.]+)s/);
            const duration = durationMatch ? parseFloat(durationMatch[1]) : null;
            
            if (duration !== null) {
                return sendValidationError(res, VALIDATION_ERRORS.INVALID_VIDEO_DURATION(duration));
            }
            return sendValidationError(res, VALIDATION_ERRORS.INVALID_VIDEO_DURATION(0));
        } else if (error.message.includes('métadonnées') || error.message.includes('Métadonnées')) {
            return sendValidationError(res, VALIDATION_ERRORS.INVALID_VIDEO_METADATA);
        } else {
            return sendValidationError(
                res,
                VALIDATION_ERRORS.INVALID_VIDEO_ANALYSIS,
                process.env.NODE_ENV === 'development' ? error.message : undefined
            );
        }
    }
};

// export du middleware
export default upload;
export { validateVideoDuration };