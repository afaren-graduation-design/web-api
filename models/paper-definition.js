'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperDefinitionSchema = new Schema({
  title: String,
  isDistribution: Boolean,
  description: String,
  programId: Number,
  makerId: Number,
  createTime: String,
  updateTime: String,
  isDeleted: Boolean,
  uri: String,
  sections: [
    {
      title: String,
      quizzes: Object
    }
  ]
});

module.exports = mongoose.model('PaperDefinition', paperDefinitionSchema);
