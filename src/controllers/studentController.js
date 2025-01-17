const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

// Fonction pour créer un étudiant
async function createStudent(req, res) {
  const { name, age, courseIds } = req.body;

  if (!name || !age || !courseIds) {
    return res.status(400).json({ error: 'All fields are required: name, age, and courseIds' });
  }

  try {
    // Créer l'étudiant dans MongoDB
    const student = await mongoService.insertOne('students', { name, age, courseIds });

    // Stocker les informations de l'étudiant dans Redis
    await redisService.cacheData(`student:${student._id}`, student, 3600);

    return res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Fonction pour obtenir tous les étudiants
async function getAllStudents(req, res) {
  try {
    const students = await mongoService.getAll('students');
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Fonction pour obtenir un étudiant par ID
async function getStudentById(req, res) {
  const { id } = req.params;

  try {
    // Vérifier dans le cache Redis
    const cachedStudent = await redisService.getCachedData(`student:${id}`);
    if (cachedStudent) {
      return res.status(200).json(JSON.parse(cachedStudent));
    }

    // Si non trouvé dans Redis, vérifier MongoDB
    const student = await mongoService.findOneById('students', id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Mettre en cache l'étudiant récupéré
    await redisService.cacheData(`student:${id}`, student, 3600);

    return res.status(200).json(student);
  } catch (error) {
    console.error('Error retrieving student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Fonction pour mettre à jour un étudiant
async function updateStudent(req, res) {
  const { id } = req.params;
  const { name, age, courseIds } = req.body;

  try {
    const updatedStudent = await mongoService.updateOneById('students', id, { name, age, courseIds });
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Mettre à jour le cache Redis
    await redisService.cacheData(`student:${id}`, updatedStudent, 3600);

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Fonction pour supprimer un étudiant
async function deleteStudent(req, res) {
  const { id } = req.params;

  try {
    const result = await mongoService.deleteOneById('students', id);
    if (!result) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Supprimer le cache Redis associé
    await redisService.deleteCache(`student:${id}`);

    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
