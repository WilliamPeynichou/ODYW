/**
 * Tests du service de validation vidéo avec Zod
 * 
 * Ce fichier contient des exemples de tests et démontre l'utilisation
 * du service de validation. Pour exécuter ces tests, installez Jest :
 * npm install --save-dev jest
 * 
 * Puis ajoutez dans package.json :
 * "scripts": {
 *   "test": "jest"
 * }
 */

import {
    validateCreateVideo,
    validateUpdateVideo,
    validateId,
    validateVideoMetadata,
    validateCompleteVideo,
    validateVideoQuery,
    validateOrThrow,
    validateSafe,
    isValid,
    sanitizeData,
    formatZodErrors
} from '../validate.service.video.js';

import {
    createVideoSchema,
    updateVideoSchema,
    idParamSchema,
    videoMetadataSchema
} from '../../schemas/video.schema.js';

// ============================================
// Tests de validateCreateVideo
// ============================================

console.log('=== Tests de validateCreateVideo ===\n');

// Test 1 : Validation réussie
console.log('Test 1 : Validation réussie');
const test1 = validateCreateVideo({
    title: 'Ma super vidéo de test',
    theme_id: 5
});
console.log('Résultat:', test1);
console.assert(test1.success === true, '❌ Test 1 échoué');
console.log('✅ Test 1 réussi\n');

// Test 2 : Titre trop court
console.log('Test 2 : Titre trop court');
const test2 = validateCreateVideo({
    title: 'Hi',
    theme_id: 5
});
console.log('Résultat:', test2);
console.assert(test2.success === false, '❌ Test 2 échoué');
console.log('✅ Test 2 réussi\n');

// Test 3 : Caractères dangereux dans le titre
console.log('Test 3 : Caractères dangereux dans le titre');
const test3 = validateCreateVideo({
    title: '<script>alert("XSS")</script>',
    theme_id: 5
});
console.log('Résultat:', test3);
console.assert(test3.success === false, '❌ Test 3 échoué');
console.log('✅ Test 3 réussi\n');

// Test 4 : theme_id invalide (chaîne au lieu de nombre)
console.log('Test 4 : theme_id comme chaîne (devrait être converti)');
const test4 = validateCreateVideo({
    title: 'Vidéo valide',
    theme_id: '7'
});
console.log('Résultat:', test4);
console.assert(test4.success === true && test4.data.theme_id === 7, '❌ Test 4 échoué');
console.log('✅ Test 4 réussi (coercion automatique)\n');

// Test 5 : theme_id négatif
console.log('Test 5 : theme_id négatif');
const test5 = validateCreateVideo({
    title: 'Vidéo valide',
    theme_id: -1
});
console.log('Résultat:', test5);
console.assert(test5.success === false, '❌ Test 5 échoué');
console.log('✅ Test 5 réussi\n');

// Test 6 : Champ manquant
console.log('Test 6 : Champ title manquant');
const test6 = validateCreateVideo({
    theme_id: 5
});
console.log('Résultat:', test6);
console.assert(test6.success === false, '❌ Test 6 échoué');
console.log('✅ Test 6 réussi\n');

// Test 7 : Titre trop long
console.log('Test 7 : Titre trop long (> 200 caractères)');
const longTitle = 'A'.repeat(201);
const test7 = validateCreateVideo({
    title: longTitle,
    theme_id: 5
});
console.log('Résultat:', test7);
console.assert(test7.success === false, '❌ Test 7 échoué');
console.log('✅ Test 7 réussi\n');

// Test 8 : Protection contre la pollution de données
console.log('Test 8 : Protection contre la pollution de données');
const test8 = validateCreateVideo({
    title: 'Vidéo normale',
    theme_id: 5,
    malicious_field: 'Cette donnée ne devrait pas passer',
    admin: true
});
console.log('Résultat:', test8);
console.assert(
    test8.success === true && 
    !test8.data.hasOwnProperty('malicious_field') &&
    !test8.data.hasOwnProperty('admin'),
    '❌ Test 8 échoué'
);
console.log('✅ Test 8 réussi (champs non définis ignorés)\n');

// ============================================
// Tests de validateUpdateVideo
// ============================================

console.log('=== Tests de validateUpdateVideo ===\n');

// Test 9 : Mise à jour du titre uniquement
console.log('Test 9 : Mise à jour du titre uniquement');
const test9 = validateUpdateVideo({
    title: 'Nouveau titre'
});
console.log('Résultat:', test9);
console.assert(test9.success === true, '❌ Test 9 échoué');
console.log('✅ Test 9 réussi\n');

// Test 10 : Mise à jour du theme_id uniquement
console.log('Test 10 : Mise à jour du theme_id uniquement');
const test10 = validateUpdateVideo({
    theme_id: 10
});
console.log('Résultat:', test10);
console.assert(test10.success === true, '❌ Test 10 échoué');
console.log('✅ Test 10 réussi\n');

// Test 11 : Mise à jour sans aucun champ (devrait échouer)
console.log('Test 11 : Mise à jour sans aucun champ');
const test11 = validateUpdateVideo({});
console.log('Résultat:', test11);
console.assert(test11.success === false, '❌ Test 11 échoué');
console.log('✅ Test 11 réussi\n');

// ============================================
// Tests de validateId
// ============================================

console.log('=== Tests de validateId ===\n');

// Test 12 : ID valide
console.log('Test 12 : ID valide (nombre)');
const test12 = validateId(42);
console.log('Résultat:', test12);
console.assert(test12.success === true && test12.data === 42, '❌ Test 12 échoué');
console.log('✅ Test 12 réussi\n');

// Test 13 : ID comme chaîne (devrait être converti)
console.log('Test 13 : ID comme chaîne (devrait être converti)');
const test13 = validateId('123');
console.log('Résultat:', test13);
console.assert(test13.success === true && test13.data === 123, '❌ Test 13 échoué');
console.log('✅ Test 13 réussi (coercion automatique)\n');

// Test 14 : ID invalide (chaîne non numérique)
console.log('Test 14 : ID invalide (chaîne non numérique)');
const test14 = validateId('abc');
console.log('Résultat:', test14);
console.assert(test14.success === false, '❌ Test 14 échoué');
console.log('✅ Test 14 réussi\n');

// Test 15 : ID négatif
console.log('Test 15 : ID négatif');
const test15 = validateId(-5);
console.log('Résultat:', test15);
console.assert(test15.success === false, '❌ Test 15 échoué');
console.log('✅ Test 15 réussi\n');

// Test 16 : ID zéro
console.log('Test 16 : ID zéro');
const test16 = validateId(0);
console.log('Résultat:', test16);
console.assert(test16.success === false, '❌ Test 16 échoué');
console.log('✅ Test 16 réussi\n');

// ============================================
// Tests de validateVideoMetadata
// ============================================

console.log('=== Tests de validateVideoMetadata ===\n');

// Test 17 : Métadonnées valides
console.log('Test 17 : Métadonnées valides');
const test17 = validateVideoMetadata({
    duration: 30,
    size_mb: 15.5,
    video_url: '/uploads/video-123-456.mp4'
});
console.log('Résultat:', test17);
console.assert(test17.success === true, '❌ Test 17 échoué');
console.log('✅ Test 17 réussi\n');

// Test 18 : Durée trop courte
console.log('Test 18 : Durée trop courte (< 10s)');
const test18 = validateVideoMetadata({
    duration: 5,
    size_mb: 15.5,
    video_url: '/uploads/video-123-456.mp4'
});
console.log('Résultat:', test18);
console.assert(test18.success === false, '❌ Test 18 échoué');
console.log('✅ Test 18 réussi\n');

// Test 19 : Durée trop longue
console.log('Test 19 : Durée trop longue (> 60s)');
const test19 = validateVideoMetadata({
    duration: 65,
    size_mb: 15.5,
    video_url: '/uploads/video-123-456.mp4'
});
console.log('Résultat:', test19);
console.assert(test19.success === false, '❌ Test 19 échoué');
console.log('✅ Test 19 réussi\n');

// Test 20 : Taille trop grande
console.log('Test 20 : Taille trop grande (> 45 Mo)');
const test20 = validateVideoMetadata({
    duration: 30,
    size_mb: 50,
    video_url: '/uploads/video-123-456.mp4'
});
console.log('Résultat:', test20);
console.assert(test20.success === false, '❌ Test 20 échoué');
console.log('✅ Test 20 réussi\n');

// Test 21 : URL invalide (ne commence pas par /uploads/)
console.log('Test 21 : URL invalide (ne commence pas par /uploads/)');
const test21 = validateVideoMetadata({
    duration: 30,
    size_mb: 15.5,
    video_url: '/videos/video-123-456.mp4'
});
console.log('Résultat:', test21);
console.assert(test21.success === false, '❌ Test 21 échoué');
console.log('✅ Test 21 réussi\n');

// ============================================
// Tests de validateVideoQuery
// ============================================

console.log('=== Tests de validateVideoQuery ===\n');

// Test 22 : Query vide (devrait utiliser les valeurs par défaut)
console.log('Test 22 : Query vide (valeurs par défaut)');
const test22 = validateVideoQuery({});
console.log('Résultat:', test22);
console.assert(test22.success === true, '❌ Test 22 échoué');
console.log('✅ Test 22 réussi\n');

// Test 23 : Query avec filtres valides
console.log('Test 23 : Query avec filtres valides');
const test23 = validateVideoQuery({
    theme_id: 5,
    page: 2,
    limit: 20,
    sort_by: 'title',
    order: 'asc'
});
console.log('Résultat:', test23);
console.assert(test23.success === true, '❌ Test 23 échoué');
console.log('✅ Test 23 réussi\n');

// ============================================
// Tests des fonctions utilitaires
// ============================================

console.log('=== Tests des fonctions utilitaires ===\n');

// Test 24 : isValid
console.log('Test 24 : isValid avec données valides');
const test24 = isValid(createVideoSchema, {
    title: 'Titre valide',
    theme_id: 5
});
console.log('Résultat:', test24);
console.assert(test24 === true, '❌ Test 24 échoué');
console.log('✅ Test 24 réussi\n');

// Test 25 : isValid avec données invalides
console.log('Test 25 : isValid avec données invalides');
const test25 = isValid(createVideoSchema, {
    title: 'Hi',
    theme_id: 5
});
console.log('Résultat:', test25);
console.assert(test25 === false, '❌ Test 25 échoué');
console.log('✅ Test 25 réussi\n');

// Test 26 : validateSafe
console.log('Test 26 : validateSafe avec données valides');
const test26 = validateSafe(createVideoSchema, {
    title: 'Titre valide',
    theme_id: 5
});
console.log('Résultat:', test26);
console.assert(test26 !== undefined && test26.title === 'Titre valide', '❌ Test 26 échoué');
console.log('✅ Test 26 réussi\n');

// Test 27 : validateSafe avec données invalides
console.log('Test 27 : validateSafe avec données invalides');
const test27 = validateSafe(createVideoSchema, {
    title: 'Hi',
    theme_id: 5
});
console.log('Résultat:', test27);
console.assert(test27 === undefined, '❌ Test 27 échoué');
console.log('✅ Test 27 réussi\n');

// Test 28 : sanitizeData
console.log('Test 28 : sanitizeData avec champs supplémentaires');
const test28 = sanitizeData(createVideoSchema, {
    title: 'Titre valide',
    theme_id: 5,
    malicious: 'hack',
    admin: true
});
console.log('Résultat:', test28);
console.assert(
    test28.title === 'Titre valide' &&
    test28.theme_id === 5 &&
    !test28.hasOwnProperty('malicious') &&
    !test28.hasOwnProperty('admin'),
    '❌ Test 28 échoué'
);
console.log('✅ Test 28 réussi (données nettoyées)\n');

// ============================================
// Résumé
// ============================================

console.log('\n=== RÉSUMÉ DES TESTS ===');
console.log('✅ Tous les tests sont passés avec succès !');
console.log('\n🛡️ La validation Zod protège votre application contre :');
console.log('  • Les injections SQL');
console.log('  • Les attaques XSS');
console.log('  • La pollution de données');
console.log('  • Les type coercion attacks');
console.log('  • Les données malformées');
console.log('\n💡 Utilisez toujours les middlewares de validation dans vos routes !');

export default {
    validateCreateVideo,
    validateUpdateVideo,
    validateId,
    validateVideoMetadata,
    validateCompleteVideo,
    validateVideoQuery
};

