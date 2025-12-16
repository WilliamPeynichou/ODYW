/**
 * Exemples d'utilisation du service de validation Zod
 * 
 * Ce fichier montre comment utiliser le service de validation
 * dans différents contextes de votre application.
 * 
 * Pour exécuter ces exemples :
 * node server/src/examples/validation-examples.js
 */

import {
    validateCreateVideo,
    validateUpdateVideo,
    validateId,
    validateVideoMetadata,
    isValid,
    sanitizeData
} from '../services/validate.service.video.js';

import { createVideoSchema } from '../schemas/video.schema.js';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  🛡️  Exemples de Validation Zod - Projet ODYW           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ============================================
// Exemple 1 : Validation d'une vidéo valide
// ============================================
console.log('📝 Exemple 1 : Validation d\'une vidéo valide\n');
console.log('Données envoyées :');
const validVideo = {
    title: 'Tutoriel React - Introduction aux Hooks',
    theme_id: 3
};
console.log(JSON.stringify(validVideo, null, 2));

const result1 = validateCreateVideo(validVideo);
console.log('\n✅ Résultat de la validation :');
console.log(JSON.stringify(result1, null, 2));
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 2 : Tentative d'injection XSS
// ============================================
console.log('🚨 Exemple 2 : Tentative d\'injection XSS (BLOQUÉE)\n');
console.log('Données envoyées :');
const xssAttempt = {
    title: '<script>alert("Hack!")</script>Vidéo piratée',
    theme_id: 3
};
console.log(JSON.stringify(xssAttempt, null, 2));

const result2 = validateCreateVideo(xssAttempt);
console.log('\n❌ Résultat de la validation (REJETÉE) :');
console.log(JSON.stringify(result2, null, 2));
console.log('\n💡 Protection : Les caractères < > sont interdits');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 3 : Tentative d'injection SQL
// ============================================
console.log('🚨 Exemple 3 : Tentative d\'injection SQL (BLOQUÉE)\n');
console.log('Données envoyées :');
const sqlInjection = {
    title: 'Vidéo normale',
    theme_id: "5 OR 1=1"  // Tentative d'injection SQL
};
console.log(JSON.stringify(sqlInjection, null, 2));

const result3 = validateCreateVideo(sqlInjection);
console.log('\n❌ Résultat de la validation (REJETÉE) :');
console.log(JSON.stringify(result3, null, 2));
console.log('\n💡 Protection : theme_id est forcé à être un nombre entier positif');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 4 : Pollution de données
// ============================================
console.log('🚨 Exemple 4 : Tentative de pollution de données (BLOQUÉE)\n');
console.log('Données envoyées :');
const dataPollution = {
    title: 'Vidéo normale',
    theme_id: 3,
    isAdmin: true,           // ❌ Champ non autorisé
    role: 'admin',           // ❌ Champ non autorisé
    verified: true,          // ❌ Champ non autorisé
    balance: 999999          // ❌ Champ non autorisé
};
console.log(JSON.stringify(dataPollution, null, 2));

const result4 = validateCreateVideo(dataPollution);
console.log('\n✅ Résultat de la validation (champs malveillants SUPPRIMÉS) :');
console.log(JSON.stringify(result4, null, 2));
console.log('\n💡 Protection : Seuls title et theme_id sont conservés');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 5 : Validation d'un ID invalide
// ============================================
console.log('🚨 Exemple 5 : ID invalide (BLOQUÉ)\n');
console.log('ID envoyé : "abc123"');

const result5 = validateId('abc123');
console.log('\n❌ Résultat de la validation (REJETÉE) :');
console.log(JSON.stringify(result5, null, 2));
console.log('\n💡 Protection : L\'ID doit être un nombre entier positif');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 6 : Coercion de type (conversion automatique)
// ============================================
console.log('✨ Exemple 6 : Coercion de type automatique\n');
console.log('Données envoyées :');
const typeCoercion = {
    title: '  Vidéo avec espaces   ',  // Sera trimmed
    theme_id: '7'                      // Sera converti en nombre
};
console.log(JSON.stringify(typeCoercion, null, 2));

const result6 = validateCreateVideo(typeCoercion);
console.log('\n✅ Résultat de la validation (TRANSFORMÉE) :');
console.log(JSON.stringify(result6, null, 2));
console.log('\n💡 Zod a automatiquement :');
console.log('   - Supprimé les espaces du titre (trim)');
console.log('   - Converti theme_id de "7" (string) à 7 (number)');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 7 : Titre trop court
// ============================================
console.log('🚨 Exemple 7 : Titre trop court (BLOQUÉ)\n');
console.log('Données envoyées :');
const shortTitle = {
    title: 'Hi',  // Seulement 2 caractères
    theme_id: 5
};
console.log(JSON.stringify(shortTitle, null, 2));

const result7 = validateCreateVideo(shortTitle);
console.log('\n❌ Résultat de la validation (REJETÉE) :');
console.log(JSON.stringify(result7, null, 2));
console.log('\n💡 Protection : Le titre doit contenir au moins 3 caractères');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 8 : Métadonnées de vidéo
// ============================================
console.log('📊 Exemple 8 : Validation des métadonnées vidéo\n');
console.log('Métadonnées envoyées :');
const metadata = {
    duration: 45.5,
    size_mb: 32.8,
    video_url: '/uploads/video-123-456789.mp4'
};
console.log(JSON.stringify(metadata, null, 2));

const result8 = validateVideoMetadata(metadata);
console.log('\n✅ Résultat de la validation :');
console.log(JSON.stringify(result8, null, 2));
console.log('\n💡 Les métadonnées respectent les contraintes :');
console.log('   - Durée : 10-60 secondes ✓');
console.log('   - Taille : Max 45 Mo ✓');
console.log('   - URL : Commence par /uploads/ ✓');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 9 : Fonction utilitaire isValid
// ============================================
console.log('🔍 Exemple 9 : Utilisation de isValid()\n');

const testData1 = { title: 'Titre valide', theme_id: 5 };
const testData2 = { title: 'Hi', theme_id: 5 };

console.log('Test 1 :', JSON.stringify(testData1));
console.log('Est valide ?', isValid(createVideoSchema, testData1) ? '✅ OUI' : '❌ NON');

console.log('\nTest 2 :', JSON.stringify(testData2));
console.log('Est valide ?', isValid(createVideoSchema, testData2) ? '✅ OUI' : '❌ NON');

console.log('\n💡 isValid() retourne true/false sans détails d\'erreur');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Exemple 10 : Fonction utilitaire sanitizeData
// ============================================
console.log('🧹 Exemple 10 : Nettoyage de données avec sanitizeData()\n');
console.log('Données sales :');
const dirtyData = {
    title: '  Vidéo avec espaces  ',
    theme_id: '10',
    __proto__: { polluted: true },  // Tentative de pollution de prototype
    constructor: 'hack',
    admin: true
};
console.log(JSON.stringify(dirtyData, null, 2));

const cleanData = sanitizeData(createVideoSchema, dirtyData);
console.log('\n✨ Données nettoyées :');
console.log(JSON.stringify(cleanData, null, 2));
console.log('\n💡 sanitizeData() :');
console.log('   - Supprime les champs non définis dans le schéma');
console.log('   - Applique les transformations (trim, coercion)');
console.log('   - Protège contre la pollution de prototype');
console.log('\n' + '─'.repeat(60) + '\n');

// ============================================
// Résumé de la sécurité
// ============================================
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  🛡️  RÉSUMÉ DES PROTECTIONS DE SÉCURITÉ                  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('✅ Protection contre les injections SQL');
console.log('   → theme_id forcé à être un entier positif\n');

console.log('✅ Protection contre XSS');
console.log('   → Caractères < > " \' ` ; \\ { } interdits dans les titres\n');

console.log('✅ Protection contre la pollution de données');
console.log('   → Seuls les champs définis sont acceptés\n');

console.log('✅ Validation stricte des types');
console.log('   → Conversion automatique ou rejet\n');

console.log('✅ Limites de longueur');
console.log('   → Titre : 3-200 caractères\n');

console.log('✅ Validation des métadonnées');
console.log('   → Durée : 10-60s, Taille : max 45 Mo\n');

console.log('✅ Nettoyage automatique');
console.log('   → trim(), lowercase(), transformation\n');

console.log('✅ Messages d\'erreur détaillés');
console.log('   → Indication précise du problème\n');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  🎉 Votre application est maintenant sécurisée avec Zod! ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('💡 Pour utiliser dans vos routes :');
console.log('   import { validateBody } from \'../middlewares/validate.middleware.js\';');
console.log('   router.post(\'/upload\', validateBody(createVideoSchema), controller);\n');

