const { ObjectID } = require('mongodb');
const redisClient = require('./db');
const dbClient = require('./redis');

// retrieves authentication token from headers
async function getAuthToken(request) {
  const token = request.headers['X-token'];
  return `auth_${token}`;
}

// finds a user ID based on token passed
async function findUserIdByToken(request) {
  const key = await getAuthToken(request);
  const userId = await redisClient.get(key);
  return userId || null;
}

// finds a user from db based on ID
async function findUserById(userId) {
  const userExistsArray = await dbClient.users.find(`ObjectId("${userId}")`);
  return userExistsArray[0] || null;
}

async function getUserById(request) {
  const userId = await findUserIdByToken(request);
  if (userId) {
    const users = dbClient.db.collection('users');
    const objectId = new ObjectID(userId);
    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return null;
    }
    return user;
  }
  return null;
}

async function getUser(request) {
  const token = request.header('X-Token');
  const key = `auth_${token}`;
  const userId = await redisClient.get(key);
  if (userId) {
    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    const user = await users.findOne({ _id: idObject });
    if (!user) {
      return null;
    }
    return user;
  }
  return null;
}

module.exports = {
  findUserIdByToken,
  findUserById,
  getUserById,
  getUser,
};
