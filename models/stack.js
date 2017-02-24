const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stackSchema = new Schema({
  title: String,
  description: String,
  definition: String,
  status: {
    type: Number,
    default: 0
  }
});

const Stack = mongoose.model('Stack', stackSchema);
module.exports = Stack;