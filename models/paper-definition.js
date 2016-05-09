'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperDefinitionSchema = new Schema({
  paperName: String,
  isPublished: Boolean,
  groupId: Number,
  groupHashId: Schema.Types.ObjectId,
  makerId: Number,
  updateTime: Number,
  createTime: Number,
  logicPuzzleSections: [{
    easyCount: Number,
    normalCount: Number,
    hardCount: Number
  }],
  homeworkSections: [{
    definitionRepo: String,
    branch: String,
    templateRepo: String,
    descriptionAddress: String,
    inspectionAddress: String
  }]
});

module.exports = mongoose.model('PaperDefinition', paperDefinitionSchema);