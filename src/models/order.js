const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  vin: String,
  make: String,
  model: String,
  mileague: Number,
  year: Number,
  price: Number,
  zipCode: String,
  createDate: String, // as ISO date
  updateDate: String,
});

const Order = mongoose.model('Order', orderSchema, 'order');

module.exports = Order;
