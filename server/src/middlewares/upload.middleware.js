import multer from 'multer';
import path from 'path';

// la ou la video sera stockée
const storage = multer.diskStorage({
    // la ou la video sera stockée : la destination
    destination: (req, file, cb) => {
        // dans uploads/videos
        cb(null, 'uploads/videos/');
    },
    // le nom du fichier avec date et extension
    filename: (req, file, cb) => {
        // date, path extame file oroginal name = chemin complet du fichier original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// pour upload la video avec multer
export const uploadVideo = multer({
    // la ou la video sera stockée
    storage: storage,
    // la taille maximale de la video
    limits: {
        fileSize: 45 * 1024 * 1024
    },
    // filtrer les types de fichiers autorisés
    fileFilter: (req, file, cb) => {
        // types de fichier autorises dans une variable allowedtypes
        const allowedTypes = /\.(mp4|avi|mov|wmv|flv|mkv)$/i;

        // mime type est le type de fichier autorisé dans un tableau
        const allowedMimeTypes = [
            'video/mp4',  //MP4
            'video/x-msvideo', //AVI
            'video/avi', //AVI 
            'video/quicktime', //MOV
            'video/x-ms-wmv', //WMV
            'video/x-flv', //FLV
            'video/x-matroska', //MKV
        ];

        // test si l'extension du fichier est autorisée
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        // test si le type de fichier est autorisé
        const mimetype = allowedMimeTypes.includes(file.mimetype);

        // si l'extension et le type de fichier sont autorisés, on retourne true
        if(extname && mimetype) {
            return cb(null, true);
        }else{
            // sinon on retourne une erreur
            return cb(new Error('Type de fichier non autorisé'));
        }
    }
});