const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();


module.exports.connect = async () => {
  const uri = await mongoServer.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
}

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  const jobs = [];

  for (const key in collections) {
    const collection = collections[key];
    jobs.push(collection.deleteMany());
  }

  await Promise.all(jobs);
}
