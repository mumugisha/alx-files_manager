import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    // Add the `useUnifiedTopology` option
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.init();
  }

  async init() {
    try {
      await this.client.connect();
      this.db = this.client.db(DB_DATABASE);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      this.db = null;
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db ? this.db.collection('users').countDocuments() : 0;
  }

  async nbFiles() {
    return this.db ? this.db.collection('files').countDocuments() : 0;
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
