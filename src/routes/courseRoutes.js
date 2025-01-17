// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse :
// - Cela permet de mieux organiser le code, surtout dans des projets de grande taille.
// - Chaque fichier peut se concentrer sur une ressource spécifique (ex. cours, étudiants), rendant le code plus lisible et maintenable.
// - Cela facilite également les tests unitaires et l'extension des fonctionnalités.

// Question : Comment organiser les routes de manière cohérente ?
// Réponse :
// - Grouper les routes selon les actions CRUD (Create, Read, Update, Delete).
// - Placer les routes spécifiques (comme /stats) avant les routes dynamiques (comme /:id) pour éviter les conflits.
// - Utiliser des conventions RESTful pour nommer les endpoints (GET, POST, PUT, DELETE, etc.).

// Import du router express
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
// Création
router.post('/', courseController.createCourse); // Créer un cours

// Lecture
router.get('/', courseController.getAllCourses); // Récupérer tous les cours
router.get('/stats', courseController.getCourseStats); // Obtenir des statistiques sur les cours
router.get('/:id', courseController.getCourseById); // Récupérer un cours spécifique

// Mise à jour
router.put('/:id', courseController.updateCourse); // Mettre à jour un cours

// Suppression
router.delete('/:id', courseController.deleteCourse); // Supprimer un cours

// Export du module de routes
module.exports = router;

// L'ordre des routes est important pour éviter toute confusion. 
// Les routes plus spécifiques (comme /stats) doivent venir avant les routes génériques avec des paramètres dynamiques (comme /:id).
