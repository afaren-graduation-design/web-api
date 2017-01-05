'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperDefinitionSchema = new Schema({
  paperName: String,
  isDistribution: Boolean,
  description: String,
  programId: Number,
  makerId: Number,
  createTime: Number,
  updateTime: String,
  isDeleted: Boolean,
  uri: String,
  sections: [
    {
      title: String,
      quizzes: Object,
      type: String
    }
  ]
}, {typeKey: '$type'});

module.exports = mongoose.model('PaperDefinition', paperDefinitionSchema);
