const { parseCsv } = require('../util/csv.util');
const { Config, Order } = require('../models');

/**
 * Returns the CSV config for an specific provider.
 * @param {String} provider the provider to get its config
 */
const getConfig = async (provider) => {
  const config = await Config.findOne({ provider });

  if (config) {
    const sanitized = config.toObject();
    delete sanitized.__v;
    delete sanitized._id;

    return sanitized;
  }

  return null;
}

/**
 * Process a given csv (path) and inserts it into a db
 * @param {String} filePath - The path of the file to be processed
 * @param {String} provider - The provider to be used to parse the file
 * @param {String} processId - unique process id generated. Can be used to track progress.
 */
const processUpload = async (filePath, provider, processId) => {
  const config = await getConfig(provider);

  if (!config) {
    throw new Error(`No config was found for provider ${provider}`);
  }

  // The size of the chunks can be changed in a config file
  const { data, total } = await parseCsv(filePath, config, 4);

  console.log('Total rows to process: ', total);

  return processBulkOrders(data);
};

/**
 * Inits the process of saving rows to the order collection.
 * @param {Array<Array>} chunks - An array of chunks to be processed [[],[],[]]
 */
const processBulkOrders = (chunks) => {
  return new Promise((resolve, reject) => {
    insertOrders(chunks, resolve, reject);
  });
};

/**
 * inserts a chunk of rows into the orders.
 * @param {Array<Array>} chunks - An array of chunks to be processed [[],[],[]]
 * @param {Function} resolve - function to be called when the process is completed 
 * @param {Function} reject - function to be called when the process fails
 */
const insertOrders = (chunks, resolve, reject) => {
  const toProcess = chunks.shift();

  Order.insertMany(toProcess)
    .then(() => {
      if (chunks.length === 0) {
        console.log('Finished inserting orders to db');
        resolve();
        return;
      }

      process.nextTick(() => {
        insertOrders(chunks, resolve, reject);
      });
    })
    .catch(reject);
};

exports.getConfig = getConfig;
exports.processUpload = processUpload;
exports.processBulkOrders = processBulkOrders;
