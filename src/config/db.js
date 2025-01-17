// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : 
// Un module séparé pour les connexions permet de centraliser et réutiliser la logique de connexion. Cela facilite la maintenance, 
// la gestion des erreurs et la configuration des connexions dans un seul endroit. Cela respecte également le principe de séparation des préoccupations.

// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : 
// Pour gérer proprement la fermeture des connexions, il est important de s'assurer que chaque client (MongoDB, Redis, etc.) 
// est correctement fermé lorsque l'application se termine ou rencontre une erreur. Cela inclut la gestion des événements système 
// comme SIGINT, en utilisant des méthodes telles que `client.close()` pour MongoDB et `client.quit()` pour Redis.

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

// Fonction pour se connecter à MongoDB
async function connectMongo() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!mongoUri || !dbName) {
      throw new Error('MONGODB_URI or MONGODB_DB_NAME is not defined in environment variables');
    }

    // Connexion à MongoDB
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db(dbName); // Sélection de la base de données
    console.log(`Connexion à MongoDB réussie (Base de données : ${dbName})`);
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    // Arrêt immédiat des tests si la connexion échoue
    if (process.env.NODE_ENV === 'test') {
      throw new Error('MongoDB connection failed during tests');
    } else {
      // Tentatives de reconnexion en cas d'échec en production
      setTimeout(connectMongo, 5000); // Nouvelle tentative après 5 secondes
    }
  }
}

// Fonction pour se connecter à Redis
async function connectRedis() {
  try {
    const redisUri = process.env.REDIS_URI;

    if (!redisUri) {
      throw new Error('REDIS_URI is not defined in environment variables');
    }

    // Connexion à Redis
    redisClient = redis.createClient({ url: redisUri });
    redisClient.on('connect', () => {
      console.log('Connexion à Redis réussie');
    });
    redisClient.on('error', (err) => {
      console.error('Erreur de connexion à Redis:', err);
      // Tentatives de reconnexion en cas d'erreur
      if (process.env.NODE_ENV !== 'test') {
        setTimeout(connectRedis, 5000); // Nouvelle tentative après 5 secondes
      } else {
        throw new Error('Redis connection failed during tests');
      }
    });
    await redisClient.connect();
  } catch (error) {
    console.error('Erreur de connexion à Redis:', error);
    // Tentatives de reconnexion en cas d'erreur
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(connectRedis, 5000); // Nouvelle tentative après 5 secondes
    } else {
      throw new Error('Redis connection failed during tests');
    }
  }
}

// Fonction pour fermer proprement les connexions
async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('Connexion MongoDB fermée');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('Connexion Redis fermée');
    }
  } catch (error) {
    console.error('Erreur lors de la fermeture des connexions:', error);
  }
}

// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getDb: () => db,
  getRedisClient: () => redisClient,
};
