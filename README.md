# Learning Platform NoSQL  
### Réalisé par **Touré Alassane**

---

## 📝 **Description Générale du Projet**

Ce projet est une plateforme d'apprentissage utilisant les bases de données NoSQL (MongoDB et Redis). Il vise à fournir une API performante et scalable pour la gestion des cours et des étudiants, tout en illustrant les concepts clés des bases de données NoSQL.

Le projet est conçu pour répondre aux besoins d'une application éducative moderne, avec un backend robuste qui peut supporter un grand nombre de requêtes tout en offrant une gestion rapide des données grâce à l'utilisation de Redis pour la mise en cache et de MongoDB pour le stockage principal.

---

## ⚙️ **Fonctionnalités Développées**

### 1. **Gestion des Cours**
- **Endpoints CRUD :**
  - Création, mise à jour, suppression, et récupération des cours.
  - MongoDB est utilisé pour le stockage des informations relatives aux cours.
- **Choix :**
  - MongoDB est adapté pour des collections flexibles et facilement extensibles, ce qui le rend idéal pour gérer les données non relationnelles des cours.

### 2. **Gestion des Étudiants**
- **Endpoints CRUD :**
  - Création, mise à jour, suppression, et récupération des informations des étudiants.
  - MongoDB stocke toutes les données des étudiants.
- **Choix :**
  - Les relations entre étudiants et cours sont modélisées de manière efficace grâce à MongoDB, permettant de naviguer entre les collections.

### 3. **Mise en Cache avec Redis**
- **Endpoints Optimisés :**
  - Utilisation de Redis pour mettre en cache les requêtes fréquentes (comme la récupération des cours les plus populaires).
- **Choix :**
  - Redis améliore les performances en réduisant les appels à MongoDB pour des données fréquemment demandées.

### 4. **Validation des Variables d'Environnement**
- **Pourquoi ?**
  - Garantir que toutes les configurations nécessaires (comme les URI de base de données) sont présentes pour éviter des erreurs inattendues.
- **Implémentation :**
  - Une fonction dédiée (`validateEnv()`) vérifie toutes les variables d'environnement au démarrage.

### 5. **Fermeture Propre des Connexions**
- **Pourquoi ?**
  - Éviter les fuites de ressources en fermant proprement les connexions à MongoDB et Redis lors de l'arrêt de l'application.
- **Implémentation :**
  - Gestion des signaux système (`SIGINT`, `SIGTERM`) pour s'assurer que toutes les connexions sont fermées correctement avec `client.close()` et `client.quit()`.

---

## 🚀 **Prérequis**

Avant de cloner et d'exécuter ce projet, assurez-vous de disposer des éléments suivants :

### 1. **Node.js et npm**
- Installez Node.js (version 14 ou supérieure) depuis [nodejs.org](https://nodejs.org/).

### 2. **MongoDB**
- Téléchargez et installez MongoDB depuis [mongodb.com](https://www.mongodb.com/try/download/community).
- Lancez le serveur MongoDB localement ou configurez une URI MongoDB distante.

### 3. **Redis**
- Téléchargez et installez Redis depuis [redis.io](https://redis.io/download).
- Assurez-vous que le serveur Redis est en cours d'exécution.

### 4. **Fichier `.env`**
- Créez un fichier `.env` à la racine du projet avec les clés suivantes :
  ```env
  MONGODB_URI=mongodb://(host_IP)/your-database-name
  MONGODB_DB_NAME=your-database-name
  REDIS_URI=(host_IP)
  PORT=3000
  ```
  Remplacez `your-database-name` par le nom de votre base MongoDB.

---

## 📂 **Structure du Projet**

```
learning-platform-nosql/
│
├── src/
│   ├── config/
│   │   ├── env.js       # Configuration et validation des variables d'environnement
│   │   ├── db.js        # Connexions MongoDB et Redis
│   │
│   ├── routes/
│   │   ├── courseRoutes.js  # Endpoints pour les cours
│   │   ├── studentRoutes.js # Endpoints pour les étudiants
│   │
│   ├── controllers/
│   │   ├── courseController.js   # Logique métier pour les cours
│   │   ├── studentController.js  # Logique métier pour les étudiants
│   │
│   └── app.js           # Point d'entrée principal
│
├── tests/
│   ├── mongodb.test.js  # Tests unitaires pour MongoDB
│
├── .env                 # Variables d'environnement (non inclus dans le dépôt)
├── package.json         # Dépendances et scripts npm
├── README.md            # Documentation
└── ...

```

---

## 🛠️ **Installation et Exécution**

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Alasko25/learning-platform-nosql.git
   cd learning-platform-nosql
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer le fichier `.env`**
   - Suivez les instructions dans la section [Prérequis](#prérequis).

4. **Lancer l'application**
   ```bash
   npm start
   ```

5. **Exécuter les tests**
   ```bash
   npm test
   ```

---

## 📖 **Choix Techniques et Explications**

### MongoDB
- **Pourquoi ?**
  - Stockage flexible pour les données non structurées.
  - Supporte facilement les collections liées (par exemple, étudiants et cours).

### Redis
- **Pourquoi ?**
  - Améliore la rapidité des réponses avec la mise en cache des requêtes fréquentes.
  - Idéal pour gérer des données temporaires comme les tokens d'authentification ou les sessions.

### Gestion des Variables d'Environnement
- **Pourquoi ?**
  - Permet une configuration flexible pour différents environnements (développement, test, production).

---

## 🌟 **Améliorations Futures**

- Ajouter une couche d'authentification pour sécuriser les endpoints.
- Implémenter une pagination pour les grandes collections.
- Ajouter des métriques de performance avec un outil comme Prometheus.

---

## 👨‍💻 **Auteur**

- **Touré Alassane**  
  Étudiant à l'ENSET Mohammedia  