// Question: Pourquoi créer des services séparés ?
// Réponse:
// Créer des services séparés permet de centraliser la logique métier et de réutiliser les fonctions dans tout le projet.
// Cela améliore la maintenabilité, la modularité et facilite les tests unitaires de chaque fonction.

const { ObjectId } = require('mongodb');
const dbConnection = require('../config/db'); // Importer le module de connexion

// Fonctions utilitaires pour MongoDB

/**
 * Trouver un document par ID dans une collection donnée.
 * @param {string} collection - Le nom de la collection.
 * @param {string} id - L'ID du document.
 * @returns {Promise<Object|null>} Le document trouvé ou null.
 */
async function findOneById(collection, id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  return await db.collection(collection).findOne({ _id: new ObjectId(id) });
}

/**
 * Récupérer tous les documents d'une collection donnée.
 * @param {string} collection - Le nom de la collection.
 * @returns {Promise<Array>} Un tableau de documents.
 */
async function getAll(collection) {
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  return await db.collection(collection).find().toArray();
}

/**
 * Insérer un document dans une collection donnée.
 * @param {string} collection - Le nom de la collection.
 * @param {Object} data - Les données à insérer.
 * @returns {Promise<Object>} Le document inséré.
 */
async function insertOne(collection, data) {
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  const result = await db.collection(collection).insertOne(data);
  return { ...data, _id: result.insertedId };
}

/**
 * Mettre à jour un document par ID dans une collection donnée.
 * @param {string} collection - Le nom de la collection.
 * @param {string} id - L'ID du document à mettre à jour.
 * @param {Object} updates - Les champs à mettre à jour.
 * @returns {Promise<Object|null>} Le document mis à jour ou null.
 */
async function updateOneById(collection, id, updates) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  const result = await db
    .collection(collection)
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: 'after' });
  return result.value;
}

/**
 * Supprimer un document par ID dans une collection donnée.
 * @param {string} collection - Le nom de la collection.
 * @param {string} id - L'ID du document à supprimer.
 * @returns {Promise<boolean>} true si la suppression a réussi, sinon false.
 */
async function deleteOneById(collection, id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Obtenir le nombre total de documents d'une collection.
 * @param {string} collectionName - Nom de la collection.
 * @returns {Promise<number>} Nombre total de documents.
 */
async function getTotalCount(collectionName) {
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  return await db.collection(collectionName).countDocuments();
}

/**
 * Calculer la moyenne d'un champ dans une collection.
 * @param {string} collectionName - Nom de la collection.
 * @param {string} fieldName - Nom du champ.
 * @returns {Promise<number|null>} Moyenne du champ ou null si aucun document.
 */
async function getAverageField(collectionName, fieldName) {
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  const result = await db.collection(collectionName).aggregate([
    { $group: { _id: null, avgField: { $avg: `$${fieldName}` } } },
  ]).toArray();
  return result.length > 0 ? result[0].avgField : null;
}

/**
 * Effectuer une opération d'agrégation personnalisée.
 * @param {string} collectionName - Nom de la collection.
 * @param {Array<Object>} pipeline - Pipeline d'agrégation.
 * @returns {Promise<Array>} Résultat de l'agrégation.
 */
async function aggregate(collectionName, pipeline) {
  await dbConnection.connectMongo(); // Assurer la connexion à MongoDB
  const db = dbConnection.getDb(); // Obtenir l'instance de la base de données
  return await db.collection(collectionName).aggregate(pipeline).toArray();
}

// Export des services
module.exports = {
  findOneById,
  getAll,
  insertOne,
  updateOneById,
  deleteOneById,
  getTotalCount,
  getAverageField,
  aggregate,
};
