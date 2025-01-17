const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Routes pour les étudiants
// Création
router.post('/', studentController.createStudent); // Créer un étudiant

// Lecture
router.get('/', studentController.getAllStudents); // Récupérer tous les étudiants
router.get('/:id', studentController.getStudentById); // Récupérer un étudiant spécifique

// Mise à jour
router.put('/:id', studentController.updateStudent); // Mettre à jour un étudiant

// Suppression
router.delete('/:id', studentController.deleteStudent); // Supprimer un étudiant

// Export du module de routes
module.exports = router;
