// Question: Comment organiser le point d'entrée de l'application ?
// Réponse:
// Le point d'entrée de l'application est organisé dans `app.js`. Ce fichier
// est responsable de l'initialisation du serveur, de la configuration des 
// connexions aux bases de données et du montage des routes. Il commence
// par importer les modules nécessaires (Express, la configuration, et les
// routes), puis configure les middlewares et les connexions à la base de
// données avant de démarrer le serveur avec `startServer()`.

// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse:
// Le démarrage de l'application est géré dans la fonction `startServer()`,
// qui est appelée au bas du fichier. Cette fonction commence par initialiser
// les connexions aux bases de données (MongoDB et Redis). Si ces connexions
// réussissent, les routes sont ensuite montées et le serveur est démarré.
// En cas d'erreur, le processus est arrêté avec `process.exit(1)`.
// Cela garantit que l'application ne démarre pas si les ressources essentielles
// ne sont pas disponibles.

const express = require('express');
const config = require('./config/env'); // Configuration des variables d'environnement (par exemple, port, DB URI)
const db = require('./config/db'); // Service de gestion des bases de données
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Initialiser les connexions aux bases de données
async function initializeDatabases() {
  try {
    // Connexion à MongoDB
    await db.connectMongo();  // Cette fonction est définie dans votre fichier db.js
    console.log('MongoDB connected successfully');

    // Connexion à Redis
    await db.connectRedis();  // Cette fonction est définie dans votre fichier db.js
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);  // Arrêt de l'application en cas d'échec de la connexion à la base de données
  }
}

// Configuration des routes
function setupRoutes() {
  app.use('/courses', courseRoutes); // Les routes pour les cours
  app.use('/students', studentRoutes); // Les routes pour les étudiants
}

// Démarrer le serveur
async function startServer() {
  try {
    // Initialiser les connexions à la base de données
    await initializeDatabases();

    // Configurer les routes
    setupRoutes();

    // Démarrer le serveur
    const port = config.PORT || 3000; // Utilise la variable d'environnement pour le port, ou 3000 par défaut
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  try {
    // Fermeture des connexions à la base de données (MongoDB et Redis)
    await db.closeMongo();  // Implémenter cette fonction pour fermer la connexion MongoDB
    await db.closeRedis();  // Implémenter cette fonction pour fermer la connexion Redis
    console.log('Gracefully shutting down the server...');
    process.exit(0);
  } catch (error) {
    console.error('Error during server shutdown:', error);
    process.exit(1);
  }
});

// Démarrer l'application
startServer();
