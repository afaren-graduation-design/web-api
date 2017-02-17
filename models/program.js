const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  programId: Number,
  programUrl: String,
  programCode: String
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;