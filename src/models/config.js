const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Defines the positions in the CSV file with 0 based index
const configSchema = new Schema({
  provider: String,
  headers: Boolean,
  vin: Number,
  make: Number,
  model: Number,
  mileague: Number,
  year: Number,
  price: Number,
  zipCode: Number,
  createDate: Number,
  updateDate: Number,
});

const Config = mongoose.model('Config', configSchema, 'config');

module.exports = Config;
