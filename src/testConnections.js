const { connectMongo, closeConnections, getDb } = require('./config/db');

async function testMongoFunctions() {
  console.log('=== Test MongoDB Functions ===');
  try {
    // Étape 1 : Connecter à MongoDB
    console.log('Connecting to MongoDB...');
    await connectMongo();
    console.log('Connected to MongoDB.');

    // Étape 2 : Récupérer la base de données
    const db = getDb();
    if (!db) {
      throw new Error('Failed to retrieve MongoDB database instance.');
    }

    console.log('Database instance retrieved successfully.');

    // Étape 3 : Créer une collection
    const testCollection = db.collection('test_collection');
    console.log('Created/Accessed "test_collection".');

    // Étape 4 : Insérer un document dans la collection
    const testDocument = { name: 'Test User', email: 'testuser@example.com', age: 25 };
    const insertResult = await testCollection.insertOne(testDocument);
    console.log('Inserted document:', insertResult.ops[0]);

    // Étape 5 : Récupérer le document inséré
    const fetchedDocument = await testCollection.findOne({ email: 'testuser@example.com' });
    console.log('Fetched document:', fetchedDocument);

    // Vérification
    if (fetchedDocument.email !== testDocument.email) {
      throw new Error('Fetched document does not match the inserted document.');
    }

    console.log('Document verification passed.');

    // Étape 6 : Nettoyer la collection
    await testCollection.deleteMany({});
    console.log('"test_collection" cleaned.');

    console.log('All MongoDB tests passed successfully!');

  } catch (error) {
    console.error('MongoDB test failed:', error.message);
  } finally {
    // Étape 7 : Fermer les connexions MongoDB
    console.log('Closing MongoDB connection...');
    await closeConnections();
    console.log('MongoDB connection closed.');
  }
}

testMongoFunctions();
