const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  programId: String,
  programName: String,
  uriEnable: Boolean
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;