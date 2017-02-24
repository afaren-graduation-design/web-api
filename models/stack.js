const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stackSchema = new Schema({
  title: String,
  description: String,
  definition: String,
  status: Number
});

const Stack = mongoose.model('Stack', stackSchema);
module.exports = Stack;