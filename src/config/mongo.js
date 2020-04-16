const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Config } = require('./../models');

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;

const connect = async () => {
  const uri = await mongoServer.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
}

const preloadConfig = async () => {
  await Config.insertMany([{
    provider: 'test-provider-1',
    vin: 0,
    make: 1,
    model: 2,
    mileague: 3,
    year: 4,
    price: 5,
    zipCode: 6,
    createDate: 7,
    updateDate: 8,
  }, {
    provider: 'test-provider-2',
    vin: 1,
    make: 2,
    model: 3,
    mileague: 5,
    year: 6,
    price: 7,
    zipCode: 8,
    createDate: 9,
    updateDate: 12,
  }]);

  console.log('Loaded config data');
};

const init = async () => {
  console.log('Connecting to mongoDb...');

  await connect();

  console.log('Connected to mongoDb');

  // Init config
  await preloadConfig();
};

exports.init = init;
