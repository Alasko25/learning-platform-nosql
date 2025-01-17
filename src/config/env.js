// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : 
// Valider les variables d'environnement au démarrage garantit que toutes les informations nécessaires au bon fonctionnement de l'application
// sont disponibles. Cela évite les erreurs imprévues pendant l'exécution causées par des variables manquantes ou mal configurées.

// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : 
// Si une variable requise est manquante, l'application doit lever une erreur explicative et arrêter le démarrage.
// Cela évite des comportements imprévus ou des erreurs difficiles à diagnostiquer en production.

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`La variable d'environnement ${envVar} est manquante.`);
    }
  });
}

validateEnv(); // Appel de la fonction pour valider les variables d'environnement au démarrage

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};
