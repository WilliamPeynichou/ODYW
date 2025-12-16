import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import fs from 'fs';

// Configurer le chemin vers ffmpeg et ffprobe
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

/**
 * Calcule le FPS à partir d'une chaîne de fraction (ex: "30/1" ou "25/1")
 * @param {string} frameRate - Chaîne de fraction représentant le FPS
 * @returns {number|null} - FPS calculé ou null si invalide
 */
const calculateFPS = (frameRate) => {
    if (!frameRate || typeof frameRate !== 'string') {
        return null;
    }
    
    const parts = frameRate.split('/');
    if (parts.length !== 2) {
        return null;
    }
    
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        return null;
    }
    
    return numerator / denominator;
};

/**
 * Récupère les métadonnées d'une vidéo en utilisant ffprobe
 * @param {string} videoPath - Chemin vers le fichier vidéo
 * @returns {Promise<Object>} - Métadonnées de la vidéo
 * @throws {Error} - Si l'analyse de la vidéo échoue
 */
export const getVideoMetadata = (videoPath) => {
    return new Promise((resolve, reject) => {
        // Vérifier que le fichier existe
        if (!fs.existsSync(videoPath)) {
            return reject(new Error('Le fichier vidéo n\'existe pas'));
        }

        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                console.error('Erreur ffprobe:', err.message);
                console.error('Stack:', err.stack);
                return reject(new Error(`Impossible d'analyser la vidéo: ${err.message}`));
            }

            // Vérifier que les métadonnées sont valides
            if (!metadata || !metadata.format) {
                return reject(new Error('Métadonnées de la vidéo invalides ou incomplètes'));
            }

            resolve(metadata);
        });
    });
};

/**
 * Vérifie que la durée de la vidéo est valide (entre minDuration et maxDuration secondes)
 * @param {string} videoPath - Chemin vers le fichier vidéo
 * @param {number} minDuration - Durée minimale en secondes (défaut: 10)
 * @param {number} maxDuration - Durée maximale en secondes (défaut: 60)
 * @returns {Promise<number>} - Durée de la vidéo en secondes
 * @throws {Error} - Si la durée n'est pas valide ou si l'analyse échoue
 */
export const validateVideoDuration = async (videoPath, minDuration = 10, maxDuration = 60) => {
    try {
        const metadata = await getVideoMetadata(videoPath);

        // Vérifier que la durée existe et est un nombre
        if (!metadata.format || typeof metadata.format.duration !== 'number') {
            throw new Error('Impossible d\'obtenir la durée de la vidéo. Le fichier peut être corrompu ou invalide.');
        }

        const duration = metadata.format.duration;

        // Vérifier que la durée est dans la plage autorisée
        if (duration < minDuration || duration > maxDuration) {
            throw new Error(`La durée de la vidéo doit être entre ${minDuration} secondes et ${maxDuration} secondes. Durée actuelle: ${duration.toFixed(2)}s`);
        }

        return duration;
    } catch (error) {
        throw error;
    }
};

/**
 * Vérifie que la vidéo a des métadonnées valides
 * @param {string} videoPath - Chemin vers le fichier vidéo
 * @returns {Promise<Object>} - Métadonnées de la vidéo
 * @throws {Error} - Si les métadonnées sont invalides
 */
export const validateVideoMetadata = async (videoPath) => {
    try {
        const metadata = await getVideoMetadata(videoPath);

        // Vérifications supplémentaires des métadonnées
        if (!metadata.format) {
            throw new Error('Format de la vidéo non détecté');
        }

        // Vérifier qu'il y a au moins un stream vidéo
        const videoStreams = metadata.streams?.filter(stream => stream.codec_type === 'video') || [];
        if (videoStreams.length === 0) {
            throw new Error('Aucun stream vidéo détecté dans le fichier');
        }

        return metadata;
    } catch (error) {
        throw error;
    }
};

/**
 * Récupère les informations complètes d'une vidéo (durée, codec, résolution, etc.)
 * @param {string} videoPath - Chemin vers le fichier vidéo
 * @returns {Promise<Object>} - Informations complètes de la vidéo
 */
export const getVideoInfo = async (videoPath) => {
    try {
        const metadata = await getVideoMetadata(videoPath);
        
        const videoStream = metadata.streams?.find(stream => stream.codec_type === 'video');
        const audioStream = metadata.streams?.find(stream => stream.codec_type === 'audio');

        return {
            duration: metadata.format.duration,
            size: metadata.format.size,
            bitrate: metadata.format.bit_rate,
            format: metadata.format.format_name,
            video: videoStream ? {
                codec: videoStream.codec_name,
                width: videoStream.width,
                height: videoStream.height,
                fps: videoStream.r_frame_rate ? calculateFPS(videoStream.r_frame_rate) : null,
                bitrate: videoStream.bit_rate
            } : null,
            audio: audioStream ? {
                codec: audioStream.codec_name,
                sampleRate: audioStream.sample_rate,
                channels: audioStream.channels,
                bitrate: audioStream.bit_rate
            } : null
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Vérifie complètement une vidéo (métadonnées + durée)
 * @param {string} videoPath - Chemin vers le fichier vidéo
 * @param {number} minDuration - Durée minimale en secondes (défaut: 10)
 * @param {number} maxDuration - Durée maximale en secondes (défaut: 60)
 * @returns {Promise<Object>} - Informations de la vidéo validée
 * @throws {Error} - Si la validation échoue
 */
export const validateVideo = async (videoPath, minDuration = 10, maxDuration = 60) => {
    try {
        // Vérifier les métadonnées
        await validateVideoMetadata(videoPath);
        
        // Vérifier la durée
        const duration = await validateVideoDuration(videoPath, minDuration, maxDuration);

        // Récupérer les informations complètes
        const info = await getVideoInfo(videoPath);

        return {
            duration,
            ...info,
            isValid: true
        };
    } catch (error) {
        throw error;
    }
};

