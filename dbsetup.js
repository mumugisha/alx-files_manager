const { MongoClient } = require('mongodb'); // Use destructuring

const url = 'mongodb://localhost:27017';
const dbName = 'files_manager';

// Define checkAndInsert before usage
async function checkAndInsert(db, collectionName, requiredCount, template) {
  const collection = db.collection(collectionName);

  try {
    const count = await collection.countDocuments();

    if (count < requiredCount) {
      const documents = Array.from(
        { length: requiredCount - count },
        (_, i) => ({
          name: `${template.name} ${i + count + 1}`,
        }),
      ); // Ensure trailing comma for multiline objects

      const result = await collection.insertMany(documents);
      console.log(
        `Inserted ${result.insertedCount} documents into '${collectionName}'`,
      );
    } else {
      console.log(
        `No documents need to be added to '${collectionName}'`,
      );
    }
  } catch (err) {
    console.error(`Error processing '${collectionName}': `, err);
  }
}

(async () => {
  try {
    const client = await MongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);

    // Check 'users' collection
    await checkAndInsert(db, 'users', 4, { name: 'User' });

    // Check 'files' collection
    await checkAndInsert(db, 'files', 30, { name: 'File' });

    await client.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
})();
