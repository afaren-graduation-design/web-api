var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeworkDefinition = new Schema({
  description: String,
  makerId: Number,
  status: {
    type: Number,
    default: 1
  },
  answerPath: String,
  createTime: Number,
  isDeleted: Boolean,
  uri: String,
  evaluateScript: String,
  templateRepository: String,
  result: String,
  name: {
    type: String,
    unique: true
  },
  definitionRepo: String,
  stackId: Number
});

module.exports = mongoose.model('HomeworkDefinition', homeworkDefinition);

