'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var homeWorkScoringSchema = new Schema({
  userId: Number,
  gitRepoUrl: String,
  gitRepoBranch: { type: String, default: "master"},
  status: {type: Number, enum: [1,2,3,4,5]}
});

module.exports = mongoose.model('homeWorkScoring', homeWorkScoringSchema);
