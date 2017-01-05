var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeworkDefinition = new Schema({
  description: String,
  makerId: Number,
  status: Number,
  createTime: String,
  isDeleted: Boolean,
  uri: String,
  evaluateScript: String,
  templateRepository: String,
  result: String,
  name: {type: String, unique: true},
  definitionRepo: String,
  stackId: Number
});

module.exports = mongoose.model('HomeworkDefinition', homeworkDefinition);

