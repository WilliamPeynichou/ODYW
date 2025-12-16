// import de ffmpeg pour avoir la durée dla video
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'; 
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';

// configurer les chemins vers ffmpeg et ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// fonction pour obtenir la durée réelle d'une vidéo en secondes
// avec videoPath en param on met le chemin du fichier de la requete dans le controller
export async function getVideoDuration(videoPath) {
    // return une nouvelle instance de promise avec resovle et rejet en param
    return new Promise((resolve, reject) => {
        // dans ffmpeg on utilise ffprobe pour avoir la durée dla video
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                reject(new Error(`Impossible de lire la vidéo: ${err.message}`));
            } else {
                // metadata.format.duration est en secondes (décimal)
                const duration = Math.floor(metadata.format.duration);
                resolve(duration);
            }
        });
    });
}