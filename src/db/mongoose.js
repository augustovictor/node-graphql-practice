const { MongoClient } = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/graphql-practice';

const connectMongo = async () => {
    const db = await MongoClient.connect(MONGO_URL);
    return {
        Links: db.collection('links'),
        Users: db.collection('users'),
        Votes: db.collection('votes')
    };
};

module.exports = { connectMongo };