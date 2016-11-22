var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeworkDefinition = new Schema({
  description: String,
  makerId: Number,
  makerName: String,
  status: Number,
  createTime: String,
  isDeleted: Boolean,
  uri: String,
  evaluateScript: String,
  templateRepository: String,
  result: String,
  name: String,
  definitionRepo: String,
  type: String
});

module.exports = mongoose.model('HomeworkDefinition', homeworkDefinition);

