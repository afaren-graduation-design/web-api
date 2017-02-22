const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  programId: Number,
  makerId: Number,
  name: String,
  uriEnable: Boolean
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;