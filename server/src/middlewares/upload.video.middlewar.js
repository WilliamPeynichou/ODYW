import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

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
const validateVideoDuration = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const videoPath = req.file.path;

    ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
            // Supprimer le fichier en cas d'erreur
            if (fs.existsSync(videoPath)) {
                fs.unlink(videoPath, () => {}); // Suppression asynchrone, ignorer les erreurs
            }
            return res.status(400).json({ 
                error: 'Impossible d\'analyser la vidéo. Veuillez vérifier que le fichier est valide.' 
            });
        }

        // Vérifier que les métadonnées et la durée existent
        if (!metadata || !metadata.format || typeof metadata.format.duration !== 'number') {
            // Supprimer le fichier si les métadonnées sont incomplètes
            if (fs.existsSync(videoPath)) {
                fs.unlink(videoPath, () => {}); // Suppression asynchrone, ignorer les erreurs
            }
            return res.status(400).json({ 
                error: 'Impossible d\'obtenir la durée de la vidéo. Le fichier peut être corrompu ou invalide.' 
            });
        }

        const duration = metadata.format.duration; // durée en secondes

        if (duration < 10 || duration > 60) {
            // Supprimer le fichier si la durée n'est pas valide
            if (fs.existsSync(videoPath)) {
                fs.unlink(videoPath, () => {}); // Suppression asynchrone, ignorer les erreurs
            }
            return res.status(400).json({ 
                error: `La durée de la vidéo doit être entre 10 secondes et 60 secondes. Durée actuelle: ${duration.toFixed(2)}s` 
            });
        }

        // Ajouter la durée à la requête pour utilisation ultérieure si nécessaire
        req.file.duration = duration;
        next();
    });
};

// export du middleware
export default upload;
export { validateVideoDuration };