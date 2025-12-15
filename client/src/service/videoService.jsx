// Service pour générer des vidéos aléatoires

// URLs de vidéos de test disponibles
const VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

// Thumbnails Unsplash variés
const THUMBNAIL_CATEGORIES = [
  'nature', 'landscape', 'mountain', 'ocean', 'forest', 'city', 
  'sunset', 'adventure', 'travel', 'wildlife', 'beach', 'sky',
  'desert', 'waterfall', 'snow', 'tropical', 'urban', 'countryside'
];

// Titres de vidéos possibles
const VIDEO_TITLES = [
  'Aventure en montagne',
  'Plage paradisiaque',
  'Forêt mystérieuse',
  'Coucher de soleil',
  'Voyage en ville',
  'Nature sauvage',
  'Océan infini',
  'Paysage montagneux',
  'Exploration urbaine',
  'Safari africain',
  'Aurores boréales',
  'Cascade majestueuse',
  'Désert de sable',
  'Vie sous-marine',
  'Architecture moderne',
  'Randonnée en forêt',
  'Vue panoramique',
  'Aventure extrême',
  'Paysage tropical',
  'Ville la nuit',
  'Montagne enneigée',
  'Plage au coucher du soleil',
  'Forêt automnale',
  'Voyage en train',
  'Exploration spatiale'
];

// Descriptions possibles
const VIDEO_DESCRIPTIONS = [
  'Découvrez cette magnifique aventure',
  'Un moment de détente au bord de l\'océan',
  'Exploration d\'une forêt enchantée',
  'Un magnifique coucher de soleil',
  'Découvrez la vie urbaine',
  'La beauté de la nature sauvage',
  'L\'immensité de l\'océan',
  'Des paysages à couper le souffle',
  'Une exploration unique',
  'Moment magique capturé',
  'Expérience inoubliable',
  'Beauté naturelle exceptionnelle'
];

/**
 * Génère une vidéo aléatoire
 * @param {number} id - ID unique de la vidéo
 * @returns {Object} Objet vidéo avec propriétés aléatoires
 */
const generateRandomVideo = (id) => {
  const randomVideoUrl = VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)];
  const randomThumbnailCategory = THUMBNAIL_CATEGORIES[Math.floor(Math.random() * THUMBNAIL_CATEGORIES.length)];
  const randomTitle = VIDEO_TITLES[Math.floor(Math.random() * VIDEO_TITLES.length)];
  const randomDescription = VIDEO_DESCRIPTIONS[Math.floor(Math.random() * VIDEO_DESCRIPTIONS.length)];
  
  // Générer un thumbnail aléatoire d'Unsplash avec différentes tailles
  const thumbnailId = Math.floor(Math.random() * 1000);
  const thumbnail = `https://source.unsplash.com/800x450/?${randomThumbnailCategory}&sig=${thumbnailId}`;
  
  // Générer un nombre de likes aléatoire entre 50 et 1000
  const likes = Math.floor(Math.random() * 950) + 50;
  
  // Générer une date aléatoire dans les 30 derniers jours
  const randomDaysAgo = Math.floor(Math.random() * 30);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - randomDaysAgo);
  
  return {
    id,
    title: randomTitle,
    description: randomDescription,
    url: randomVideoUrl,
    thumbnail,
    likes,
    createdAt: createdAt.toISOString()
  };
};

/**
 * Génère un tableau de vidéos aléatoires
 * @param {number} count - Nombre de vidéos à générer (défaut: 20)
 * @returns {Array} Tableau de vidéos aléatoires
 */
export const generateRandomVideos = (count = 20) => {
  const videos = [];
  for (let i = 1; i <= count; i++) {
    videos.push(generateRandomVideo(i));
  }
  
  // Mélanger le tableau pour plus d'aléatoire
  return videos.sort(() => Math.random() - 0.5);
};

/**
 * Simule un appel API pour charger des vidéos aléatoires
 * @param {number} count - Nombre de vidéos à générer
 * @param {number} delay - Délai de simulation en ms (défaut: 500)
 * @returns {Promise<Array>} Promise qui résout avec un tableau de vidéos
 */
export const fetchRandomVideos = async (count = 20, delay = 500) => {
  // Simuler un délai de chargement réseau
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return generateRandomVideos(count);
};

export default {
  generateRandomVideos,
  fetchRandomVideos
};

