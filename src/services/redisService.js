// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// - En mettant en place un système de TTL (Time-To-Live) pour limiter la durée de vie des données en cache.
// - En invalidant les clés obsolètes ou inutilisées pour éviter une surcharge de mémoire.
// - En structurant les clés pour faciliter leur gestion et leur recherche.

// Question : Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :
// - Utiliser un format clair et structuré, comme "namespace:resource:id".
// - Ajouter des préfixes pour éviter les conflits entre différentes applications.
// - S'assurer que les clés ne sont ni trop longues ni trop courtes.

const redisConnection = require('../config/db'); // Importer la configuration pour Redis

// Fonctions utilitaires pour Redis

/**
 * Mettre en cache des données avec une clé et un TTL.
 * @param {string} key - La clé pour identifier les données dans Redis.
 * @param {Object} data - Les données à mettre en cache.
 * @param {number} ttl - Temps de vie des données en cache (en secondes).
 * @returns {Promise<void>}
 */
async function cacheData(key, data, ttl) {
  try {
    await redisConnection.connectRedis(); // Assurer la connexion à Redis
    const redisClient = redisConnection.getRedisClient(); // Obtenir le client Redis
    const stringData = JSON.stringify(data);
    await redisClient.set(key, stringData, { EX: ttl }); // Mettre en cache avec TTL
  } catch (error) {
    console.error(`Erreur lors de la mise en cache avec la clé "${key}":`, error);
    throw error;
  }
}

/**
 * Récupérer des données depuis le cache.
 * @param {string} key - La clé pour identifier les données dans Redis.
 * @returns {Promise<Object|null>} - Les données mises en cache ou null si non trouvées.
 */
async function getCachedData(key) {
  try {
    await redisConnection.connectRedis(); // Assurer la connexion à Redis
    const redisClient = redisConnection.getRedisClient(); // Obtenir le client Redis
    const stringData = await redisClient.get(key);
    return stringData ? JSON.parse(stringData) : null; // Convertir les données en objet JavaScript
  } catch (error) {
    console.error(`Erreur lors de la récupération de la clé "${key}":`, error);
    throw error;
  }
}

/**
 * Supprimer une clé spécifique dans Redis.
 * @param {string} key - La clé à supprimer.
 * @returns {Promise<boolean>} - Indique si la suppression a réussi.
 */
async function deleteCache(key) {
  try {
    await redisConnection.connectRedis(); // Assurer la connexion à Redis
    const redisClient = redisConnection.getRedisClient(); // Obtenir le client Redis
    const result = await redisClient.del(key);
    return result > 0; // Retourner true si une clé a été supprimée
  } catch (error) {
    console.error(`Erreur lors de la suppression de la clé "${key}":`, error);
    throw error;
  }
}

/**
 * Vérifier si une clé existe dans Redis.
 * @param {string} key - La clé à vérifier.
 * @returns {Promise<boolean>} - Indique si la clé existe.
 */
async function keyExists(key) {
  try {
    await redisConnection.connectRedis(); // Assurer la connexion à Redis
    const redisClient = redisConnection.getRedisClient(); // Obtenir le client Redis
    const exists = await redisClient.exists(key);
    return exists === 1; // Retourner true si la clé existe
  } catch (error) {
    console.error(`Erreur lors de la vérification de la clé "${key}":`, error);
    throw error;
  }
}

/**
 * Effacer tout le cache Redis (utilisation prudente).
 * @returns {Promise<void>}
 */
async function clearCache() {
  try {
    await redisConnection.connectRedis(); // Assurer la connexion à Redis
    const redisClient = redisConnection.getRedisClient(); // Obtenir le client Redis
    await redisClient.flushAll(); // Supprimer toutes les clés dans Redis
  } catch (error) {
    console.error('Erreur lors de la suppression de tout le cache Redis:', error);
    throw error;
  }
}

// Export des services Redis
module.exports = {
  cacheData,
  getCachedData,
  deleteCache,
  keyExists,
  clearCache,
};
