'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperLogicPuzzleSchema = new Schema({
  'question': String,
  'description': String,
  'id': Number,
  'chartPath': String,
  'initializedBox': String
});

module.exports = mongoose.model('PaperLogicPuzzle', paperLogicPuzzleSchema);
