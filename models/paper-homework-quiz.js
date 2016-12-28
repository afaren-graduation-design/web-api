'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperHomeworkQuizSchema = new Schema({
  'homeworkName': String,
  'evaluateScript': String,
  'templateRepository': String,
  'createTime': Number,
  'description': String,
  'id': Number,
  'type': String,
  'uri': String
});

module.exports = mongoose.model('PaperHomeworkQuiz', paperHomeworkQuizSchema);
